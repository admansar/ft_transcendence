from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    avatar = models.URLField(null=True)
    
    score = models.SmallIntegerField(null=True)
    num_wins = models.IntegerField(null=True)
    num_losses = models.IntegerField(null=True)

    USERNAME_FIELD = 'email'  # Use email as the username
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']  # No additional fields required for createsuperuser
