
from django.conf.urls import url, include
from django.contrib import admin
from . import views
from django.urls import path


# TODO: Populate url list. 
urlpatterns = [
    path('', views.index),
    path('request-timezone/', views.request_timezone),
    path('profile/<int:userid>/', views.profile)
]

