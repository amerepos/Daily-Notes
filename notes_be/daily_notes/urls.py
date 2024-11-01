from django.urls import path

from daily_notes.views import DailyNotesView

urlpatterns = [
    path("", DailyNotesView.as_view(), name="notes"),
    path("<int:pk>/", DailyNotesView.as_view(), name="notes-detail"),
]
