from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse_lazy
from django.views import generic
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
# from .models import GameScore


class SignUpView(generic.CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"
    

class GameView(TemplateView):
    template_name = "game.html"
    

@csrf_exempt
@login_required
def save_score(request):
    if request.method == "POST":
        score = int(request.POST.get("score", 0))
        GameScore.objects.create(user=request.user, score=score)
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "fail"})
