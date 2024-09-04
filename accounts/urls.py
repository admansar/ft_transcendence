from django.urls import path
from .views import SignUpView
from .views import GameView



urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("game/", GameView.as_view(), name="game"), 
    # path("save-score/", save_score, name="save_score"),
]