from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

# Create your tests here.
class AuthTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@gmail.com')

    def test_register(self):
        url = reverse('register')
        data = {
            'username': 'someuser',
            'password': 'somepassword',
            'email': 'some@gmail.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('Registration successful', response.data['message'])
        data = {
            'username': 'someuser',
            'password': 'somepassword',
            'email': 'some@gmail.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('A user with that username already exists.', response.data['message'])
        data = {
            'username': 'testuser',
            'password': 'afadgbsfb',
            'email': 'test2222@gmail.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('A user with that username already exists.', response.data['message'])
        data = {
            'username': 'new',
            'password': 'a',
            'email': 'test2222@gmail.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('Password must be minimum 8 characters', response.data['message'])

    def test_login(self):
        url = reverse('login')  # Adjust to match your URLconf
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('Login successful', response.data['message'])
        data = {
            'username': 'testuser',
            'password': 'TESTPASSWORD'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('Invalid credentials', response.data['message'])
        data = {
            'username': 'TESTUSER',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn('Invalid credentials', response.data['message'])

    def test_home_authenticated(self):
        self.client.login(username='testuser', password='testpassword')
        url = reverse('home')  # Adjust based on your URLconf
        response = self.client.get(url)
        self.assertEqual(response.data['username'], 'testuser')

    def test_home_unauthenticated(self):
        url = reverse('home')
        response = self.client.get(url)
        self.assertIn('no one logged in rn', response.data['message'])

    def test_logout(self):
        self.client.login(username='testuser', password='testpassword')
        url = reverse('logout')
        response = self.client.post(url)
        self.assertIn('Logged out', response.data['message'])

        home_url = reverse('home')
        home_response = self.client.get(home_url)
        self.assertIn('no one logged in', home_response.data['message'])