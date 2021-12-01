from django.shortcuts import render

def index(request,*args,**kwargs):
    return render(request, 'frontend/mainpage.html')

def index2(request,*args,**kwargs):
    print("Running index page..")
    return render(request,'frontend/index.html')