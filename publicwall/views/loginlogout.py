from django.contrib.auth.decorators import login_required
import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
from mysite.models import *
from django.contrib.auth import authenticate as auth_login
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone as tzz
import pytz
from pytz import *
import hashlib

def handlelogin(request):
  if request.method == "GET":
    if request.user.is_authenticated:
      return redirect('/')
    return render(request, 'main/login.html', {'datetime':tzz.now()})
  if request.method == "POST":
    user = auth_login(request, username=request.POST["username"], password=request.POST["password"])
    if user == None:
      return JsonResponse({'ok': False, 'error': "invalid password / username."})
    else:
      login(request, user)
      return JsonResponse({'ok': True})
def logoutuser(request):
  if request.user.is_authenticated:

    logout(request)
    return render(request, 'main/login.html', {'alerts':[["Logged out.", "primary"]]})
  else:
    return render(request, 'main/info.html', {'error': "You are not logged in, therefore you cannot log out. ", "redirect":"/"})