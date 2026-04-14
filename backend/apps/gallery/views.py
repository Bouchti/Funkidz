from rest_framework import generics, permissions, viewsets

from accounts.permissions import IsAdmin

from .models import MediaGallery
from .serializers import MediaGallerySerializer


class MediaGalleryListView(generics.ListAPIView):
    queryset = MediaGallery.objects.filter(is_visible=True).select_related('service')
    serializer_class = MediaGallerySerializer
    permission_classes = (permissions.AllowAny,)


class MediaGalleryAdminViewSet(viewsets.ModelViewSet):
    queryset = MediaGallery.objects.all().select_related('service')
    serializer_class = MediaGallerySerializer
    permission_classes = (IsAdmin,)
