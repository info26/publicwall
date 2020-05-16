# URLS Config
# NOTE: This is the base urls.py !!

from django.contrib import admin
from django.urls import path, include
# Import this app's own views. 
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    # Bind urls for authentication:
    path('acc/', include('acc.urls')),
    path('user/', include('user.urls')),
]
