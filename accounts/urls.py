from django.urls import path
from . import views

urlpatterns = [
    path('', views.loginpage, name='login'),
    path('register/', views.registrationpage, name='register'),
]

