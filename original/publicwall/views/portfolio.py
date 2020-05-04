from django.contrib.auth.decorators import login_required
import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
from publicwall.models import *
from django.contrib.auth import authenticate as auth_login
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone as tzz
import pytz
from pytz import *
import hashlib
@login_required
def profile(request):
  if request.user.is_authenticated == False:
    return redirect('/user-login/')
  if 'timezone' in request.GET and request.GET['timezone'] == "1":
    timezone = True
  else:
    timezone = False
  if 'set' in request.GET and request.GET['set'] == "1":
    set = True
  else:
    set = False
  return render(request, "main/profile.html", {'set': set, 'timezone' : timezone, 'username':request.user.username, 'description': request.user.userextra.description})
  pass

@login_required
def set_timezone(request):
  if request.method == 'POST':
    if request.POST['timezone'] not in pytz.common_timezones:
      return redirect('/timezone?error=1')
    request.user.userextra.timezone = request.POST['timezone']
    request.user.userextra.save()
    return redirect('/profile?set=1')
  else:
    error = False
    if 'error' in request.GET and request.GET['error'] == '1':
      error = True
    return render(request, 'timezone_set.html', {'timezones': pytz.common_timezones, 'currenttz': request.user.userextra.timezone, 'error': error})

@login_required
def save_profile(request):
  if request.method == 'POST':
    b = User.objects.filter(username = request.POST['username']).exists()
    if b and User.objects.filter(username = request.POST['username'])[0].id != request.user.id:
      return JsonResponse({"ok": False, "error":"This username is taken!"})
    request.user.username = request.POST['username']
    request.user.save()
    request.user.userextra.description = request.POST['description']
    request.user.userextra.save()
    return JsonResponse({"ok": True})
@login_required
def view_user_profile(request, user):
  referringuser = User.objects.get(pk=user)
  username = referringuser.username
  description = referringuser.userextra.description
  idd = referringuser.id
  return JsonResponse({"ok": True,"username": username, "description": description, "id":idd})
  pass
