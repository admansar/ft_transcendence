from django.shortcuts import render

def game_2d(request):
    return render(request, 'game.html')

def game_3d(request):
    return render(request, "game_3d.html")
