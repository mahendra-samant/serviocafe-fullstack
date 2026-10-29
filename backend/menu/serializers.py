from rest_framework import serializers
from .models import MenuItem


class MenuSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ["id", "name", "category", "price", "description", "imageUrl"]
        read_only_fields = ["id", "imageUrl"]

    def get_imageUrl(self, obj):
        if not obj.image_url:
            return None
        if obj.image_url.startswith("http"):
            return obj.image_url
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image_url) if request else obj.image_url
