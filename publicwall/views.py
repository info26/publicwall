import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
# TODO: Make models
from .models import *
from django.contrib.auth import authenticate as auth_login
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone
from . import admin
import pytz
from django.core.paginator import Paginator
def fixBool(bool):
    if bool == "true":
        return True
    elif bool == "false":
        return False
    else:
        return False
def index(request):
    # this should be at the tippy top. 
    # First, we check if the user is logged in or not.
    # If not, we won't display the index page.
    # We will redirect user to login page instead.

    # 




    if not request.user.is_authenticated:
        # Redirect this user:
        return redirect('/acc/login')


    # Check to make sure user has set a valid timezone
    if not request.user.userextra.timezone in pytz.common_timezones:
        return redirect('/user/request-timezone/')

    
    if request.method == "POST":
            
        # ---------------------------------
        # read functions 
        # ---------------------------------




        # this function returns posts, and the user's timezone. , and some user permissions. 
        if request.POST['action'] == "getinfo":
            # Client asking for posts.
            posts = []
            # Get pinned posts that and order them by date.
            for post in Post.objects.filter(pinned=True).order_by('-date'):
                author = User.objects.filter(pk=post.user)[0]
                posts.append({
                    "date": post.date,
                    "content": post.content,
                    "author": author.username,
                    "pinned": post.pinned,
                    "locked": post.locked,
                    'comments': len(post.comment_set.all()),
                    "id": post.id,
                    "authorid": author.id 
                })
            # gonna try out a paginator!
            p = Paginator(Post.objects.filter(pinned=False).order_by('-date'), 10)
            # set up!
            # We are only going to send the first page, and let the client
            # request more. 

            for post in p.page(1):
                author = User.objects.filter(pk=post.user)[0]
                posts.append({
                    "date": post.date,
                    "content": post.content,
                    "author": author.username,
                    "pinned": post.pinned,
                    "locked": post.locked,
                    'comments': len(post.comment_set.all()),
                    "id": post.id,
                    "authorid": author.id 
                })
            return JsonResponse({
                "posts": posts,
                "tz": request.user.userextra.timezone,
                "username": request.user.username,
                "permissionList": {
                    "add-post": request.user.has_perm("publicwall.add-post"),
                    "admin": request.user.has_perm("publicwall.admin"),
                    "bypass-lock": request.user.has_perm("publicwall.bypass-lock"),
                    "add-comment": request.user.has_perm("publicwall.add-comment"),
                },
                "userid": request.user.id,
                "pages": p.num_pages,
            })



        

        # This function returns comments based on the postId
        # the client has supplied. 
        if request.POST['action'] == "getcomments":
            refpost = Post.objects.get(pk=request.POST['postid'])
            
            comments = []
            postComments = refpost.comment_set.all()
            origSet = postComments
            more = -1
            if len(origSet) > 3:
                # trim the set
                postComments = postComments[:3]
                more = len(origSet) - 3

            for comment in postComments:
                author = User.objects.filter(pk=comment.user)[0]
                comments.append({
                    "content": comment.content,
                    "date": comment.date,
                    "author": author.username,
                    "id": comment.id,
                    "authorid": author.id
                })
            return JsonResponse({
                "comments": comments,
                "locked": Post.objects.get(pk=request.POST['postid']).locked,
                "more": more,
            })

        # ---------------------------------
        # WRITE FUNCTIONS 
        # ---------------------------------
        if request.POST["action"] == 'addpost':
            if request.POST["content"].strip() == "":
                return JsonResponse({
                    "ok": False,
                    "error": "Post cannot be blank"
                })
            elif not request.user.has_perm("publicwall.add-post"):
                return JsonResponse({
                    "ok": False,
                    "error": "no permission"
                })
            if request.POST["locked"] and not request.user.has_perm("publicwall.admin"):
                locked = False
            else:
                locked = fixBool(request.POST["locked"])
            if request.POST["pinned"] and not request.user.has_perm("publicwall.admin"):
                pinned = False
            else:
                pinned = fixBool(request.POST["pinned"])
            newPost = Post.objects.create(
                content = request.POST["content"],
                user = request.user.id,
                date = timezone.now(),
                pinned = pinned,
                locked = locked
            )
            return JsonResponse({
                "id": newPost.id,
                "date": newPost.date
            })

        # client asking to add a comment. 
        if request.POST["action"] == "addcomment":
            # client is asking for a new comment to be added .
            # first check if comment is blank. 
            if request.POST["text"].strip() == "":
                return JsonResponse({
                    "ok": False,
                    "error": "Comment cannot be blank"
                })
            elif (Post.objects.get(pk = request.POST["postId"]).locked and 
                not request.user.has_perm("publicwall.bypass-lock")):
                # nope, it's locked! 
                return JsonResponse({
                    "ok": False,
                    "error": "This post is locked! "
                })
            elif not request.user.has_perm("publicwall.add-comment"):
                # this user doesn't have permission
                return JsonResponse({
                    "ok": False,
                    "error": "You have no permission! "
                })
            
            # finally, let's add the comment.
            addedComment = Post.objects.get(pk = request.POST["postId"]).comment_set.create(
                content = request.POST["text"],
                date = timezone.now(),
                user = request.user.id
            )
            return JsonResponse({
                "ok": True,
                "date": addedComment.date,
                "id": addedComment.id,
            })
        if request.POST["action"] == "getmoreposts":
            # create paginator #
            p = Paginator(Post.objects.filter(pinned=False).order_by('-date'), 10)
            posts = []
            for post in p.page(request.POST["page"]):
                posts.append({
                    "date": post.date,
                    "content": post.content,
                    "author": User.objects.filter(pk=post.user)[0].username,
                    "pinned": post.pinned,
                    "locked": post.locked,
                    'comments': len(post.comment_set.all()),
                    "id": post.id,
                })
            return JsonResponse({
                "posts": posts,
                "more": p.page(request.POST["page"]).has_next(),
            })


            # finally, let's add the post. 
            
        # Hey, if we're still running and the request is POST, the client
        # must have specified an action that is malformed. 

        return JsonResponse({"error": "Malformed request, your action attribute was: " + request.POST["action"]})


    return render(request,
    'publicwall/index.html',
    {
        'posts': Post.objects.all()
    })
