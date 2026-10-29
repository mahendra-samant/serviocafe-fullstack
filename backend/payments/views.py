import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from notifications.email_service import send_order_invoice_email


class CreateRazorpayOrderView(APIView):

    def post(self, request):
        try:
            amount = request.data.get("amount")

            if amount is None:
                return Response(
                    {"error": "amount is required"}, status=status.HTTP_400_BAD_REQUEST
                )

            amount = float(amount)

            if amount <= 0:
                return Response(
                    {"error": "amount must be greater than 0"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Razorpay expects amount in paise
            amount_in_paise = int(round(amount * 100))

            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            razorpay_order = client.order.create(
                {
                    "amount": amount_in_paise,
                    "currency": "INR",
                    "receipt": f"coffee_{request.user.id if request.user.is_authenticated else 'guest'}",
                }
            )

            return Response(
                {
                    "id": razorpay_order["id"],
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"],
                    "key": settings.RAZORPAY_KEY_ID,
                }
            )

        except Exception as e:
            print("Razorpay order creation error:", str(e))

            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentSuccessView(APIView):

    def post(self, request):
        try:
            cart = request.data.get("cart") or []
            total = request.data.get("total", 0)
            name = request.data.get("customerName", "Customer")
            email = request.data.get("customerEmail")

            rows = "".join(
                f"<li>{x.get('menuItemName', 'Item')} "
                f"x{x.get('quantity', 1)} - ₹"
                f"{x.get('menuItemPrice', 0) * x.get('quantity', 1)}</li>"
                for x in cart
            )

            from django.core.mail import EmailMultiAlternatives

            if settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD and email:
                msg = EmailMultiAlternatives(
                    f"☕ Payment Confirmation & Invoice – "
                    f"Order #{request.data.get('userId')}",
                    "",
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                )

                msg.attach_alternative(
                    f"""
                    <h2>Payment Confirmation</h2>
                    <p>Hello {name}</p>
                    <ul>{rows}</ul>
                    <p>Total: ₹{total}</p>
                    """,
                    "text/html",
                )

                msg.send(fail_silently=True)

            return Response("Payment successful & invoice email sent!")

        except Exception as e:
            return Response(
                "Payment processed but failed to send invoice: " + str(e), status=500
            )
