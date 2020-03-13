from django.conf.urls import url, include
from django.contrib import admin
from mysite import views
from django.urls import path

urlpatterns = [
  path('admin/', admin.site.urls),
  path('', views.home),
  path("post-post/", views.handlepost),
  path("user-login/", views.handlelogin),
  path('logout/', views.logoutuser),
  path('make-comment/', views.handlecomment),
  path('get-comments/', views.printcomments),
  path("getpostinfo/", views.getpostinfo),
  path('savepostinfo/', views.savepostinfo),
  path('deletepost/', views.deletepost),
  path('profile/', views.profile),
  path('timezone/', views.set_timezone),
  path('save-profile/', views.save_profile),
  path('user-profile/<int:user>/', views.view_user_profile),
  path('getcommentinfo/', views.getcommentinfo),
  path('savecommentinfo/', views.savecommentinfo),
  path('usermanage/', views.usermanage),
  path('credits/', views.credits),
  path('requestuser/', views.requestuser),
  url(r'^oauth/', include('social_django.urls', namespace='social')),
  path('new-user/', views.newuser),
  path('deletecomment/', views.deletecomment),
  path('saveuser/', views.saveuser)
]
