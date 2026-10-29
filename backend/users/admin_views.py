from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from notifications.email_service import send_staff_welcome_email


class AddUserView(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")
        role = str(request.data.get("role", "")).upper()
        if not name or not name.strip():
            return Response("Name is required", status=400)
        if not email or not email.strip():
            return Response("Email is required", status=400)
        if not password or not password.strip():
            return Response("Password is required", status=400)
        if role not in ("CHEF", "WAITER", "ADMIN"):
            return Response("Role must be CHEF, WAITER, or ADMIN", status=400)
        if User.objects.filter(email__iexact=email).exists():
            return Response("Email already exists", status=400)
        user = User.objects.create_user(
            email=email, password=password, name=name, role=role
        )
        if role in ("CHEF", "WAITER"):
            send_staff_welcome_email(user, password)
        return Response(UserSerializer(user).data)


class StaffView(APIView):
    def get(self, request):
        return Response(
            UserSerializer(
                User.objects.filter(role__in=["CHEF", "WAITER"]).order_by("id"),
                many=True,
            ).data
        )
