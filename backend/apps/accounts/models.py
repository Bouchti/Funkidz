import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Add any extra fields here
    email = models.EmailField(unique=True)
    
    # Use email instead of username if desired, but for now I'll keep AbstractUser defaults
    # unless specified otherwise.
    
    def __str__(self):
        return self.username
