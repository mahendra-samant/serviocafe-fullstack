from django.urls import path
from .views import OrderView, UserOrderView, OrderStatusView

urlpatterns = [
    path("", OrderView.as_view()),
    path("user/<int:userId>", UserOrderView.as_view()),
    path("<int:orderId>/status", OrderStatusView.as_view()),
]
