from django.conf import settings
from django.db import models


class Feedback(models.Model):
    order_id = models.BigIntegerField()
    user_id = models.BigIntegerField()
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
