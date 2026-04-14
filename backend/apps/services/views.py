from rest_framework import generics, permissions, viewsets

from accounts.permissions import IsAdmin

from .models import Option, Service
from .serializers import OptionSerializer, ServiceSerializer


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = (permissions.AllowAny,)


class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = (permissions.AllowAny,)


class ServiceAdminViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = (IsAdmin,)


class OptionAdminViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = (IsAdmin,)
