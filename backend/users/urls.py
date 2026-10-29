from django.urls import path
from .views import RegisterView, LoginView, UserListView, UserDetailView, RoleUsersView

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("login", LoginView.as_view()),
    path("", UserListView.as_view()),
    path("role/<str:role>", RoleUsersView.as_view()),
    path("<int:pk>", UserDetailView.as_view()),
    path("<int:pk>/password", UserDetailView.as_view()),
]
