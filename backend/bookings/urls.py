from django.urls import path
from .views import (
    BookView,
    CancelBookingView,
    AllBookingsView,
    UserBookingsView,
    TableBookingsView,
    AvailableTablesView,
)

urlpatterns = [
    path("book", BookView.as_view()),
    path("all", AllBookingsView.as_view()),
    path("user/<int:userId>", UserBookingsView.as_view()),
    path("table/<int:tableNumber>", TableBookingsView.as_view()),
    path("tables/available", AvailableTablesView.as_view()),
    path("<int:pk>", CancelBookingView.as_view()),
]
