from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    website = models.URLField(null=True, blank=True)  # Allow blank and null for optional field

    def __str__(self):
        return self.user.username

class Action(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    flower = models.CharField(max_length=100)  # Assuming 'flower' is a text field
    timestamp = models.DateTimeField(auto_now_add=True)  # To track when the action was performed

    def __str__(self):
        return f"Action by {self.user} with flower {self.flower} on {self.timestamp}"
