# Static smoke checks that do not require Django to be installed in the build environment.
from pathlib import Path

root = Path(__file__).parent
required = [
    "manage.py",
    "requirements.txt",
    "config/settings.py",
    "config/urls.py",
    "users/models.py",
    "menu/models.py",
    "orders/models.py",
    "tables/models.py",
    "bookings/models.py",
    "feedback/models.py",
    "reports/models.py",
    "payments/views.py",
    "chat/views.py",
    "notifications/email_service.py",
]
missing = [p for p in required if not (root / p).exists()]
assert not missing, missing
print("Backend source smoke check passed:", len(required), "required files present.")
