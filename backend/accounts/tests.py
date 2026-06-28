from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User


class AuthTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('get_token')
        User.objects.create_user(
            username='user', password='fhsjhd353', email='a@a.com', role='organization'
        )

    def test_register(self):
        # Duplicate username
        res = self.client.post(self.register_url, {
            'username': 'user', 'password': 'gdhfjsad35', 'email': 'u@u.com', 'role': 'vendor'
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # Bad password (too common)
        res = self.client.post(self.register_url, {
            'username': 'user2', 'password': 'password', 'email': 'u@u.com', 'role': 'vendor'
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # Too short password
        res = self.client.post(self.register_url, {
            'username': 'user2', 'password': '1', 'email': 'u@u.com', 'role': 'vendor'
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        # Successful vendor registration
        res = self.client.post(self.register_url, {
            'username': 'user2', 'password': 'gdhfjsad35', 'email': 'u@u.com', 'role': 'vendor'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get(username='user2').role, 'vendor')

        # Successful organization registration
        res = self.client.post(self.register_url, {
            'username': 'user3', 'password': 'adghdge542', 'email': 's@s.com', 'role': 'organization'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get(username='user3').role, 'organization')

    def test_login(self):
        res = self.client.post(self.login_url, {'username': 'user', 'password': 'fhsjhd353'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

        res = self.client.post(self.login_url, {'username': 'user', 'password': 'wrongpassword'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
