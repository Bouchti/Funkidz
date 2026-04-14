import os
import uuid

from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers

from .models import MediaGallery


class MediaGallerySerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = MediaGallery
        fields = (
            'id',
            'title',
            'type',
            'file',
            'file_url',
            'thumbnail_url',
            'service',
            'is_visible',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def _store_file(self, request, upload):
        ext = os.path.splitext(upload.name)[1] or ''
        rel_path = f'gallery/{uuid.uuid4().hex}{ext}'
        saved_path = default_storage.save(rel_path, upload)
        normalized = saved_path.replace('\\', '/')
        media_url = settings.MEDIA_URL
        if not media_url.endswith('/'):
            media_url = f'{media_url}/'
        return request.build_absolute_uri(f'{media_url}{normalized}')

    def create(self, validated_data):
        request = self.context['request']
        upload = validated_data.pop('file', None)
        if upload:
            validated_data['file_url'] = self._store_file(request, upload)
        elif not validated_data.get('file_url'):
            raise serializers.ValidationError(
                {'file': 'Envoyez un fichier ou renseignez file_url.'}
            )
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context['request']
        upload = validated_data.pop('file', None)
        if upload:
            validated_data['file_url'] = self._store_file(request, upload)
        return super().update(instance, validated_data)
