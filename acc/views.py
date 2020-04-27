from django.shortcuts import render, redirect
from django.contrib.auth import login as intlogin
from django.contrib.auth import logout as intlogout


def login(request):
    # NOTE: Basic boilerplate code: Customize if needed. 
    if request.method == "GET":
        if request.user.is_authenticated:
            # Ok, why is this user trying to login then?
            return redirect('/')
        return render(request, 'acc/login.html')

