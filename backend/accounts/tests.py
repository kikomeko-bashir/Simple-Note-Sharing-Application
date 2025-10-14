from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.verify_url = reverse('auth-verify')
        self.logout_url = reverse('auth-logout')
        self.User = get_user_model()

    def test_register_and_login_with_email(self):
        # Register
        payload = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "Password123!",
        }
        r = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(r.status_code, 201)

        # Login with email
        r2 = self.client.post(self.login_url, {"email": payload["email"], "password": payload["password"]}, format='json')
        self.assertEqual(r2.status_code, 200)
        self.assertIn('access', r2.data)
        self.assertIn('refresh', r2.data)

        # Verify
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {r2.data['access']}")
        r3 = self.client.get(self.verify_url)
        self.assertEqual(r3.status_code, 200)

    def test_login_wrong_credentials(self):
        r = self.client.post(self.login_url, {"email": "nouser@example.com", "password": "bad"}, format='json')
        self.assertEqual(r.status_code, 401)

# Create your tests here.
