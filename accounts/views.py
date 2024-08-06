from django.shortcuts import render
from django.http import HttpResponse


def loginpage(request):
    return render(request,'login.html')

def registrationpage(request):
    return render(request,'register.html')