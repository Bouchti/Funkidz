from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaGalleryListView, MediaGalleryAdminViewSet

router = DefaultRouter()
router.register(r'admin', MediaGalleryAdminViewSet, basename='gallery-admin')

urlpatterns = [
    path('', MediaGalleryListView.as_view(), name='gallery-list'),
    path('', include(router.urls)),
]
