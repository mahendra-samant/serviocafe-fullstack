from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/admin/", include("users.admin_urls")),
    path("api/menu/", include("menu.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/tables/", include("tables.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/feedback/", include("feedback.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/payment/", include("payments.urls")),
    path("api/", include("chat.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
