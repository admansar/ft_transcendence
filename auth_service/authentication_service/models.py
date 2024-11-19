from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import serializers
import pyotp

class User(AbstractUser):
    first_name = models.CharField(max_length=30, blank=True, null=True, default="N/A")
    last_name = models.CharField(max_length=30, blank=True, null=True, default="N/A")
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    avatar = models.URLField(null=True)
    
    score = models.SmallIntegerField(null=True)
    num_wins = models.IntegerField(null=True)
    num_losses = models.IntegerField(null=True)

    USERNAME_FIELD = 'email'  # Use email as the username
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']  # No additional fields required for createsuperuser
    s_2fa_enabled = models.BooleanField(default=False)
    us_2fa_secret = models.CharField(max_length=255, blank=True, null=True)

# from .models import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'email', 'username', 'password', 'us_2fa_enabled')
#         extra_kwargs = {'password': {'write_only': True}}

class Enable2FASerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6)