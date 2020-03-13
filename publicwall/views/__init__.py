from .postingfunctions import *
from .loginlogout import *
from .postedit import *
from .commenthandler import *
from .portfolio import *
from .commentedit import *
from .usermanage import *
from .newuser import *

# BIG FAT REMIDNER, FOR ME TO THINK ABOUT FLAIRS, AND HOW TO APPLY THEM. 
# SOME BIG ISSUES THAT NEED SOLVING:
# How to apply flairs in comment section? the comment section is rendered by javascript
# How are we going to apply flairs and manage flairs? we might be able to use
# discord's 53 bit integer system for that though, that's kind of a smart
# thing to do, BUT that means we need to assign numbers for each flair. 


#misc functions go here
#credits
@login_required
def credits(request):
  return render(request, "credits.html")