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


# Create your views here.
def handler500(request):
  return render(request, "500.html", {"alerts":[["500", "warning"]]})
  return None


@login_required
def home(request):
  
  #return HttpResponse("The wall has been disabled due to spamming.")
  if request.user.is_authenticated: # check if user is logged in.
    if request.user.userextra.timezone == None: # check if user does not have a timezone set. 
      return redirect("/profile/?timezone=1") # redirect to the timezone setting page. 
    posts = Post.objects.filter(pinned=False).order_by('-date') # gets posts and order by the date. ex. 05-12-2002, 04-12-2002, 09-24-1999
    pinned = Post.objects.filter(pinned=True).order_by('-date') # gets pinned posts. 

    data = [] # data - not pinned posts.    userloggedin = request.user.username # the username of the user logged in.
    canaccessadmin = request.user.is_staff # if the user can access the admin panel '/admin'
    editperms = request.user.has_perm("publicwall.edit-post") # if the user has edit perms
    alerts = [] # alerts
    scrolltostat = False # if we should scroll to a post
    scrolltonum = -1 # the number we should scroll to ^
    stcs = False # if we should scroll to a comment
    stcn = -1 # the number(id) comment we should scroll to.
    postnum = -1 # the postnumbebr
    userloggedin = request.user.username
    canedituser = request.user.has_perm('publicwall.edit-user')
    if 'loggedin' in request.GET and request.GET['loggedin'] == "1": # if user just logged in V
      alerts.append(["Successfully logged in", "primary"]) # show an alert that they just logged in ^
    if 'scrollto' in request.GET: # execute the following if we are scrolling to a post. 
      scrolltostat = True # then set the var to true, to indicate that we are scrolling to a post
      scrolltonum = request.GET["scrollto"] # and set the id. 
    if 'scrolltocomm' in request.GET: # if we should scroll to a comment (as specified in the url bar. )
      stcn = Comment.objects.get(pk=int(request.GET['scrolltocomm'])).id # number(comment id)
      stcs = True
      postnum = Comment.objects.get(pk=int(request.GET['scrolltocomm'])).post.id
    for i in pinned:
      timezone = pytz.timezone(request.user.userextra.timezone)
      loc = i.date.astimezone(timezone)
      dateformatted = loc.strftime("%b %d %Y %H:%M:%S")
      data.append([i.post_content, dateformatted, User.objects.get(pk=i.user).username, i.id, i.user, len(i.comment_set.all()), i.pinned])
    for i in posts:
      timezone = pytz.timezone(request.user.userextra.timezone)
      loc = i.date.astimezone(timezone)
      dateformatted = loc.strftime("%b %d %Y %H:%M:%S")
      data.append([i.post_content, dateformatted, User.objects.get(pk=i.user).username, i.id, i.user, len(i.comment_set.all()), i.pinned])
    return render(request, 'main/index.html', {'data': data, 'userloggedin':userloggedin, 'canaccessadmin': canaccessadmin, 'alerts': alerts, 'editperms':editperms, 'scrolltostat':scrolltostat, 'scrolltonum':scrolltonum, 'stcs': stcs, 'stcn': stcn, 'postnum': postnum, 'canedituser':canedituser})
  else:
    return redirect("/user-login/")
@login_required
def handlepost(request):
  if request.method == "POST":
    #implementation of spamming detection system. 
    if len(Post.objects.filter(user = request.user.id)) > 0:
      latestpost = Post.objects.filter(user = request.user.id).latest('date')
      delta =  tzz.now()-latestpost.date
      if delta < datetime.timedelta(minutes = 2) and (request.user.has_perm('publicwall.bypass-time-restriction') == False):
        return JsonResponse({"ok": False, "error":"You are posting too soon!"})
    if request.POST['post_text'] == "":
      return JsonResponse({"ok": False, "error":"Post cannot be blank."})
    elif not request.user.has_perm('publicwall.post-post'):
      return JsonResponse({"ok": False, "error":"No Permission"})
    else:
      q = Post(post_content=request.POST['post_text'], date = tzz.now(), user=request.user.id, pinned=False, locked=False)
      q.save()
      return JsonResponse({'ok': True})
  else:
    return HttpResponse("500 Bad Method",status=500)
