import json
from datetime import date, timedelta, time

from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from bookings.models import Booking
from payments.models import Payment
from services.models import Service


class PaymentsWebhookTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='client@example.com', password='Secret123!')
        self.service = Service.objects.create(
            title='Service',
            description='desc',
            base_price='120.00',
            duration_minutes=120,
            category='Test',
            is_active=True,
        )
        self.booking = Booking.objects.create(
            user=self.user,
            service=self.service,
            event_date=date.today() + timedelta(days=2),
            start_time=time(14, 0),
            address='123 Test',
            city='Paris',
            children_count=10,
            duration_minutes=120,
            estimated_price='120.00',
            status='PAYMENT_PENDING',
        )
        self.payment = Payment.objects.create(
            booking=self.booking,
            stripe_session_id='cs_test_123',
            amount='120.00',
            status='INITIATED',
            currency='EUR',
        )
        self.webhook_url = reverse('stripe-webhook')

    @override_settings(DEBUG=True, STRIPE_WEBHOOK_SECRET='')
    def test_webhook_payment_succeeded_met_payment_succeeded_et_booking_paid(self):
        payload = {
            'type': 'checkout.session.completed',
            'data': {'object': {'id': self.payment.stripe_session_id}},
        }
        response = self.client.post(self.webhook_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.payment.refresh_from_db()
        self.booking.refresh_from_db()
        self.assertEqual(self.payment.status, 'SUCCEEDED')
        self.assertEqual(self.booking.status, 'PAID')

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    def test_webhook_signature_invalide_retourne_400(self):
        payload = {'type': 'checkout.session.completed', 'data': {'object': {'id': 'cs_test_123'}}}
        response = self.client.post(
            self.webhook_url,
            data=json.dumps(payload),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='invalid_signature',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
