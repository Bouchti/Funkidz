import uuid
from django.db import models

class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.PositiveIntegerField()
    category = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Option(models.Model):
    PRICING_TYPES = (
        ('FIXED', 'Fixed'),
        ('PER_CHILD', 'Per Child'),
        ('PER_HOUR', 'Per Hour'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pricing_type = models.CharField(max_length=20, choices=PRICING_TYPES, default='FIXED')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ServiceOption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='options')
    option = models.ForeignKey(Option, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('service', 'option')

    def __str__(self):
        return f"{self.service.title} - {self.option.name}"
