from django.urls import path
from . import views

urlpatterns = [
    # path('management',views.userManagement,name='management')
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
]

#http://127.0.0.1:8000/user/managenet