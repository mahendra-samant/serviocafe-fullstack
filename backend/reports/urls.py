from django.urls import path
from .views import AddReportView, AllReportsView

urlpatterns = [
    path("add", AddReportView.as_view()),
    path("all", AllReportsView.as_view()),
]
