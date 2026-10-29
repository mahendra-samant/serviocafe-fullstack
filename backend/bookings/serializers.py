from rest_framework import serializers
from .models import TableBooking


class BookingSerializer(serializers.ModelSerializer):
    tableNumber = serializers.IntegerField(source="table.table_number", read_only=True)
    userId = serializers.IntegerField(source="user_id", read_only=True)
    bookingTime = serializers.DateTimeField(source="booking_time")
    numberOfPeople = serializers.IntegerField(source="number_of_people")
    createdAt = serializers.DateTimeField(source="created_at")

    class Meta:
        model = TableBooking
        fields = [
            "id",
            "userId",
            "tableNumber",
            "bookingTime",
            "numberOfPeople",
            "status",
            "createdAt",
        ]
