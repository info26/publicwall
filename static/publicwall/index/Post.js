goog.provide("com.info.Post")

com.info.Post = function(specs) {
    this.pinned = specs["pinned"];
    this.content = specs["content"];
    this.date = specs["date"];
    this.author = specs["author"];
    this.authorid = specs["authorid"];
    this.comments = specs["comments"];
    this.id = specs["id"];
}

com.info.Post.prototype.getDom = function() {
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
    if (this.pinned) {
        // This post is pinned
        /*
        pinnedBadge = document.createElement("span");
        pinnedBadge.setAttribute("class", "badge badge-primary");
        pinnedBadgeIcon = document.createElement("i");
        pinnedBadgeIcon.setAttribute("class", "fas fa-thumbtack");
        pinnedBadge.appendChild(pinnedBadgeIcon);
        pinnedBadgeText = document.createTextNode(" PINNED");
        */
        /* com.info.Dom */
        pinnedBadge = com.info.Dom({
            "tag": "span",
            "attrs": {
                "class": "badge badge-primary"
            },
            children: [
                {
                    "tag": "i",
                    "attrs": {
                        "class": "fas fa-thumbtack"
                    }
                },
                {
                    "text": " PINNED"
                }
            ]
        })
        pinnedBadge.appendChild(pinnedBadgeText);
    }


    // The content of the post:
    // ------------------------
    posttext = document.createElement("span")
    posttexttext = document.createTextNode(this.content);
    posttext.appendChild(posttexttext);
    posttext.setAttribute("id", "posttext" + this.id)
    posttext.setAttribute("style", "word-wrap: break-word; overflow: hidden;")



    // The date of the post
    // --------------------
    postdate = document.createElement("span");

    localized = commons.localizeTime(this.date, window.tz);
    postdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT))
    postdate.appendChild(postdatetext)
    postdate.setAttribute("id", "postdate" + this.id)
    postdate.setAttribute("class", "float-right")



    // The author of the post
    // ----------------------
    postauthor = document.createElement("span");
    postauthor.setAttribute("onclick", "showProfile(" + this.authorid + ")");
    postauthortext = document.createTextNode(this.author)
    postauthor.setAttribute("class", "grey float-right")
    postauthor.appendChild(postauthortext);
    postauthor.setAttribute("id", "postauthor" + this.id)


    // The link for the comment. <a>Comments [1]</a>
    // ---------------------------------------------
    postcommentlink = document.createElement("a")
    postcommenttext = document.createTextNode("Comments[" + this.comments + "]")
    postcommentlink.appendChild(postcommenttext);
    postcommentlink.setAttribute("id", "postcomment" + this.id)
    postcommentlink.setAttribute("class", "link showcomments")
    postcommentlink.setAttribute("data-id", this.id)


    // div for everything under post.
    postunderdiv = document.createElement("div");
    postunderdiv.setAttribute("id", "postUnder" + this.id);
    postunderdiv.setAttribute("class", "postUnder");
    postunderdiv.style.height = "0%";
    postunderdiv.style.display = "none";




    // Div for the comment box
    postcommentdiv = document.createElement("div")
    postcommentdiv.setAttribute("data-id", this.id);
    postcommentdiv.setAttribute("loaded", false);
    postcommentdiv.setAttribute("id", "commentbox" + this.id)
    postcommentdiv.setAttribute("class", "commentbox");

    //Div for comment controls box. eg. textbox for form and button
    // to add comment.
    // Div for the comment box
    postcontrolsdiv = document.createElement("div")
    postcontrolsdiv.setAttribute("id", "controlsbox" + this.id)


    postunderdiv.appendChild(postcommentdiv);
    postunderdiv.appendChild(postcontrolsdiv);


    // start a comment handler
    commentHandler = new com.info.CommentHandler({
        "commentLink": postcommentlink,
        "postId": this.id,
        "commentBox": postcommentdiv,
        "controlsBox": postcontrolsdiv,
        "postUnder": postunderdiv,
        "post": this,
    });
    // console.log(this.id);


    // Appends everything
    if (this.pinned) {
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

    this.domElement = postele;
    this.postcommentlink = postcommentlink;

    return postele;
}
