
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required


def login_page(request):
    if request.user.is_authenticated:
        return redirect('main_page')
    return render(request, 'home.html')


@login_required
def home_page(request):
    return render(request, 'frontend/index.html')

def not_found_view(request, exception):
    # Redirect to the home page in case of page not found
    return redirect('login_page') 