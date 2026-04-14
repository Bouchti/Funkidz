from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from bookings.models import BookingAssignment

from .models import AnimateurProfile
from .permissions import IsAdmin
from .serializers import (
    AnimateurProfileSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
    AdminCreateAnimateurSerializer,
    decode_uid,
    make_verification_uid_token,
)

User = get_user_model()


def _send_verification_email(request, user):
    uid, token = make_verification_uid_token(user)
    path = reverse('verify-email')
    link = request.build_absolute_uri(f'{path}?uid={uid}&token={token}')
    subject = 'Vérifiez votre adresse e-mail — Funkidz'
    body = (
        f'Bonjour,\n\n'
        f'Pour activer votre compte, ouvrez ce lien :\n{link}\n\n'
        f'Si vous n’avez pas créé de compte, ignorez ce message.'
    )
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True)


def _send_password_reset_email(request, user):
    uid = user_pk_to_uidb64(user)
    token = default_token_generator.make_token(user)
    path = reverse('password-reset-confirm')
    link = request.build_absolute_uri(f'{path}?uidb64={uid}&token={token}')
    subject = 'Réinitialisation de votre mot de passe — Funkidz'
    body = (
        f'Bonjour,\n\n'
        f'Pour définir un nouveau mot de passe, ouvrez ce lien :\n{link}\n\n'
        f'Si vous n’avez pas demandé cette réinitialisation, ignorez ce message.'
    )
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True)


def user_pk_to_uidb64(user):
    encoded = urlsafe_base64_encode(force_bytes(str(user.pk)))
    return encoded.decode() if hasattr(encoded, 'decode') else encoded


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _send_verification_email(request, user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'message': 'Inscription réussie. Un e-mail de vérification a été envoyé.',
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'Le champ "refresh" est requis.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {'detail': 'Jeton de rafraîchissement invalide.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class VerifyEmailView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')
        if not uid or not token:
            return Response(
                {'detail': 'Paramètres uid et token requis.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = decode_uid(uid)
        if user is None or not default_token_generator.check_token(user, token):
            return Response(
                {'detail': 'Lien de vérification invalide ou expiré.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.is_verified = True
        user.save(update_fields=['is_verified'])
        return Response({'message': 'Adresse e-mail vérifiée.'}, status=status.HTTP_200_OK)


class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower().strip()
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'message': 'Si un compte existe pour cet e-mail, un message a été envoyé.'},
                status=status.HTTP_200_OK,
            )
        _send_password_reset_email(request, user)
        return Response(
            {'message': 'Si un compte existe pour cet e-mail, un message a été envoyé.'},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        user = decode_uid(uidb64)
        if user is None or not default_token_generator.check_token(user, token):
            return Response(
                {'detail': 'Lien invalide ou expiré.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save(update_fields=['password'])
        return Response({'message': 'Mot de passe mis à jour.'}, status=status.HTTP_200_OK)


class AnimateurProfileViewSet(viewsets.ModelViewSet):
    serializer_class = AnimateurProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return AnimateurProfile.objects.select_related('user').all()
        return AnimateurProfile.objects.select_related('user').filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'ADMIN':
            if 'user' not in serializer.validated_data:
                raise ValidationError({'user_id': 'Ce champ est requis pour un administrateur.'})
            serializer.save()
            return
        if user.role != 'ANIMATEUR':
            raise PermissionDenied
        if hasattr(user, 'animateur_profile'):
            raise ValidationError(
                {'non_field_errors': ['Un profil animateur existe déjà pour ce compte.']}
            )
        serializer.save(user=user)

    def perform_update(self, serializer):
        if self.request.user.role != 'ADMIN' and serializer.instance.user_id != self.request.user.id:
            raise PermissionDenied
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'ADMIN':
            raise PermissionDenied
        instance.delete()


class AvailableAnimateurListView(generics.ListAPIView):
    serializer_class = AnimateurProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.role != 'ADMIN':
            raise PermissionDenied

        date_str = self.request.query_params.get('date')
        if not date_str:
            return AnimateurProfile.objects.select_related('user').filter(is_available=True)

        # Basic availability check: animateur is available generally 
        # and has no ACCEPTED assignment on this day.
        # (A more complex check would look at time overlaps)
        occupied_animateur_ids = BookingAssignment.objects.filter(
            booking__event_date=date_str,
            status='ACCEPTED'
        ).values_list('animateur_id', flat=True)

        return AnimateurProfile.objects.select_related('user').filter(
            is_available=True
        ).exclude(id__in=occupied_animateur_ids)


class AdminCreateAnimateurView(generics.CreateAPIView):
    serializer_class = AdminCreateAnimateurSerializer
    permission_classes = (IsAdmin,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()
        return Response(
            AnimateurProfileSerializer(profile).data,
            status=status.HTTP_201_CREATED
        )
