import json, os, uuid
from pathlib import Path
from django.conf import settings
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MenuItem
from .serializers import MenuSerializer


def save_upload(upload):
    if not upload:
        return None
    root = Path(settings.MEDIA_ROOT) / "menu"
    root.mkdir(parents=True, exist_ok=True)
    safe = os.path.basename(upload.name)
    name = f"{uuid.uuid4()}_{safe}"
    path = root / name
    with path.open("wb+") as dest:
        for chunk in upload.chunks():
            dest.write(chunk)
    return f"{settings.MEDIA_URL}menu/{name}"


def delete_upload(url):
    if not url:
        return
    prefix = f"{settings.MEDIA_URL}menu/"
    if prefix in url:
        p = Path(settings.MEDIA_ROOT) / "menu" / url.split(prefix, 1)[1]
        try:
            p.unlink()
        except FileNotFoundError:
            pass


def parse_menu_payload(request):
    if "menuItem" in request.data:
        raw = request.data.get("menuItem")
        if isinstance(raw, dict):
            return raw
        try:
            return json.loads(raw)
        except Exception:
            return {}
    return {
        k: request.data.get(k)
        for k in ("name", "category", "price", "description")
        if k in request.data
    }


class MenuListView(APIView):
    def get(self, request):
        return Response(
            MenuSerializer(
                MenuItem.objects.all().order_by("id"),
                many=True,
                context={"request": request},
            ).data
        )


class MenuCreateView(APIView):
    def post(self, request):
        data = parse_menu_payload(request)
        s = MenuSerializer(data=data)
        if not s.is_valid():
            return Response(s.errors, status=400)
        obj = s.save()
        upload = request.FILES.get("imageFile") or request.FILES.get("image")
        if upload:
            obj.image_url = save_upload(upload)
            obj.save(update_fields=["image_url"])
        return Response(
            MenuSerializer(obj, context={"request": request}).data, status=200
        )


class MenuUpdateView(APIView):
    def put(self, request, pk):
        obj = MenuItem.objects.filter(pk=pk).first()
        if not obj:
            return Response("Menu item not found", status=404)
        data = parse_menu_payload(request)
        s = MenuSerializer(obj, data=data, partial=True)
        if not s.is_valid():
            return Response(s.errors, status=400)
        obj = s.save()
        upload = request.FILES.get("imageFile") or request.FILES.get("image")
        if upload:
            delete_upload(obj.image_url)
            obj.image_url = save_upload(upload)
            obj.save(update_fields=["image_url"])
        return Response(MenuSerializer(obj, context={"request": request}).data)


class MenuDeleteView(APIView):
    def delete(self, request, pk):
        obj = MenuItem.objects.filter(pk=pk).first()
        if not obj:
            return Response("Menu item not found", status=404)
        delete_upload(obj.image_url)
        obj.delete()
        return Response(status=200)
