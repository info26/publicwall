from django.shortcuts import render
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
from django.core.paginator import Paginator
# Create your views here.
import pytz


def index(request):
    if request.method == "GET":
        # return profile config page: 
        return render(request, 'user/profile.html', {
            "username": request.user.username,
            "description": request.user.userextra.description,
            "timezones": pytz.common_timezones,
            "currenttz": request.user.userextra.timezone,
        })
    elif request.method == "POST":
        loggedInUser = request.user
        if (len(User.objects.filter(username=request.POST["username"])) == 1 and 
        User.objects.filter(username=request.POST["username"])[0].username != request.user.username):

            # uh oh, taken username
            return JsonResponse({
                "ok": False,
                "error": "TAKEN_USERNAME",
            })
        loggedInUser.username = request.POST["username"]
        loggedInUser.userextra.description = request.POST["description"]
        # If they send an invalid timezone, well too bad! 
        loggedInUser.userextra.timezone = request.POST["timezone"]
        loggedInUser.userextra.save()
        loggedInUser.save()

        return JsonResponse({
            "ok": True
        })

def request_timezone(request):
    if request.user.userextra.timezone in pytz.common_timezones:
        # This user's timezone has already been set! 
        return redirect('/')
    if request.method == "POST":
        # Set user's timeezone to posted data
        request.user.userextra.timezone = request.POST["timezone"]
        request.user.userextra.save()

        return redirect('/')
    return render(request, 'user/request-timezone.html', {
        "timezones": pytz.common_timezones,
        "date": timezone.now(),
    })

def profile(request, userid):
    refUser = User.objects.get(pk=userid)
    return JsonResponse({
        "username": refUser.username,
        "description": refUser.userextra.description,
        "timezone": refUser.userextra.timezone,
    })