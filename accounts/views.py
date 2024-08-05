from django.shortcuts import render

#i create first page
def register(request):
    x = {'name':'ali'}
    return render(request,'register.html',{'name' : 'Lorku'})

def login(request):
    x = {'name':'ali'}
    return render(request,'login.html',{'name' : 'Lorku'})


# Create your views here.
