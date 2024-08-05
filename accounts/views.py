from django.shortcuts import render

#i create first page
def userManagement(request):
    x = {'name':'ali'}
    return render(request,'index_login.html',{'name' : 'Lorku'})


# Create your views here.
