from django.urls import path
from .views import AddFeedbackView, AllFeedbackView, UserFeedbackView, OrderFeedbackView

urlpatterns = [
    path("add", AddFeedbackView.as_view()),
    path("all", AllFeedbackView.as_view()),
    path("user/<int:userId>", UserFeedbackView.as_view()),
    path("order/<int:orderId>", OrderFeedbackView.as_view()),
]
