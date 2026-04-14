from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OptionAdminViewSet, ServiceAdminViewSet, ServiceDetailView, ServiceListView

router = DefaultRouter()
router.register(r'admin/services', ServiceAdminViewSet, basename='service-admin')
router.register(r'admin/options', OptionAdminViewSet, basename='option-admin')

urlpatterns = [
    path('', ServiceListView.as_view(), name='service-list'),
    path('<uuid:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('', include(router.urls)),
]
