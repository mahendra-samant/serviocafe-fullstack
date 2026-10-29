from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    menuItemId = serializers.IntegerField(source="menu_item_id")
    menuItemName = serializers.CharField(source="menu_item_name")
    menuItemPrice = serializers.FloatField(source="menu_item_price")
    lineTotal = serializers.FloatField(source="line_total")

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "menuItemId",
            "menuItemName",
            "menuItemPrice",
            "quantity",
            "lineTotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source="user_id")
    tableNumber = serializers.IntegerField(source="table_number", allow_null=True)
    totalAmount = serializers.FloatField(source="total_amount")
    paymentId = serializers.CharField(
        source="payment_id", allow_null=True, required=False
    )
    createdAt = serializers.DateTimeField(source="created_at")
    feedbackGiven = serializers.BooleanField(source="feedback_given")
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "userId",
            "tableNumber",
            "status",
            "totalAmount",
            "paymentId",
            "createdAt",
            "feedbackGiven",
            "items",
        ]
