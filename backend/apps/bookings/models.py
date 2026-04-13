import uuid
from django.db import models
from django.conf import settings

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('PAYMENT_PENDING', 'Payment Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
        ('DONE', 'Done'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_number = models.CharField(max_length=8, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey('services.Service', on_delete=models.CASCADE)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    event_date = models.DateField()
    start_time = models.TimeField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    children_count = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('event_date', 'start_time')

    def save(self, *args, **kwargs):
        if not self.booking_number:
            # Generate a unique 8-character code
            while True:
                code = str(uuid.uuid4())[:8].upper()
                if not Booking.objects.filter(booking_number=code).exists():
                    self.booking_number = code
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.booking_number} - {self.user.email}"

class BookingOption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='options')
    option = models.ForeignKey('services.Option', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.booking.booking_number} - {self.option.name}"

class BookingAssignment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REFUSED', 'Refused'),
    )
    ASSIGNED_BY_CHOICES = (
        ('ADMIN', 'Admin'),
        ('ANIMATEUR', 'Animateur'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='assignments')
    animateur = models.ForeignKey('accounts.AnimateurProfile', on_delete=models.CASCADE, related_name='assignments')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_by = models.CharField(max_length=20, choices=ASSIGNED_BY_CHOICES, default='ADMIN')
    
    assigned_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.booking.booking_number} assigned to {self.animateur}"
