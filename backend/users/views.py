from django.db import IntegrityError
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from notifications.email_service import (
    send_registration_email,
    send_staff_welcome_email,
)


class RegisterView(APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")
        if not name or not name.strip():
            return Response("Name is required", status=400)
        if not email or not email.strip():
            return Response("Email is required", status=400)
        if not password or not password.strip():
            return Response("Password is required", status=400)
        if not role:
            return Response("Role is required", status=400)
        role = role.upper()
        if role == "ADMIN":
            return Response("Admin cannot register.", status=400)
        if role not in User.Role.values:
            return Response("Invalid role", status=400)
        if User.objects.filter(email__iexact=email).exists():
            return Response("Email already exists", status=400)
        user = User.objects.create_user(
            email=email, password=password, name=name, role=role
        )
        send_registration_email(user)
        return Response("Registration successful!", status=200)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = User.objects.filter(email__iexact=email).first()
        if user and check_password(password or "", user.password):
            return Response(UserSerializer(user).data)
        return Response("Invalid email or password", status=401)


class UserListView(APIView):
    def get(self, request):
        return Response(
            UserSerializer(User.objects.all().order_by("id"), many=True).data
        )


class UserDetailView(APIView):
    def get(self, request, pk):
        user = User.objects.filter(pk=pk).first()
        return Response(UserSerializer(user).data) if user else Response(status=404)

    def put(self, request, pk):
        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response(status=404)
        for field in ("name", "email"):
            if request.data.get(field) is not None:
                setattr(user, field, request.data.get(field))
        if request.data.get("password"):
            user.set_password(request.data.get("password"))
        try:
            user.save()
        except IntegrityError:
            return Response("Email already exists", status=400)
        return Response(UserSerializer(user).data)


class RoleUsersView(APIView):
    def get(self, request, role):
        role = role.upper()
        if role not in User.Role.values:
            return Response(f"Invalid role: {role}", status=400)
        return Response(UserSerializer(User.objects.filter(role=role), many=True).data)


class PasswordView(UserDetailView):
    pass
