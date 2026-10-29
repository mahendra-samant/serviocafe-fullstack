from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Table
from .serializers import TableSerializer


class TableListView(APIView):
    def get(self, request):
        return Response(
            TableSerializer(
                Table.objects.all().order_by("table_number"), many=True
            ).data
        )


class AvailableTableView(APIView):
    def get(self, request):
        return Response(
            TableSerializer(
                Table.objects.filter(available=True).order_by("table_number"), many=True
            ).data
        )


class TableCreateView(APIView):
    def post(self, request):
        data = request.data.copy()
        data["table_number"] = data.get("tableNumber", data.get("table_number"))
        s = TableSerializer(data=data)
        if s.is_valid():
            return Response(TableSerializer(s.save()).data)
        return Response(s.errors, status=400)


class TableStatusView(APIView):
    def put(self, request, pk):
        obj = Table.objects.filter(pk=pk).first()
        if not obj:
            return Response("Table not found", status=404)
        val = request.query_params.get("available")
        obj.available = str(val).lower() == "true"
        obj.save(update_fields=["available"])
        return Response(TableSerializer(obj).data)


class TableDeleteView(APIView):
    def delete(self, request, pk):
        obj = Table.objects.filter(pk=pk).first()
        if not obj:
            return Response("Table not found", status=404)
        obj.delete()
        return Response(status=200)
