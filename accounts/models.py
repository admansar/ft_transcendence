from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    name = models.CharField(max_length=255, default='Anonymous')
    username = models.CharField(max_length=255, default='Anonymous', unique=True)
    email = models.EmailField(unique=True, default='no-reply@example.com', null=False)
    # username = None
    password = models.CharField(max_length=255, default='password')
    # USERNAME_FIELD = 'email'  # Use email as the username
    # REQUIRED_FIELDS = []  # No additional fields required for createsuperuser
