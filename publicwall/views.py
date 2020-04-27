import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
# TODO: Make models
from .models import *
from django.contrib.auth import authenticate as auth_login
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone as tzz
from . import admin

def index(request):
    if request.method == "POST" and request.POST['action'] == "getposts":
        # Client asking for posts. 
        posts = []
        for post in Post.objects.filter(pinned=True):
            posts.append({
                "date": post.date,
                "content": post.post_content,
                "user": User.objects.filter(pk=post.user)[0].username,
                "pinned": post.pinned,
                "locked": post.locked,
                'comments': len(post.comment_set.all()),
                "id": post.id,
                })
            
        for post in Post.objects.filter(pinned=False):
            posts.append({
                "date": post.date,
                "content": post.post_content,
                "user": User.objects.filter(pk=post.user)[0].username,
                "pinned": post.pinned,
                "locked": post.locked,
                'comments': len(post.comment_set.all()),
                "id": post.id,
                })
            
        return JsonResponse({"posts": posts})
    # First, we check if the user is logged in or not. 
    # If not, we won't display the index page. 
    # We will redirect user to login page instead. 
    if not request.user.is_authenticated:
        # Redirect this user:
        return redirect('/acc/login')
    # We will continue serving this page. 
    # TODO: Make home page which shows the current posts. 
    return render(request, 'publicwall/index.html', {'posts': Post.objects.all()})