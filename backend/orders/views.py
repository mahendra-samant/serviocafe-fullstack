from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from .services import place_order, update_status


class OrderView(APIView):
    def get(self, request):
        qs = (
            Order.objects.prefetch_related("items")
            .select_related("user")
            .order_by("-created_at")
        )
        return Response(OrderSerializer(qs, many=True).data)

    def post(self, request):
        try:
            order = place_order(
                request.data.get("userId"),
                request.data.get("tableNumber"),
                request.data.get("items", []),
                request.data.get("paymentId"),
            )
            return Response(OrderSerializer(order).data)
        except Exception as e:
            return Response(str(e), status=400)


class UserOrderView(APIView):
    def get(self, request, userId):
        qs = (
            Order.objects.filter(user_id=userId)
            .prefetch_related("items")
            .order_by("-created_at")
        )
        return Response(OrderSerializer(qs, many=True).data)


class OrderStatusView(APIView):
    def put(self, request, orderId):
        try:
            return Response(
                OrderSerializer(update_status(orderId, request.data.get("status"))).data
            )
        except Exception as e:
            return Response(str(e), status=400)
