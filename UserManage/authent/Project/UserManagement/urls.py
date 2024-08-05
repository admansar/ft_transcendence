from django.urls import path
from . import views

urlpatterns = [
    # path('management',views.userManagement,name='management')
    path('', views.userManagement, name='userManagement'),
]

#http://127.0.0.1:8000/user/managenet