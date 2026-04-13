from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # Django Admin Native
    path('django-admin/', admin.site.urls),
    
    # API Authentication
    path('api/auth/', include('accounts.urls')),
    
    # API Apps
    path('api/services/', include('services.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('api/animateur/', include('animateur.urls')),
    
    # Admin Custom Views Prefix (if any)
    # path('api/admin/', include('custom_admin.urls')), # To be implemented
    
    # Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serving media and static files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
