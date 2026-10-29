from django.urls import path
from .admin_views import AddUserView, StaffView

urlpatterns = [
    path("add-user", AddUserView.as_view()),
    path("staff", StaffView.as_view()),
]
