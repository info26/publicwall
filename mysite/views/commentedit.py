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
#here are functions for modifying comments.
@login_required
def getcommentinfo(request):
  if request.method == 'POST' and request.user.has_perm("mysite.edit-post"):
    referringcomment = Comment.objects.get(pk=request.POST["commentid"])
    return JsonResponse({"ok" : True, "user": referringcomment.user, "date": referringcomment.date, "content":referringcomment.comment_content})
  pass
@login_required
def savecommentinfo(request):
  if request.method == 'POST' and request.user.has_perm('mysite.edit-post'):
    referringcomment = Comment.objects.get(pk=request.POST["commentid"])
    # pick up here. 
    referringcomment.comment_content = request.POST["content"]
    referringcomment.date = request.POST["date"]
    referringcomment.user = request.POST["user"]
    referringcomment.save()
    return JsonResponse({"ok": True})
  else:
    return JsonResponse({"ok": False,"error": "No permissions. "})
  pass

def deletecomment(request):
  if request.method == 'POST' and request.user.has_perm('mysite.edit-post'):
    referringcomment = Comment.objects.get(pk=request.POST['commentid'])
    referringcomment.delete()
    return JsonResponse({"ok": True})
  else:
    return JsonResponse({"ok": False,"error": "No permissions. "})
  pass