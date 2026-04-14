from datetime import datetime, time, timedelta

from django.db.models import Count, Q, Sum
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin

from .models import Booking, BookingAssignment
from .serializers import (
    BookingAdminSerializer,
    BookingAssignmentAdminSerializer,
    BookingCreateSerializer,
    BookingSerializer,
)


class BookingCreateView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as exc:
            errors = exc.detail
            event_date = request.data.get('event_date')
            start_time = request.data.get('start_time')
            slot_taken = bool(
                event_date
                and start_time
                and Booking.objects.filter(event_date=event_date, start_time=start_time).exists()
            )
            if slot_taken:
                return Response(errors, status=status.HTTP_409_CONFLICT)
            raise
        booking = serializer.save()
        return Response(
            BookingSerializer(booking, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class BookingAvailabilityView(APIView):
    """
    Créneaux horaires encore libres pour une date (toutes les 30 min, 08:00–20:00).
    Exclut les réservations non annulées sur le même jour.
    """

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response(
                {'detail': 'Paramètre date requis (YYYY-MM-DD).'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        event_date = parse_date(date_str)
        if not event_date:
            return Response({'detail': 'Date invalide.'}, status=status.HTTP_400_BAD_REQUEST)

        today = timezone.now().date()
        if event_date < today:
            return Response({'date': date_str, 'slots': []})

        booked_times = (
            Booking.objects.filter(event_date=event_date)
            .exclude(status='CANCELLED')
            .values_list('start_time', flat=True)
        )
        booked_normalized = set()
        for t in booked_times:
            if t is not None:
                s = t.strftime('%H:%M:%S')
                booked_normalized.add(s)

        slots = []
        t = time(8, 0, 0)
        end = time(20, 0, 0)
        while t <= end:
            key = t.strftime('%H:%M:%S')
            if key not in booked_normalized:
                slots.append(key)
            dt = datetime.combine(event_date, t) + timedelta(minutes=30)
            t = dt.time().replace(microsecond=0)

        return Response({'date': date_str, 'slots': slots})


class BookingListView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .select_related('service')
            .prefetch_related('options', 'assignments__animateur')
            .order_by('-created_at')
        )


class BookingDetailView(RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related('service').prefetch_related(
            'options', 'assignments__animateur'
        )


class BookingCancelView(UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Booking.objects.all()

    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        if booking.user_id != request.user.id:
            return Response(
                {'detail': "Vous n'êtes pas autorisé à annuler cette réservation."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if booking.status in ('CANCELLED', 'DONE'):
            return Response(
                {'detail': 'Cette réservation ne peut pas être annulée.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = 'CANCELLED'
        booking.cancelled_at = timezone.now()
        booking.save(update_fields=['status', 'cancelled_at'])
        return Response(BookingSerializer(booking).data)


class BookingAdminViewSet(viewsets.ModelViewSet):
    queryset = (
        Booking.objects.all()
        .select_related('user', 'service')
        .prefetch_related('options', 'assignments__animateur')
        .order_by('-created_at')
    )
    serializer_class = BookingAdminSerializer
    permission_classes = (IsAdmin,)
    http_method_names = ['get', 'patch', 'head', 'options']


class BookingAssignmentViewSet(viewsets.ModelViewSet):
    queryset = BookingAssignment.objects.all().select_related('booking', 'animateur__user')
    serializer_class = BookingAssignmentAdminSerializer
    permission_classes = (IsAdmin,)


class AdminDashboardStatsView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        stats = Booking.objects.aggregate(
            total_bookings=Count('id'),
            pending_count=Count('id', filter=Q(status='PENDING')),
            confirmed_count=Count('id', filter=Q(status='CONFIRMED')),
            paid_count=Count('id', filter=Q(status='PAID')),
            total_revenue=Sum('final_price', filter=Q(status='PAID')),
        )
        return Response(stats)
