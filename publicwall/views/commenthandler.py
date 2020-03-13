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
def printcomments(request):
  if request.method == "POST":
    if request.user.is_authenticated == False:
      return JsonResponse({"ok": False, "error": "Please login first. "})
    data = []
    try:
      for i in Post.objects.get(pk=request.POST['commentid']).comment_set.all():
        timezone = pytz.timezone(request.user.userextra.timezone)
        loc = i.date.astimezone(timezone)
        dateformat = loc.strftime("%b %d %Y %H:%M:%S")
        data.append({"user": User.objects.get(pk=i.user).username, "text": i.comment_content, "date": dateformat, 'id':i.id})
    except:
      pass
    if request.user.has_perm('publicwall.bypass-lock') == False:
      postlocked = Post.objects.get(pk=request.POST['commentid']).locked
    else:
      postlocked = False
    if request.user.has_perm('publicwall.edit-post'):
      editpost = True
    else:
      editpost = False
    return JsonResponse({"ok":True, "data":data, "commentid": request.POST['commentid'], "postlocked": postlocked, 'editpost': editpost})
@login_required
def handlecomment(request):
  if request.method == "GET":
    return HttpResponse("500 Bad Method")
  elif request.method == "POST":
    if request.user.has_perm("publicwall.make-comment"):
      if Post.objects.get(pk=request.POST['postid']).locked == True:
        if request.user.has_perm('publicwall.bypass-lock') == False:
          return JsonResponse({"ok": False, "error": "This post is locked. "})
      if request.POST['commenttext'] == "":
        return JsonResponse({"ok": False, "error":"Comment cannot be blank"})
      Post.objects.get(pk=request.POST['postid']).comment_set.create(comment_content=request.POST['commenttext'], date = tzz.now(), user = request.user.id)
      timezone = pytz.timezone(request.user.userextra.timezone)
      loc = tzz.now().astimezone(timezone)
      return JsonResponse({'ok': True, 'commentid': request.POST['postid'], 'user': request.user.username, 'date': loc.strftime("%b %d %Y %H:%M:%S")})
    else:
      return JsonResponse({"ok": False, "error":"Sorry, No Permisison"})