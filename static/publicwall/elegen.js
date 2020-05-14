/* Basically an element factory. */
/* Can be reused for admin site  */
/* as well!                      */




function genPostElement(specs) {
    br = document.createElement("br")
    // floating a br right causes problems
    // in firefox. 

    br2 = document.createElement("br")

    hr = document.createElement("hr")

    // Main post element
    // -----------------
    postele = document.createElement("div")
    // -----------------

    // pinned badge: 
    if (specs["pinned"]) {
        // This post is pinned
        pinnedBadge = document.createElement("span");
        pinnedBadge.setAttribute("class", "badge badge-primary");
        pinnedBadgeIcon = document.createElement("i");
        pinnedBadgeIcon.setAttribute("class", "fas fa-thumbtack");
        pinnedBadge.appendChild(pinnedBadgeIcon);
        pinnedBadgeText = document.createTextNode(" PINNED");
        pinnedBadge.appendChild(pinnedBadgeText);
    }


    // The content of the post:
    // ------------------------
    posttext = document.createElement("span")
    posttexttext = document.createTextNode(specs["content"]);
    posttext.appendChild(posttexttext);
    posttext.setAttribute("id", "posttext" + specs["id"])




    // The date of the post
    // --------------------
    postdate = document.createElement("span");
    localized = commons.localizeTime(specs["date"], window.tz);
    postdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT))
    postdate.appendChild(postdatetext)
    postdate.setAttribute("id", "postdate" + specs["id"])
    postdate.setAttribute("class", "grey float-right")



    // The author of the post
    // ----------------------
    postauthor = document.createElement("span");
    postauthortext = document.createTextNode(specs["user"])
    postauthor.setAttribute("class", "grey float-right")
    postauthor.appendChild(postauthortext);
    postauthor.setAttribute("id", "postauthor" + specs["id"])


    // The link for the comment. <a>Comments [1]</a>
    // ---------------------------------------------
    postcommentlink = document.createElement("a")
    postcommenttext = document.createTextNode("Comments[" + specs["comments"] + "]")
    postcommentlink.appendChild(postcommenttext);
    postcommentlink.setAttribute("id", "postcomment" + specs["id"])
    postcommentlink.setAttribute("class", "link showcomments")
    postcommentlink.setAttribute("data-id", specs["id"])


    // div for everything under post.
    postunderdiv = document.createElement("div");
    postunderdiv.setAttribute("id", "postUnder" + specs["id"]);
    postunderdiv.setAttribute("class", "postUnder");
    postunderdiv.style.height = "0%";
    postunderdiv.style.display = "none";




    // Div for the comment box
    postcommentdiv = document.createElement("div")
    postcommentdiv.setAttribute("data-id", specs["id"]);
    postcommentdiv.setAttribute("loaded", false);
    postcommentdiv.setAttribute("id", "commentbox" + specs["id"])
    postcommentdiv.setAttribute("class", "commentbox");

    //Div for comment controls box. eg. textbox for form and button
    // to add comment.
    // Div for the comment box
    postcontrolsdiv = document.createElement("div")
    postcontrolsdiv.setAttribute("id", "controlsbox" + specs["id"])


    postunderdiv.appendChild(postcommentdiv);
    postunderdiv.appendChild(postcontrolsdiv);

    // Appends everything
    if (specs["pinned"]) {
        postele.appendChild(pinnedBadge);
        postele.appendChild(br2);
        postele.setAttribute("pinned", true);
    } else {
        postele.setAttribute("pinned", false);
    }
    postele.appendChild(posttext);
    postele.appendChild(postdate);
    postele.appendChild(br);
    postele.appendChild(postauthor);
    postele.appendChild(postcommentlink);
    // postele.appendChild(postcommentdiv);
    // postele.appendChild(postcontrolsdiv);
    postele.appendChild(postunderdiv);
    postele.appendChild(hr);

    return postele;

}

function genComment(specs) {
    commentBox = document.createElement("div");
    br = document.createElement("br")
    hr = document.createElement("hr")
    // Text of comment
    // ---------------
    commenttext = document.createElement("span")
    commenttextnode = document.createTextNode(specs["content"]);
    commenttext.setAttribute("id", "commenttext" + specs["id"])
    commenttext.appendChild(commenttextnode);



    // Date of comment
    commentdate = document.createElement("span");
    localized = commons.localizeTime(specs["date"], window.tz);
    commentdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT));
    commentdate.setAttribute("id", "commentdate" + specs["id"]);
    commentdate.setAttribute("class", "grey float-right")
    commentdate.appendChild(commentdatetext)


    // Author of comment
    commentauthor = document.createElement("span")
    commentauthornode = document.createTextNode(specs["user"]);
    commentauthor.setAttribute("id", "commentauthor" + specs["id"])
    commentauthor.setAttribute("class", "grey float-right")
    commentauthor.appendChild(commentauthornode);

    // append everything
    commentBox.appendChild(commenttext);
    commentBox.appendChild(commentdate);
    commentBox.appendChild(br);
    commentBox.appendChild(commentauthor);
    commentBox.appendChild(hr);

    return commentBox;
}

function genCheckbox(specs) {
    box = document.createElement("div");
    box.setAttribute("class", "custom-control custom-checkbox");
    boxInput = document.createElement("input");
    boxInput.setAttribute("type", "checkbox");
    boxInput.setAttribute("class", "custom-control-input");
    boxInput.setAttribute("id", specs["id"]);
    boxPostLabel = document.createElement("label");
    boxPostLabel.setAttribute("class", "custom-control-label");
    boxPostLabel.setAttribute("for", specs["id"]);
    boxPostLabelText = document.createTextNode(specs["text"]);
    boxPostLabel.appendChild(boxPostLabelText);
    box.appendChild(boxInput);
    box.appendChild(boxPostLabel);

    return box;
}