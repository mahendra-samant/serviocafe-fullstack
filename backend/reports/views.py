from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Report
from users.models import User


class AddReportView(APIView):
    def post(self, request):
        user = User.objects.filter(pk=request.data.get("userId")).first()
        if not user:
            return Response("User not found", status=400)
        r = Report.objects.create(
            user=user,
            type=request.data.get("type", ""),
            message=request.data.get("message", ""),
        )
        return Response(
            {
                "id": r.id,
                "user": r.user_id,
                "type": r.type,
                "message": r.message,
                "createdAt": r.created_at.isoformat(),
            }
        )


class AllReportsView(APIView):
    def get(self, request):
        return Response(
            [
                {
                    "id": r.id,
                    "user": r.user_id,
                    "type": r.type,
                    "message": r.message,
                    "createdAt": r.created_at.isoformat(),
                }
                for r in Report.objects.select_related("user").order_by("-created_at")
            ]
        )
