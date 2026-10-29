from rest_framework import serializers
from .models import Table


class TableSerializer(serializers.ModelSerializer):
    tableNumber = serializers.IntegerField(source="table_number")

    class Meta:
        model = Table
        fields = ["id", "tableNumber", "seats", "available"]
