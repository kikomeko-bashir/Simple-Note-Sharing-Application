from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Note


class NotesApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.user = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.other = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')
        # Login
        r = self.client.post('/api/auth/login/', {"email": "alice@example.com", "password": "Password123!"}, format='json')
        self.assertEqual(r.status_code, 200)
        self.access = r.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def test_create_list_notes(self):
        # Create note
        r = self.client.post('/api/notes/', {"title": "t1", "content": "c1"}, format='json')
        self.assertEqual(r.status_code, 201)

        # List notes
        r2 = self.client.get('/api/notes/', format='json')
        self.assertEqual(r2.status_code, 200)
        self.assertGreaterEqual(len(r2.data.get('results', r2.data)), 1)

    def test_only_owner_can_edit(self):
        # Create as alice
        r = self.client.post('/api/notes/', {"title": "t2", "content": "c2"}, format='json')
        self.assertEqual(r.status_code, 201)
        note_id = r.data['id']
        # Login as bob
        client2 = APIClient()
        rlogin = client2.post('/api/auth/login/', {"email": "bob@example.com", "password": "Password123!"}, format='json')
        self.assertEqual(rlogin.status_code, 200)
        client2.credentials(HTTP_AUTHORIZATION=f"Bearer {rlogin.data['access']}")
        # Try update -> forbidden
        rforbid = client2.put(f'/api/notes/{note_id}/', {"title": "hacked", "content": "no"}, format='json')
        self.assertIn(rforbid.status_code, (403,))

# Create your tests here.
