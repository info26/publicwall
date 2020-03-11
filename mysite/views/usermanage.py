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

#i plan to work on this usermanagement a lot. 

@login_required
def usermanage(request):
  if request.user.has_perm('mysite.edit-user'):
    return render(request, 'usermanage.html')
@login_required
def requestuser(request):
  if request.method == "POST" and request.user.has_perm("mysite.edit-user"):
    if User.objects.filter(pk=request.POST['id']).exists() == False:
      return JsonResponse({"ok": False, "errorcode": "DoesNotExist"})
    referringuser = User.objects.get(pk=request.POST['id'])
    return JsonResponse({"ok": True, "username": referringuser.username, "description": referringuser.userextra.description, "timezone": referringuser.userextra.timezone, 'timezones': pytz.common_timezones})