from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import AnimateurProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Lecture du profil courant."""

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'role',
            'is_verified',
            'is_active',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'email',
            'role',
            'is_verified',
            'is_active',
            'created_at',
            'updated_at',
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=(('CLIENT', 'Client'), ('ANIMATEUR', 'Animateur'), ('ADMIN', 'Admin')),
        required=False,
        default='CLIENT',
    )
    first_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    last_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    admin_key = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'role',
            'first_name',
            'last_name',
            'phone',
            'admin_key',
        )

    def validate(self, attrs):
        role = attrs.get('role', 'CLIENT')
        if role == 'ADMIN':
            provided = attrs.get('admin_key', '')
            expected = getattr(settings, 'ADMIN_REGISTRATION_KEY', '')
            if not expected or provided != expected:
                raise serializers.ValidationError(
                    {'admin_key': 'Clé admin invalide ou configuration manquante.'}
                )
        if role == 'ANIMATEUR':
            for field in ('first_name', 'last_name', 'phone'):
                if not attrs.get(field):
                    raise serializers.ValidationError(
                        {field: 'Ce champ est requis pour un compte animateur.'}
                    )
        return attrs

    def create(self, validated_data):
        role = validated_data.get('role', 'CLIENT')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        phone = validated_data.pop('phone', '')
        validated_data.pop('admin_key', None)

        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                role=role,
                is_staff=(role == 'ADMIN'),
                is_superuser=(role == 'ADMIN'),
            )
            if role == 'ANIMATEUR':
                AnimateurProfile.objects.create(
                    user=user,
                    first_name=first_name,
                    last_name=last_name,
                    phone=phone,
                )
        return user


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        return token


class AnimateurProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='ANIMATEUR'),
        source='user',
        write_only=True,
        required=False,
    )

    class Meta:
        model = AnimateurProfile
        fields = (
            'id',
            'user_id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'bio',
            'is_available',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'email', 'created_at', 'updated_at')


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    token = serializers.CharField()
    uidb64 = serializers.CharField()


def decode_uid(uidb64):
    try:
        raw = urlsafe_base64_decode(uidb64).decode()
        return User.objects.get(pk=raw)
    except (User.DoesNotExist, ValueError, TypeError, UnicodeDecodeError):
        return None


def make_verification_uid_token(user):
    uid = urlsafe_base64_encode(force_bytes(str(user.pk)))
    token = default_token_generator.make_token(user)
    uid_value = uid.decode() if hasattr(uid, 'decode') else uid
    return uid_value, token


class AdminCreateAnimateurSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Cet e-mail est déjà utilisé.")
        return value

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        phone = validated_data.pop('phone')

        user = User.objects.create_user(
            email=email,
            password=password,
            role='ANIMATEUR',
            is_verified=True # Admin created accounts are pre-verified
        )
        profile = AnimateurProfile.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
        return profile
