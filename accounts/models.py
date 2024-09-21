from django.db import models
from django.contrib.auth.models import User
from datetime import date

class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name  = models.CharField(max_length=30)
    date = models.DateField(default=date.today)

