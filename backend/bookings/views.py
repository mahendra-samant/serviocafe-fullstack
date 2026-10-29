from django.db import transaction
from django.utils.dateparse import parse_datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TableBooking
from .serializers import BookingSerializer
from users.models import User
from tables.models import Table
from notifications.email_service import send_booking_email


class BookView(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            user = User.objects.filter(pk=request.data.get("userId")).first()
            if not user:
                raise ValueError(
                    "User not found for id: %s" % request.data.get("userId")
                )
            table = Table.objects.filter(
                table_number=request.data.get("tableNumber")
            ).first()
            if not table:
                raise ValueError(
                    "Table not found for tableNumber: %s"
                    % request.data.get("tableNumber")
                )
            if not table.available:
                raise ValueError(
                    f"Table {table.table_number} is currently not available"
                )
            people = int(request.data.get("numberOfPeople", 0))
            dt = parse_datetime(str(request.data.get("bookingTime", "")))
            if not dt:
                raise ValueError("bookingTime required (ISO_LOCAL_DATE_TIME)")
            if table.seats < people:
                raise ValueError(
                    f"Table doesn't have enough seats (requested: {people}, seats: {table.seats})"
                )
            if TableBooking.objects.filter(
                table=table, booking_time=dt, status=TableBooking.Status.CONFIRMED
            ).exists():
                raise ValueError("Table is already booked at this time")
            booking = TableBooking.objects.create(
                table=table, user=user, booking_time=dt, number_of_people=people
            )
            table.available = False
            table.save(update_fields=["available"])
            send_booking_email(booking)
            return Response(BookingSerializer(booking).data)
        except Exception as e:
            return Response(str(e), status=400)


class CancelBookingView(APIView):
    @transaction.atomic
    def delete(self, request, pk):
        b = TableBooking.objects.filter(pk=pk).first()
        if not b:
            return Response("Booking not found", status=400)
        b.status = TableBooking.Status.CANCELLED
        b.save(update_fields=["status"])
        b.table.available = True
        b.table.save(update_fields=["available"])
        return Response("Booking cancelled successfully")


class AllBookingsView(APIView):
    def get(self, request):
        return Response(
            BookingSerializer(
                TableBooking.objects.select_related("table", "user").order_by(
                    "-booking_time"
                ),
                many=True,
            ).data
        )


class UserBookingsView(APIView):
    def get(self, request, userId):
        return Response(
            BookingSerializer(
                TableBooking.objects.filter(user_id=userId)
                .select_related("table")
                .order_by("-booking_time"),
                many=True,
            ).data
        )


class TableBookingsView(APIView):
    def get(self, request, tableNumber):
        return Response(
            BookingSerializer(
                TableBooking.objects.filter(
                    table__table_number=tableNumber
                ).select_related("table"),
                many=True,
            ).data
        )


class AvailableTablesView(APIView):
    def get(self, request):
        return Response(
            [
                {
                    "id": t.id,
                    "tableNumber": t.table_number,
                    "table_number": t.table_number,
                    "seats": t.seats,
                    "available": t.available,
                }
                for t in Table.objects.filter(available=True).order_by("table_number")
            ]
        )
