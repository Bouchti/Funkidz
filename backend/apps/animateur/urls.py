from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AssignmentRespondView,
    AvailabilityViewSet,
    PlanningView,
    SelfAssignView,
    AnimateurDashboardStatsView,
    AvailableMissionsListView,
)

router = DefaultRouter()
router.register(r'availabilities', AvailabilityViewSet, basename='availability')

urlpatterns = [
    path('planning/', PlanningView.as_view(), name='planning'),
    path('stats/', AnimateurDashboardStatsView.as_view(), name='stats'),
    path('available-missions/', AvailableMissionsListView.as_view(), name='available-missions'),
    path(
        'assignments/<uuid:pk>/respond/',
        AssignmentRespondView.as_view(),
        name='assignment-respond',
    ),
    path('self-assign/', SelfAssignView.as_view(), name='self-assign'),
    path('', include(router.urls)),
]
