#file has been moved
#datetime indeed is needed
from django.contrib.auth.decorators import login_required
import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
from .models import *
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
    posts = Post.objects.filter(pinned=False).order_by('-date') # gets posts that are not pinned and order by the date. ex. 05-12-2002, 04-12-2002, 09-24-1999
    pinnedposts = Post.objects.filter(pinned=True).order_by('-date') # gets pinned posts and order by the date.  same as above ^

    data = [] # data - not pinned posts.
    pinned = [] # pinned - pinned posts
    userloggedin = request.user.username # the username of the user logged in.
    canaccessadmin = request.user.is_staff # if the user can access the admin panel '/admin'
    editperms = request.user.has_perm("publicwall.edit-post") # if the user has edit perms
    alerts = [] # alerts
    scrolltostat = False # if we should scroll to a post
    scrolltonum = -1 # the number we should scroll to ^
    stcs = False # if we should scroll to a comment
    stcn = -1 # the number(id) comment we should scroll to.
    postnum = -1 # the postnumbebr
    if 'loggedin' in request.GET and request.GET['loggedin'] == "1": # if user just logged in V
      alerts.append(["successfully logged in", "primary"]) # show an alert that they just logged in ^
    if 'scrollto' in request.GET: # execute the following if we are scrolling to a post. 
      scrolltostat = True # then set the var to true, to indicate that we are scrolling to a post
      scrolltonum = request.GET["scrollto"] # and set the id. 
    if 'scrolltocomm' in request.GET: # if we should scroll to a comment (as specified in the url bar. )
      stcn = Comment.objects.get(pk=int(request.GET['scrolltocomm'])).id # number(comment id)
      stcs = True
      postnum = Comment.objects.get(pk=int(request.GET['scrolltocomm'])).post.id
    for i in pinnedposts:
      timezone = pytz.timezone(request.user.userextra.timezone)
      loc = i.date.astimezone(timezone)
      dateformatted = loc.strftime("%b %d %Y %H:%M:%S")
      pinned.append([i.post_content, dateformatted, User.objects.get(pk=i.user).username, i.id, i.user])
    for i in posts:
      timezone = pytz.timezone(request.user.userextra.timezone)
      loc = i.date.astimezone(timezone)
      dateformatted = loc.strftime("%b %d %Y %H:%M:%S")
      data.append([i.post_content, dateformatted, User.objects.get(pk=i.user).username, i.id, i.user])
    return render(request, 'main/index.html', {'data': data, 'pinned': pinned, 'userloggedin':userloggedin, 'canaccessadmin': canaccessadmin, 'alerts': alerts, 'editperms':editperms, 'scrolltostat':scrolltostat, 'scrolltonum':scrolltonum, 'stcs': stcs, 'stcn': stcn, 'postnum': postnum})
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
@login_required
def error418(request):
  return HttpResponse("418 I'm a teapot", status=418)


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
  return render(request, "main/profile.html", {'set': set, 'timezone' : timezone})
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
#here are functions for modifying comments.
@login_required
def getcommentinfo(request):
  if request.method == 'POST' and request.user.has_perm("publicwall.edit-post"):
    referringcomment = Comment.objects.get(pk=request.POST["commentid"])
    return JsonResponse({"ok" : True, "user": referringcomment.user, "date": referringcomment.date, "content":referringcomment.comment_content})
  pass
@login_required
def savecommentinfo(request):
  if request.method == 'POST' and request.user.has_perm('publicwall.edit-post'):
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



#user management functions
@login_required
def usermanage(request):
  if request.user.has_perm('publicwall.edit-user'):
    return render(request, 'usermanage.html')
@login_required
def requestuser(request):
  if request.method == "POST" and request.user.has_perm("publicwall.edit-user"):
    if User.objects.filter(pk=request.POST['id']).exists() == False:
      return JsonResponse({"ok": False, "errorcode": "DoesNotExist"})
    referringuser = User.objects.get(pk=request.POST['id'])
    return JsonResponse({"ok": True, "username": referringuser.username, "description": referringuser.userextra.description, "timezone": referringuser.userextra.timezone})

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
        User.objects.create(username=request.POST['username'], password=request.POST['password'], email=request.POST['email'])
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

    if e.expires > tzz.now():
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