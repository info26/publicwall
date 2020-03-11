from django.shortcuts import redirect


def checkUser(backend, uid, user, response, *args, **kwargs):
  return redirect('/error/')