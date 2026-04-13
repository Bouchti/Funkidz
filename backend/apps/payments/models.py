import uuid
from django.db import models

class Payment(models.Model):
    STATUS_CHOICES = (
        ('INITIATED', 'Initiated'),
        ('SUCCEEDED', 'Succeeded'),
        ('FAILED', 'Failed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE, related_name='payment')
    
    provider = models.CharField(max_length=50, default='STRIPE')
    stripe_session_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='EUR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='INITIATED')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.booking.booking_number} - {self.status}"
