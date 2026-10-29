from django.urls import path
from .views import MenuListView, MenuCreateView, MenuUpdateView, MenuDeleteView

urlpatterns = [
    path("all", MenuListView.as_view()),
    path("add", MenuCreateView.as_view()),
    path("update/<int:pk>", MenuUpdateView.as_view()),
    path("<int:pk>", MenuDeleteView.as_view()),
]
