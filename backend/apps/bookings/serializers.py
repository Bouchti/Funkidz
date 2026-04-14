from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers

from services.models import Option, ServiceOption

from .models import Booking, BookingAssignment, BookingOption


class BookingOptionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='option.name', read_only=True)

    class Meta:
        model = BookingOption
        fields = ('id', 'option', 'name', 'quantity', 'unit_price', 'total_price')
        read_only_fields = ('id', 'unit_price', 'total_price')


class BookingAssignmentNestedSerializer(serializers.ModelSerializer):
    animateur_name = serializers.SerializerMethodField()

    class Meta:
        model = BookingAssignment
        fields = (
            'id',
            'animateur',
            'animateur_name',
            'status',
            'assigned_by',
            'assigned_at',
            'responded_at',
        )
        read_only_fields = (
            'id',
            'animateur',
            'animateur_name',
            'status',
            'assigned_by',
            'assigned_at',
            'responded_at',
        )

    def get_animateur_name(self, obj):
        return f'{obj.animateur.first_name} {obj.animateur.last_name}'


class BookingSerializer(serializers.ModelSerializer):
    options = BookingOptionSerializer(many=True, read_only=True)
    assignments = BookingAssignmentNestedSerializer(many=True, read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id',
            'booking_number',
            'user',
            'service',
            'service_title',
            'status',
            'event_date',
            'start_time',
            'address',
            'city',
            'children_count',
            'duration_minutes',
            'notes',
            'estimated_price',
            'final_price',
            'cancelled_at',
            'cancellation_reason',
            'created_at',
            'updated_at',
            'options',
            'assignments',
        )
        read_only_fields = (
            'id',
            'booking_number',
            'user',
            'service',
            'status',
            'estimated_price',
            'final_price',
            'cancelled_at',
            'created_at',
            'updated_at',
            'options',
            'assignments',
        )


class BookingCreateSerializer(serializers.ModelSerializer):
    selected_options = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
        default=list,
    )

    class Meta:
        model = Booking
        fields = (
            'service',
            'event_date',
            'start_time',
            'address',
            'city',
            'children_count',
            'duration_minutes',
            'notes',
            'selected_options',
        )

    def validate(self, data):
        event_date = data['event_date']
        start_time = data['start_time']
        if Booking.objects.filter(event_date=event_date, start_time=start_time).exists():
            raise serializers.ValidationError(
                {'non_field_errors': ['Ce créneau est déjà réservé.']}
            )
        if event_date < timezone.now().date():
            raise serializers.ValidationError(
                {'event_date': "La date de l'événement doit être dans le futur."}
            )

        selected_options_data = self.initial_data.get('selected_options') or []
        for item in selected_options_data:
            if 'id' not in item:
                raise serializers.ValidationError(
                    {'selected_options': 'Chaque option doit contenir un champ "id".'}
                )

        service = data['service']
        option_ids = [item['id'] for item in selected_options_data]
        if option_ids:
            allowed = {
                str(v)
                for v in ServiceOption.objects.filter(
                    service=service,
                    option_id__in=option_ids,
                    option__is_active=True,
                ).values_list('option_id', flat=True)
            }
            missing = set(option_ids) - allowed
            if missing:
                raise serializers.ValidationError(
                    {
                        'selected_options': 'Certaines options ne sont pas disponibles pour ce service.'
                    }
                )
        return data

    def create(self, validated_data):
        selected_options_data = validated_data.pop('selected_options', [])
        user = self.context['request'].user
        service = validated_data.pop('service')

        booking = Booking.objects.create(
            user=user,
            service=service,
            estimated_price=Decimal('0.00'),
            status='PENDING',
            **validated_data,
        )

        base = service.base_price
        total_options = Decimal('0.00')

        for opt_data in selected_options_data:
            option = Option.objects.get(id=opt_data['id'])
            quantity = int(opt_data.get('quantity', 1))
            unit_price = option.price
            children_count = validated_data['children_count']
            duration_minutes = validated_data['duration_minutes']

            if option.pricing_type == 'FIXED':
                line_total = unit_price
            elif option.pricing_type == 'PER_CHILD':
                line_total = unit_price * Decimal(children_count)
            elif option.pricing_type == 'PER_HOUR':
                hours = Decimal(duration_minutes) / Decimal('60')
                line_total = unit_price * hours
            else:
                line_total = unit_price * Decimal(quantity)

            BookingOption.objects.create(
                booking=booking,
                option=option,
                quantity=quantity,
                unit_price=unit_price,
                total_price=line_total,
            )
            total_options += line_total

        booking.estimated_price = base + total_options
        booking.save(update_fields=['estimated_price'])

        return booking


class BookingAdminSerializer(serializers.ModelSerializer):
    options = BookingOptionSerializer(many=True, read_only=True)
    assignments = BookingAssignmentNestedSerializer(many=True, read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id',
            'booking_number',
            'user',
            'user_email',
            'service',
            'service_title',
            'status',
            'event_date',
            'start_time',
            'address',
            'city',
            'children_count',
            'duration_minutes',
            'notes',
            'estimated_price',
            'final_price',
            'cancelled_at',
            'cancellation_reason',
            'created_at',
            'updated_at',
            'options',
            'assignments',
        )
        read_only_fields = (
            'id',
            'booking_number',
            'user',
            'user_email',
            'service',
            'event_date',
            'start_time',
            'address',
            'city',
            'children_count',
            'duration_minutes',
            'notes',
            'estimated_price',
            'cancelled_at',
            'cancellation_reason',
            'created_at',
            'updated_at',
            'options',
            'assignments',
        )


class BookingAssignmentAdminSerializer(serializers.ModelSerializer):
    animateur_name = serializers.SerializerMethodField()
    booking_number = serializers.CharField(source='booking.booking_number', read_only=True)

    class Meta:
        model = BookingAssignment
        fields = (
            'id',
            'booking',
            'booking_number',
            'animateur',
            'animateur_name',
            'status',
            'assigned_by',
            'assigned_at',
            'responded_at',
        )
        read_only_fields = ('id', 'assigned_at', 'responded_at')

    def get_animateur_name(self, obj):
        return f'{obj.animateur.user.first_name} {obj.animateur.user.last_name}'
