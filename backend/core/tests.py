from django.test import TestCase
from rest_framework.test import APITestCase
from .models import *
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
        user = User.objects.create_user(**self.user_data)
        self.user_profile = Student.objects.create(user=user) # student type

    def test_register(self):
        response = self.client.post(self.register_url, {
            'username': 'user',
            'password': 'gdhfjsad35',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # duplicate username
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': 'password',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # bad password
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': '1',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) # bad password
        response = self.client.post(self.register_url, {
            'username': 'user2',
            'password': 'gdhfjsad35',
            'email': 'u@u.com',
            'user_type': 'Vendor'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) # register successful
        user = User.objects.get(username='user2')
        self.assertTrue(Vendor.objects.filter(user=user).exists()) # check correct user type (vendor)

        response = self.client.post(self.register_url, {
            'username': 'user3',
            'password': 'adghdge542',
            'email': 's@s.com',
            'user_type': 'Organization'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) # register successful
        user = User.objects.get(username='user3')
        self.assertTrue(Student.objects.filter(user=user).exists()) # check correct user type (student)


    def test_login(self):
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK) # login successful
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        user = User.objects.get(username=self.user_data['username'])
        self.assertTrue(Student.objects.filter(user=user).exists()) # check user type (student)
        self.assertFalse(Vendor.objects.filter(user=user).exists()) 

        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) # wrong password
