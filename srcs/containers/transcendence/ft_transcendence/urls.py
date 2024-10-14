from django.contrib import admin
from django.urls import path, include 
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),  # new
    path("api/game/", include("game.urls")),
    path('tournament/', include("tournament.urls")),
    # path('', views.index, name='index'),

]

handler404 = views.not_found_view
