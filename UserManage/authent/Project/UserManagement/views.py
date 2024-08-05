from django.shortcuts import render

#i create first page
def userManagement(request):
    x = {'name':'ali'}
    return render(request,'pages/index.html',{'name' : 'Lorku'})


# Create your views here.
