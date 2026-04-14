from rest_framework import serializers

from .models import Option, Service, ServiceOption


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = (
            'id',
            'name',
            'description',
            'price',
            'pricing_type',
            'is_active',
        )


class ServiceOptionNestedSerializer(serializers.ModelSerializer):
    """Liaison service ↔ option avec détail Option."""

    option = OptionSerializer(read_only=True)

    class Meta:
        model = ServiceOption
        fields = ('id', 'option')


class ServiceSerializer(serializers.ModelSerializer):
    options = ServiceOptionNestedSerializer(many=True, read_only=True)
    selected_options = serializers.PrimaryKeyRelatedField(
        queryset=Option.objects.all(),
        many=True,
        write_only=True,
        required=False,
        source='compatible_options' # Dummy source, will handle in create/update
    )

    class Meta:
        model = Service
        fields = (
            'id',
            'title',
            'description',
            'base_price',
            'duration_minutes',
            'category',
            'is_active',
            'created_at',
            'updated_at',
            'options',
            'selected_options',
        )

    def create(self, validated_data):
        options_data = validated_data.pop('compatible_options', [])
        service = Service.objects.create(**validated_data)
        for opt in options_data:
            ServiceOption.objects.create(service=service, option=opt)
        return service

    def update(self, instance, validated_data):
        options_data = validated_data.pop('compatible_options', None)
        instance = super().update(instance, validated_data)
        
        if options_data is not None:
            # Refresh associations
            ServiceOption.objects.filter(service=instance).delete()
            for opt in options_data:
                ServiceOption.objects.create(service=instance, option=opt)
        
        return instance
