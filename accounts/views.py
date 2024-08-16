from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from .forms import LoginForm

def loginpage(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    # Redirect to a home or dashboard page
                    return redirect('home')  # Make sure you have a URL named 'home'
                else:
                    # User account is inactive
                    form.add_error(None, "Your account is inactive.")
            else:
                # Authentication failed
                form.add_error(None, "Invalid username or password.")
    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})

def registrationpage(request):
    return render(request, 'register.html')
