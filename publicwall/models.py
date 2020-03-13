from django.db import models

# Create your models here.


from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

class UserExtra(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField(default="", null=True)
    timezone = models.TextField(default=None, null=True)
    class Meta:
      permissions = [("edit-user", "Edit a user's properties")]
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserExtra.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userextra.save()



class Post(models.Model):
  post_content = models.TextField(default=None)
  date = models.DateTimeField(default=None)
  user = models.IntegerField(default=None)
  pinned = models.BooleanField(default=False)
  locked = models.BooleanField(default=False)
  def __str__(self):
    return self.post_content
  class Meta:
    permissions = [("post-post", "Ability to add a post. "), ("bypass-time-restriction", "can bypass time restriction"), ("edit-post", "Can use editing post modal. ")]

class Comment(models.Model):
  post = models.ForeignKey(Post, on_delete=models.CASCADE)
  comment_content = models.TextField()
  date = models.DateTimeField()
  user = models.IntegerField(null=True)
  def __str__(self):
    return self.comment_content
  class Meta:
    permissions = [("make-comment", "Ability to make a comment."),("bypass-lock", "Ability to bypass a lock on a post. ")]

class UserCode(models.Model):
  code = models.TextField(default=None)
  expires = models.DateTimeField(null=True)
  uses = models.IntegerField(default=0)
  maxuses = models.IntegerField(null=True)
  
  def __str__(self):
    return self.code
  class Meta:
    permissions = [("make-code", "ability to make a user registration code. ")]