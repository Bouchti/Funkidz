from rest_framework import serializers

from accounts.models import AnimateurProfile
from bookings.models import BookingAssignment

from .models import Availability


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = (
            'id',
            'animateur',
            'blocked_date',
            'blocked_start',
            'blocked_end',
            'reason',
            'created_at',
        )
        read_only_fields = ('id', 'animateur', 'created_at')

    def create(self, validated_data):
        try:
            profile = self.context['request'].user.animateur_profile
        except AnimateurProfile.DoesNotExist as exc:
            raise serializers.ValidationError(
                {'non_field_errors': ['Profil animateur introuvable.']}
            ) from exc
        validated_data['animateur'] = profile
        return super().create(validated_data)


class AssignmentSerializer(serializers.ModelSerializer):
    booking_details = serializers.SerializerMethodField()

    class Meta:
        model = BookingAssignment
        fields = (
            'id',
            'booking',
            'booking_details',
            'status',
            'assigned_by',
            'assigned_at',
            'responded_at',
        )
        read_only_fields = (
            'id',
            'booking',
            'status',
            'assigned_by',
            'assigned_at',
            'responded_at',
        )

    def get_booking_details(self, obj):
        from bookings.serializers import BookingSerializer

        return BookingSerializer(obj.booking).data
