from django.urls import path
from .views import (
    TableListView,
    AvailableTableView,
    TableCreateView,
    TableStatusView,
    TableDeleteView,
)

urlpatterns = [
    path("", TableListView.as_view()),
    path("all", TableListView.as_view()),
    path("available", AvailableTableView.as_view()),
    path("add", TableCreateView.as_view()),
    path("<int:pk>/status", TableStatusView.as_view()),
    path("<int:pk>", TableDeleteView.as_view()),
]
