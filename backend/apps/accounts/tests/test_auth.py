from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class AuthApiTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.me_url = reverse('me')

    def test_inscription_avec_email_valide(self):
        payload = {'email': 'client@example.com', 'password': 'Secret123!'}
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='client@example.com').exists())

    def test_inscription_email_deja_utilise_retourne_400(self):
        User.objects.create_user(email='client@example.com', password='Secret123!')
        payload = {'email': 'client@example.com', 'password': 'Secret123!'}
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_valide_retourne_tokens(self):
        User.objects.create_user(email='client@example.com', password='Secret123!')
        response = self.client.post(
            self.login_url,
            {'email': 'client@example.com', 'password': 'Secret123!'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_mauvais_mot_de_passe_retourne_401(self):
        User.objects.create_user(email='client@example.com', password='Secret123!')
        response = self.client.post(
            self.login_url,
            {'email': 'client@example.com', 'password': 'WrongPassword!'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acces_me_sans_token_retourne_401(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acces_me_avec_token_valide_retourne_200(self):
        User.objects.create_user(email='client@example.com', password='Secret123!')
        login_response = self.client.post(
            self.login_url,
            {'email': 'client@example.com', 'password': 'Secret123!'},
            format='json',
        )
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'client@example.com')
