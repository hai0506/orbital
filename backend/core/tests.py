from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

# Create your tests here.
class AuthTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('get_token')
        self.user_data = {
            'username': 'user',
            'password': 'fhsjhd353',
            'email': 'a@a.com'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register(self):
        response = self.client.post(self.register_url, {
            'username': 'user',
            'password': 'gdhfjsad35',
            'email': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': 'password',
            'email': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': '1',
            'email': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': 'gdhfjsad35',
            'email': ''
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_login(self):
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
