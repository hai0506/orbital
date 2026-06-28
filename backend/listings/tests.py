from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from accounts.models import User


class JobPostTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='orguser', password='orguser123', email='org@org.com', role='organization'
        )
        response = self.client.post(reverse('get_token'), {
            'username': 'orguser', 'password': 'orguser123'
        })
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + response.data['access'])
        self.url = reverse('create-post')
        self.valid_data = {
            'title': 'Project 1',
            'location': 'Room 1',
            'start_date': (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d'),
            'end_date': (timezone.now() + timedelta(days=3)).date().strftime('%Y-%m-%d'),
            'start_time': '10:00',
            'end_time': '18:00',
            'commission': 20,
            'remarks': 'pls pls pls',
            'category_list': ['Food & Beverages', 'Art & Crafts']
        }

    def post_data(self, overrides={}):
        data = self.valid_data.copy()
        data.update(overrides)
        return self.client.post(self.url, data)

    def test_title_location_blank(self):
        res = self.post_data({'title': ''})
        self.assertEqual(res.status_code, 400)
        self.assertIn('title', res.data)

        res = self.post_data({'location': '         '})
        self.assertEqual(res.status_code, 400)
        self.assertIn('location', res.data)

    def test_datetime_empty(self):
        res = self.post_data({'start_date': '', 'end_date': ''})
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_date', res.data)
        self.assertIn('end_date', res.data)

        res = self.post_data({'start_time': '', 'end_time': ''})
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_time', res.data)
        self.assertIn('end_time', res.data)

    def test_startdate_after_enddate(self):
        res = self.post_data({
            'start_date': (timezone.now() + timedelta(days=5)).date().strftime('%Y-%m-%d'),
            'end_date': (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d'),
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('end_date', res.data)
        self.assertEqual(res.data['end_date'][0], 'End date cannot be before start date.')

    def test_starttime_after_endtime(self):
        date = (timezone.now() + timedelta(days=2)).date().strftime('%Y-%m-%d')
        res = self.post_data({
            'start_date': date, 'end_date': date,
            'start_time': '18:00:00', 'end_time': '10:00:00',
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('end_time', res.data)
        self.assertEqual(res.data['end_time'][0], 'Start time cannot be after end time.')

    def test_startdate_past(self):
        res = self.post_data({
            'start_date': (timezone.now() - timedelta(days=1)).date().strftime('%Y-%m-%d')
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_date', res.data)
        self.assertEqual(res.data['start_date'][0], 'Start date cannot be in the past.')

    def test_starttime_past(self):
        now = timezone.localtime()
        today = now.date().strftime('%Y-%m-%d')
        time_in_past = (now - timedelta(hours=1)).time().strftime('%H:%M:%S')
        time_future = (now + timedelta(hours=1)).time().strftime('%H:%M:%S')
        res = self.post_data({
            'start_date': today, 'start_time': time_in_past, 'end_time': time_future,
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn('start_time', res.data)
        self.assertEqual(res.data['start_time'][0], 'Start time cannot be in the past.')

    def test_commission(self):
        res = self.post_data({'commission': -10})
        self.assertEqual(res.status_code, 400)
        self.assertIn('commission', res.data)

        res = self.post_data({'commission': 150})
        self.assertEqual(res.status_code, 400)
        self.assertIn('commission', res.data)

        res = self.post_data({'commission': 'abc'})
        self.assertEqual(res.status_code, 400)
        self.assertIn('commission', res.data)

    def test_field_too_long(self):
        res = self.post_data({'remarks': 'a' * 3000})
        self.assertEqual(res.status_code, 400)
        self.assertIn('remarks', res.data)

    def test_successful_post_creation(self):
        res = self.post_data()
        self.assertEqual(res.status_code, 201)
        self.assertIn('post_id', res.data)
        self.assertEqual(res.data['title'], self.valid_data['title'])
