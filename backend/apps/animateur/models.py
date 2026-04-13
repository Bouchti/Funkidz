import uuid
from django.db import models

class Availability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    animateur = models.ForeignKey('accounts.AnimateurProfile', on_delete=models.CASCADE, related_name='availabilities')
    
    blocked_date = models.DateField()
    blocked_start = models.TimeField()
    blocked_end = models.TimeField()
    
    reason = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Availability blocked for {self.animateur} on {self.blocked_date}"
