from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),  # new
    path("accounts/", include("django.contrib.auth.urls")),
    # path("", TemplateView.as_view(template_name="home.html"), name="home"),
    path("game/", include("game.urls")),
    path('home/', views.login_page, name='login_page'),
    path('', views.home_page, name='home_page'),
]

handler404 = views.not_found_view
