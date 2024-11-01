from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Note
from .serializers import NoteSerializer


class DailyNotesView(APIView):
    """
    Logged-in users can create, read, update, and delete daily notes.

    Usage:
        GET /notes/ :Retrieve all notes for the authenticated user.
        POST /notes/ :Create a new note.
        PUT /notes/<int:pk>/ :Update an existing note (by primary key).
        DELETE /notes/<int:pk>/ :Delete an existing note.
    """

    permission_classes = [
        IsAuthenticated
    ]  # Ensure only authenticated users access these endpoints

    def get(self, request, pk=None):
        if pk:
            # Retrieve a single note
            try:
                note = Note.objects.get(pk=pk, user=request.user)
                serializer = NoteSerializer(note)
                return Response(serializer.data)
            except Note.DoesNotExist:
                return Response(
                    {"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            # Retrieve all notes for the authenticated user
            notes = Note.objects.filter(user=request.user)
            serializer = NoteSerializer(notes, many=True)
            return Response(serializer.data)

    def post(self, request):
        # Create a new note for the authenticated user
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Set the user to the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Update an existing note
        try:
            note = Note.objects.get(
                pk=pk, user=request.user
            )  # Ensure the note belongs to the user
        except Note.DoesNotExist:
            return Response(
                {"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Delete an existing note
        try:
            note = Note.objects.get(pk=pk, user=request.user)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return Response(
                {"error": "Note not found."}, status=status.HTTP_404_NOT_FOUND
            )
