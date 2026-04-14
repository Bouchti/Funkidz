import json

import stripe
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from bookings.models import Booking

from .models import Payment

stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '') or 'sk_test_mock'


def _send_payment_received_email(booking):
    currency = getattr(getattr(booking, 'payment', None), 'currency', None) or 'EUR'
    subject = f'Paiement reçu — réservation {booking.booking_number}'
    body = (
        f'Bonjour,\n\n'
        f'Votre paiement pour la réservation {booking.booking_number} a bien été enregistré.\n'
        f'Montant : {booking.estimated_price} {currency}.\n\n'
        f'Merci de votre confiance !'
    )
    send_mail(
        subject,
        body,
        settings.DEFAULT_FROM_EMAIL,
        [booking.user.email],
        fail_silently=True,
    )


class CreateCheckoutSessionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response(
                {'detail': 'Le champ booking_id est requis.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            booking = Booking.objects.select_related('service', 'user').get(
                id=booking_id, user=request.user
            )
        except Booking.DoesNotExist:
            return Response({'detail': 'Réservation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status == 'PAID':
            return Response(
                {'detail': 'Cette réservation est déjà payée.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        frontend = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
        success_url = f'{frontend}/payment/success?session_id={{CHECKOUT_SESSION_ID}}'
        cancel_url = f'{frontend}/payment/cancel'

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'eur',
                            'product_data': {
                                'name': f'Animation Funkidz — {booking.service.title}',
                            },
                            'unit_amount': int(booking.estimated_price * 100),
                        },
                        'quantity': 1,
                    }
                ],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                client_reference_id=str(booking.id),
            )
        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        payment, _ = Payment.objects.update_or_create(
            booking=booking,
            defaults={
                'stripe_session_id': checkout_session.id,
                'amount': booking.estimated_price,
                'status': 'INITIATED',
                'currency': 'EUR',
            },
        )
        booking.status = 'PAYMENT_PENDING'
        booking.save(update_fields=['status'])

        return Response(
            {
                'session_url': checkout_session.url,
                'url': checkout_session.url,
                'session_id': checkout_session.id,
                'payment_id': str(payment.id),
            },
            status=status.HTTP_200_OK,
        )


class StripeWebhookView(APIView):
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '') or ''

        if settings.DEBUG and not endpoint_secret:
            try:
                event = json.loads(payload.decode('utf-8'))
            except (json.JSONDecodeError, UnicodeDecodeError):
                return HttpResponse(status=400)
        else:
            if not endpoint_secret:
                return HttpResponse(status=500)
            try:
                event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
            except ValueError:
                return HttpResponse(status=400)
            except stripe.error.SignatureVerificationError:  # type: ignore[attr-defined]
                return HttpResponse(status=400)

        event_type = event['type']
        if event_type == 'checkout.session.completed':
            session = event['data']['object']
            self._handle_session_completed(session)
        elif event_type in (
            'checkout.session.async_payment_failed',
            'checkout.session.expired',
        ):
            session = event['data']['object']
            self._handle_payment_failed(session)

        return HttpResponse(status=200)

    def _handle_session_completed(self, session):
        try:
            payment = Payment.objects.select_related('booking', 'booking__user').get(
                stripe_session_id=session['id']
            )
        except Payment.DoesNotExist:
            return

        payment.status = 'SUCCEEDED'
        payment.save(update_fields=['status'])

        booking = payment.booking
        booking.status = 'PAID'
        booking.save(update_fields=['status'])

        _send_payment_received_email(booking)

    def _handle_payment_failed(self, session):
        try:
            payment = Payment.objects.select_related('booking').get(stripe_session_id=session['id'])
        except Payment.DoesNotExist:
            return

        payment.status = 'FAILED'
        payment.save(update_fields=['status'])

        booking = payment.booking
        booking.status = 'PAYMENT_PENDING'
        booking.save(update_fields=['status'])
