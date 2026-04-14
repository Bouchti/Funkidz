from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, MeView, 
    VerifyEmailView, PasswordResetView, PasswordResetConfirmView,
    AnimateurProfileViewSet, AvailableAnimateurListView, AdminCreateAnimateurView
)

router = DefaultRouter()
router.register(r'profiles', AnimateurProfileViewSet, basename='animateur-profile')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('admin/available-animateurs/', AvailableAnimateurListView.as_view(), name='admin-available-animateurs'),
    path('admin/create-animateur/', AdminCreateAnimateurView.as_view(), name='admin-create-animateur'),
    path('', include(router.urls)),
]
