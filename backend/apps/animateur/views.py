from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.response import Response

from accounts.models import AnimateurProfile
from accounts.permissions import IsAnimateur
from bookings.models import Booking, BookingAssignment

from .models import Availability
from .serializers import AssignmentSerializer, AvailabilitySerializer


def _animateur_profile_or_none(user):
    if not user or not user.is_authenticated:
        return None
    if getattr(user, 'role', None) != 'ANIMATEUR':
        return None
    try:
        return user.animateur_profile
    except AnimateurProfile.DoesNotExist:
        # Keep old animateur accounts usable even if profile row is missing.
        local_part = (user.email or '').split('@')[0] or 'animateur'
        return AnimateurProfile.objects.create(
            user=user,
            first_name=local_part[:100],
            last_name='Animateur',
            phone='N/A',
        )


class PlanningView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = (IsAnimateur,)

    def get_queryset(self):
        profile = _animateur_profile_or_none(self.request.user)
        if profile is None:
            return BookingAssignment.objects.none()
        return (
            BookingAssignment.objects.filter(animateur=profile)
            .select_related('booking', 'booking__service', 'animateur')
            .prefetch_related('booking__options', 'booking__assignments__animateur')
            .order_by('-assigned_at')
        )


class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = (IsAnimateur,)

    def get_queryset(self):
        profile = _animateur_profile_or_none(self.request.user)
        if profile is None:
            return Availability.objects.none()
        return Availability.objects.filter(animateur=profile)


class AssignmentRespondView(generics.UpdateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = (IsAnimateur,)
    http_method_names = ['patch', 'head', 'options']

    def get_queryset(self):
        profile = _animateur_profile_or_none(self.request.user)
        if profile is None:
            return BookingAssignment.objects.none()
        return BookingAssignment.objects.filter(animateur=profile)

    def partial_update(self, request, *args, **kwargs):
        assignment = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ('ACCEPTED', 'REFUSED'):
            return Response(
                {'detail': 'Le statut doit être ACCEPTED ou REFUSED.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        assignment.status = new_status
        assignment.responded_at = timezone.now()
        assignment.save(update_fields=['status', 'responded_at'])
        return Response(AssignmentSerializer(assignment, context={'request': request}).data)


class SelfAssignView(generics.GenericAPIView):
    permission_classes = (IsAnimateur,)

    def post(self, request):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response(
                {'detail': 'Le champ booking_id est requis.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'detail': 'Réservation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        profile = _animateur_profile_or_none(request.user)
        if profile is None:
            return Response(
                {'detail': 'Profil animateur introuvable.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if BookingAssignment.objects.filter(booking=booking, animateur=profile).exists():
            return Response(
                {'detail': 'Vous êtes déjà positionné sur cette réservation.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assignment = BookingAssignment.objects.create(
            booking=booking,
            animateur=profile,
            status='PENDING',
            assigned_by='ANIMATEUR',
        )
        return Response(
            AssignmentSerializer(assignment, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class AnimateurDashboardStatsView(generics.GenericAPIView):
    permission_classes = (IsAnimateur,)

    def get(self, request):
        profile = _animateur_profile_or_none(request.user)
        if not profile:
            return Response(
                {"detail": "Profil animateur introuvable."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pending_count = BookingAssignment.objects.filter(
            animateur=profile, status="PENDING"
        ).count()
        accepted_count = BookingAssignment.objects.filter(
            animateur=profile, status="ACCEPTED"
        ).count()

        # Next mission
        today = timezone.now().date()
        next_assignment = (
            BookingAssignment.objects.filter(
                animateur=profile, status="ACCEPTED", booking__event_date__gte=today
            )
            .select_related("booking", "booking__service")
            .order_by("booking__event_date", "booking__start_time")
            .first()
        )

        data = {
            "pending_count": pending_count,
            "accepted_count": accepted_count,
            "next_mission": AssignmentSerializer(
                next_assignment, context={"request": request}
            ).data
            if next_assignment
            else None,
        }
        return Response(data)


class AvailableMissionsListView(generics.ListAPIView):
    permission_classes = (IsAnimateur,)

    def get_serializer_class(self):
        from bookings.serializers import BookingSerializer

        return BookingSerializer

    def get_queryset(self):
        # Mission is available if CONFIRMED and has no ACCEPTED assignment
        accepted_booking_ids = BookingAssignment.objects.filter(
            status="ACCEPTED"
        ).values_list("booking_id", flat=True)

        return (
            Booking.objects.filter(status="CONFIRMED")
            .exclude(id__in=accepted_booking_ids)
            .select_related("service")
            .prefetch_related("options")
            .order_by("event_date", "start_time")
        )
