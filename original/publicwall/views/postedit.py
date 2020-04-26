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

#helper function for converting true / false string into a boolean
def fixBoolean(string):
  if string == "false": # if string is false. 
    return False # return False
  else:
    return True # else return True
#the following functions are for modifying posts. 
@login_required
def getpostinfo(request):
  #be sure to check if the user has permission to edit posts as this SHOULD (not can) be used when the user is editing someone and to prevent unauthorized people from using this. 
  # okay, we have some problems with timezones so we are going to pause this for now. FIXED
  if request.user.has_perm("publicwall.edit-post"):
    referringpost = Post.objects.get(pk = request.POST['postid'])
    return JsonResponse({"ok": True, "text": referringpost.post_content, "date":referringpost.date, "user": referringpost.user, "pinned":referringpost.pinned, "locked": referringpost.locked})
  else:
    return JsonResponse({"ok": False, "error": "You aren't allowed to do this!"})
  pass
def savepostinfo(request):
  # YOU ABSOLUTELY NEED TO CHECK IF THE USER HAS PERMIISONS.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if request.user.has_perm("publicwall.edit-post"):
    referringpost = Post.objects.get(pk = request.POST['postid'])
    referringpost.post_content = request.POST["text"]
    referringpost.date = request.POST["date"]
    referringpost.user = request.POST["user"]
    referringpost.locked = fixBoolean(request.POST["locked"])
    referringpost.pinned = fixBoolean(request.POST["pinned"])
    referringpost.save()
    return JsonResponse({"ok": True})
  else:
    return JsonResponse({"ok": False, "error":"permissions error"})
  pass
#pass
@login_required
def deletepost(request):
  #check for permissions
  if request.user.has_perm("publicwall.edit-post"):
    referringpost = Post.objects.get(pk = request.POST['postid'])
    referringpost.delete();
    return JsonResponse({"ok": True})
  else:
    return JsonResponse({"ok": False, "error": "permissions error."})
  pass