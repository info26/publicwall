from django.contrib.auth.decorators import login_required
import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
from publicwall.models import *
from django.contrib.auth import authenticate as auth_login
from django.contrib.auth import login, logout
from django.contrib.auth.models import User, Permission
from django.db.models import Q
from django.utils import timezone as tzz
import pytz
from pytz import *
import hashlib
from django.conf import settings

#no login required. 
def newuser(request):
  if request.method == "GET":
    return render(request, "newuser.html")
  if request.method == "POST":
    if request.POST['action'] == "validatecode":
      return JsonResponse({"ok": True, "found": checkValidCode(request.POST['code'],False)})
    elif request.POST['action'] == "newuser":
      if checkValidCode(request.POST['code'], True):
        b = User.objects.filter(username = request.POST['username']).exists()
        if b:
          return JsonResponse({"ok": False, "error": "Sorry, the username is taken. "})
        user = User.objects.create(username=request.POST['username'],email=request.POST['email'])
        user.set_password(request.POST['password'])
        userperms = []
        reqperms = settings.DEFAULTPERMISSIONS
        for i in reqperms:
          temp = Permission.objects.filter(codename=i)[0]
          userperms.append(temp)
        user.user_permissions.set(userperms)
        user.save()
        return JsonResponse({"ok": True})
      else:
        return JsonResponse({"ok": False, "error": "Invalid code!"})
      
    pass


#helper functions for looking for valid code. 
def checkValidCode(code, willbeused):
  #reminder, if the maxuses hits, delete it, but return true. 
  #however, if it is past the expired date, delete it, but RETURN FALSE


  e = UserCode.objects.filter(code=code).exists()
  if e == False:
    return False
  e = UserCode.objects.get(code=code)
  #check if it is expired
  if e.expires != None:

    if e.expires < tzz.now():
      e.delete()
      return False
  if willbeused:
    if e.uses != None:

      if e.uses+1 == e.maxuses:
        #  then this is the last time we will use this.
        e.delete()
        # authorize it. 
        return True
      else:
        e.uses += 1
        e.save()
        return True
  return True

  

  pass