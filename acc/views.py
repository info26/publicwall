from django.shortcuts import render, redirect
from django.contrib.auth import login as intlogin
from django.contrib.auth import logout as intlogout
from django.contrib.auth import authenticate
from django.http import JsonResponse

def login(request):
    # NOTE: Basic boilerplate code: Customize if needed. 
    if request.method == "GET":
        if request.user.is_authenticated:
            # Ok, why is this user trying to login then?
            return redirect('/')
        return render(request, 'acc/login.html')
    elif request.method == "POST":
        user = authenticate(request, 
        username = request.POST['username'],
        password = request.POST['password'])
        if user == None:
            # This password is incorrect. 
            return JsonResponse({"correct": False})
        intlogin(request, user)
        return JsonResponse({"correct": True})
        
    
def logout(request):
    success = True
    if not request.user.is_authenticated:
        success = False
    intlogout(request)
    
    return render(request, 'acc/logout.html', {
        "success": success
    })

