from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from .models import Note


class DailyNotesTests(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            username="test_user", password="test_password"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.test_user)
        self.notes_url = reverse("notes")

    def test_create_note(self):
        note_data = {"title": "Test Note", "description": "This is a test note."}
        response = self.client.post(self.notes_url, note_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], note_data["title"])
        self.assertEqual(response.data["description"], note_data["description"])

    def test_list_notes(self):
        note = Note.objects.create(
            user=self.test_user, title="Sample Note", description="Sample Description"
        )
        response = self.client.get(self.notes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], note.title)

    def test_retrieve_note(self):
        note = Note.objects.create(
            user=self.test_user,
            title="Retrieve Test",
            description="Retrieve description",
        )
        note_url = reverse("notes-detail", args=[note.id])
        response = self.client.get(note_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], note.title)

    def test_update_note(self):
        note = Note.objects.create(
            user=self.test_user, title="Update Test", description="Update description"
        )
        note_url = reverse("notes-detail", args=[note.id])
        updated_note_data = {
            "title": "Updated Title",
            "description": "Updated description",
        }
        response = self.client.put(note_url, updated_note_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], updated_note_data["title"])
        self.assertEqual(response.data["description"], updated_note_data["description"])

    def test_delete_note(self):
        note = Note.objects.create(
            user=self.test_user, title="Delete Test", description="Delete description"
        )
        note_url = reverse("notes-detail", args=[note.id])
        response = self.client.delete(note_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(id=note.id).exists())
