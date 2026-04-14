from datetime import date, timedelta

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from bookings.models import Booking
from services.models import Option, Service, ServiceOption


class BookingApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='client@example.com', password='Secret123!')
        self.other_user = User.objects.create_user(email='other@example.com', password='Secret123!')
        self.service = Service.objects.create(
            title='Test Service',
            description='desc',
            base_price='100.00',
            duration_minutes=120,
            category='Test',
            is_active=True,
        )
        self.fixed = Option.objects.create(
            name='Fixed',
            price='20.00',
            pricing_type='FIXED',
            is_active=True,
        )
        self.per_child = Option.objects.create(
            name='Per Child',
            price='5.00',
            pricing_type='PER_CHILD',
            is_active=True,
        )
        self.per_hour = Option.objects.create(
            name='Per Hour',
            price='30.00',
            pricing_type='PER_HOUR',
            is_active=True,
        )
        for opt in (self.fixed, self.per_child, self.per_hour):
            ServiceOption.objects.create(service=self.service, option=opt)

        self.create_url = reverse('booking-create')
        self.client.force_authenticate(user=self.user)
        self.event_date = (date.today() + timedelta(days=5)).isoformat()

    def _payload(self):
        return {
            'service': str(self.service.id),
            'event_date': self.event_date,
            'start_time': '14:00:00',
            'address': '123 Rue Test',
            'city': 'Paris',
            'children_count': 5,
            'duration_minutes': 120,
            'notes': 'test',
            'selected_options': [
                {'id': str(self.fixed.id)},
                {'id': str(self.per_child.id)},
                {'id': str(self.per_hour.id)},
            ],
        }

    def test_creation_reservation_sur_creneau_libre_retourne_201(self):
        response = self.client.post(self.create_url, self._payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_creation_reservation_sur_creneau_pris_retourne_409(self):
        self.client.post(self.create_url, self._payload(), format='json')
        response = self.client.post(self.create_url, self._payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_calcul_prix_estime_fixed_per_child_per_hour(self):
        response = self.client.post(self.create_url, self._payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = Booking.objects.get(id=response.data['id'])
        self.assertEqual(float(booking.estimated_price), 205.0)

    def test_annulation_par_le_client_met_status_cancelled(self):
        create_response = self.client.post(self.create_url, self._payload(), format='json')
        cancel_url = reverse('booking-cancel', kwargs={'pk': create_response.data['id']})
        response = self.client.patch(cancel_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking = Booking.objects.get(id=create_response.data['id'])
        self.assertEqual(booking.status, 'CANCELLED')

    def test_annulation_par_autre_user_retourne_403(self):
        create_response = self.client.post(self.create_url, self._payload(), format='json')
        cancel_url = reverse('booking-cancel', kwargs={'pk': create_response.data['id']})
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(cancel_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
