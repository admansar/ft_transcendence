from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),  # new
    # path("", TemplateView.as_view(template_name="home.html"), name="home"),
    path("game/", include("game.urls")),
    path('', views.home_page, name='home_page'),
]

handler404 = views.not_found_view
