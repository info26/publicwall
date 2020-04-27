from django.contrib.auth.decorators import login_required
import datetime
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from django.template import loader
# TODO: Make models
# from .models import *
from django.contrib.auth import authenticate as auth_login
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone as tzz

def index(request):
    # First, we check if the user is logged in or not. 
    # If not, we won't display the index page. 
    # We will redirect user to login page instead. 
    if not request.user.is_authenticated:
        # Redirect this user:
        return redirect('/acc/login')
    # We will continue serving this page. 
    # TODO: Make home page which shows the current posts. 
    return render(request, '/publicwall/index.html')