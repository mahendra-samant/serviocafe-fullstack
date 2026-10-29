from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Feedback
from orders.models import Order
from users.models import User


class AddFeedbackView(APIView):
    def post(self, request):
        rating = int(request.data.get("rating", 0))
        if rating < 1 or rating > 5:
            return Response("Rating must be between 1 and 5", status=400)
        f = Feedback.objects.create(
            order_id=request.data.get("orderId"),
            user_id=request.data.get("userId"),
            rating=rating,
            comment=request.data.get("comment", ""),
        )
        Order.objects.filter(pk=f.order_id).update(feedback_given=True)
        return Response(
            {
                "id": f.id,
                "orderId": f.order_id,
                "userId": f.user_id,
                "rating": f.rating,
                "comment": f.comment,
                "createdAt": f.created_at.isoformat(),
            }
        )


class AllFeedbackView(APIView):
    def get(self, request):
        out = []
        for f in Feedback.objects.all().order_by("-created_at"):
            u = User.objects.filter(pk=f.user_id).first()
            out.append(
                {
                    "id": f.id,
                    "customerName": u.name if u else "Unknown",
                    "comment": f.comment,
                    "rating": f.rating,
                    "createdAt": f.created_at.isoformat(),
                }
            )
        return Response(out)


class UserFeedbackView(APIView):
    def get(self, request, userId):
        return Response(
            [
                {
                    "id": f.id,
                    "orderId": f.order_id,
                    "userId": f.user_id,
                    "rating": f.rating,
                    "comment": f.comment,
                    "createdAt": f.created_at.isoformat(),
                }
                for f in Feedback.objects.filter(user_id=userId)
            ]
        )


class OrderFeedbackView(APIView):
    def get(self, request, orderId):
        return Response(
            [
                {
                    "id": f.id,
                    "orderId": f.order_id,
                    "userId": f.user_id,
                    "rating": f.rating,
                    "comment": f.comment,
                    "createdAt": f.created_at.isoformat(),
                }
                for f in Feedback.objects.filter(order_id=orderId)
            ]
        )
