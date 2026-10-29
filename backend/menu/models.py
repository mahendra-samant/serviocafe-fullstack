from django.db import models


class MenuItem(models.Model):
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name
