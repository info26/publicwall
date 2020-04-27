
from django.conf.urls import url, include
from django.contrib import admin
from . import views
from django.urls import path


# TODO: Populate url list. 
urlpatterns = [
    path('login', views.login)
]

