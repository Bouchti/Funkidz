from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message: ContactMessage = serializer.save()

        send_mail(
            subject='Nous avons bien reçu votre message — Funkidz',
            message=(
                f'Bonjour {message.name},\n\n'
                f'Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais.\n\n'
                f'— L’équipe Funkidz'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[message.email],
            fail_silently=True,
        )

        return Response(
            {
                'message': 'Votre message a bien été envoyé. Nous vous recontacterons rapidement.',
                'id': str(message.id),
            },
            status=status.HTTP_201_CREATED,
        )
