from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def game_2d(request):
    return render(request, 'game.html')


@login_required
def game_3d(request):
    return render(request, "game_3d.html")


@login_required
def select_game(request):
    return render(request, 'select_game.html')
