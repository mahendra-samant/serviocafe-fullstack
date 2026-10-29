from django.urls import path

from .views import CreateRazorpayOrderView, PaymentSuccessView

urlpatterns = [
    path("create-order", CreateRazorpayOrderView.as_view()),
    path("success", PaymentSuccessView.as_view()),
]
