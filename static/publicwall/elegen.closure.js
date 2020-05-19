/* Compiled using closure library https://developers.google.com/closure/compiler */ 
/* Using head: 11c80b3c78abcb4071a28776fe9ffefdde9dee5d */



function genPostElement(a){br=document.createElement("br");br2=document.createElement("br");hr=document.createElement("hr");postele=document.createElement("div");a.pinned&&(pinnedBadge=document.createElement("span"),pinnedBadge.setAttribute("class","badge badge-primary"),pinnedBadgeIcon=document.createElement("i"),pinnedBadgeIcon.setAttribute("class","fas fa-thumbtack"),pinnedBadge.appendChild(pinnedBadgeIcon),pinnedBadgeText=document.createTextNode(" PINNED"),pinnedBadge.appendChild(pinnedBadgeText));
posttext=document.createElement("span");posttexttext=document.createTextNode(a.content);posttext.appendChild(posttexttext);posttext.setAttribute("id","posttext"+a.id);posttext.setAttribute("style","word-wrap: break-word; overflow: hidden;");postdate=document.createElement("span");localized=commons.localizeTime(a.date,window.tz);postdatetext=document.createTextNode(localized.format(settings.DATE_FORMAT));postdate.appendChild(postdatetext);postdate.setAttribute("id","postdate"+a.id);postdate.setAttribute("class",
"float-right");postauthor=document.createElement("span");postauthor.setAttribute("onclick","showProfile("+a.authorid+")");postauthortext=document.createTextNode(a.user);postauthor.setAttribute("class","grey float-right");postauthor.appendChild(postauthortext);postauthor.setAttribute("id","postauthor"+a.id);postcommentlink=document.createElement("a");postcommenttext=document.createTextNode("Comments["+a.comments+"]");postcommentlink.appendChild(postcommenttext);postcommentlink.setAttribute("id","postcomment"+
a.id);postcommentlink.setAttribute("class","link showcomments");postcommentlink.setAttribute("data-id",a.id);postunderdiv=document.createElement("div");postunderdiv.setAttribute("id","postUnder"+a.id);postunderdiv.setAttribute("class","postUnder");postunderdiv.style.height="0%";postunderdiv.style.display="none";postcommentdiv=document.createElement("div");postcommentdiv.setAttribute("data-id",a.id);postcommentdiv.setAttribute("loaded",!1);postcommentdiv.setAttribute("id","commentbox"+a.id);postcommentdiv.setAttribute("class",
"commentbox");postcontrolsdiv=document.createElement("div");postcontrolsdiv.setAttribute("id","controlsbox"+a.id);postunderdiv.appendChild(postcommentdiv);postunderdiv.appendChild(postcontrolsdiv);a.pinned?(postele.appendChild(pinnedBadge),postele.appendChild(br2),postele.setAttribute("pinned",!0)):postele.setAttribute("pinned",!1);postele.appendChild(posttext);postele.appendChild(postdate);postele.appendChild(br);postele.appendChild(postauthor);postele.appendChild(postcommentlink);postele.appendChild(postunderdiv);
postele.appendChild(hr);return postele}
function genComment(a){commentBox=document.createElement("div");br=document.createElement("br");hr=document.createElement("hr");commenttext=document.createElement("span");commenttextnode=document.createTextNode(a.content);commenttext.setAttribute("id","commenttext"+a.id);commenttext.appendChild(commenttextnode);commentdate=document.createElement("span");localized=commons.localizeTime(a.date,window.tz);commentdatetext=document.createTextNode(localized.format(settings.DATE_FORMAT));commentdate.setAttribute("id",
"commentdate"+a.id);commentdate.setAttribute("class","grey float-right");commentdate.appendChild(commentdatetext);commentauthor=document.createElement("span");commentauthornode=document.createTextNode(a.user);commentauthor.setAttribute("id","commentauthor"+a.id);commentauthor.setAttribute("class","grey float-right");console.log(a);commentauthor.setAttribute("onclick","showProfile("+a.authorid+")");commentauthor.appendChild(commentauthornode);commentBox.appendChild(commenttext);commentBox.appendChild(commentdate);
commentBox.appendChild(br);commentBox.appendChild(commentauthor);commentBox.appendChild(hr);return commentBox}
function genCheckbox(a){box=document.createElement("div");box.setAttribute("class","custom-control custom-checkbox");boxInput=document.createElement("input");boxInput.setAttribute("type","checkbox");boxInput.setAttribute("class","custom-control-input");boxInput.setAttribute("id",a.id);boxPostLabel=document.createElement("label");boxPostLabel.setAttribute("class","custom-control-label");boxPostLabel.setAttribute("for",a.id);boxPostLabelText=document.createTextNode(a.text);boxPostLabel.appendChild(boxPostLabelText);
box.appendChild(boxInput);box.appendChild(boxPostLabel);return box};
