from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminDashboardStatsView,
    BookingAdminViewSet,
    BookingAssignmentViewSet,
    BookingAvailabilityView,
    BookingCancelView,
    BookingCreateView,
    BookingDetailView,
    BookingListView,
)

router = DefaultRouter()
router.register(r'admin', BookingAdminViewSet, basename='booking-admin')
router.register(r'admin-assignments', BookingAssignmentViewSet, basename='booking-assignment-admin')

urlpatterns = [
    path('', BookingListView.as_view(), name='booking-list'),
    path('availability/', BookingAvailabilityView.as_view(), name='booking-availability'),
    path('create/', BookingCreateView.as_view(), name='booking-create'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('<uuid:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('<uuid:pk>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('', include(router.urls)),
]
