from django.contrib import admin

from .models import Post
from .models import Comment, UserExtra, UserCode


class CommentInline(admin.TabularInline):
  model = Comment
  extra = 0
class PostAdmin(admin.ModelAdmin):
  
  list_display = ('post_content', 'date')
  inlines = [CommentInline,]
  fieldsets = [
    ("Post Info", {'fields':["post_content", "date"]}),
    ("Post Settings", {"fields":["user", "pinned", "locked"]})
  ]

class UserExtraAdmin(admin.ModelAdmin):
  pass

class UserCodeAdmin(admin.ModelAdmin):
  pass

admin.site.register(Post, PostAdmin)
admin.site.register(UserExtra, UserExtraAdmin)
admin.site.register(UserCode, UserCodeAdmin)