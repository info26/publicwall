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
        });
    }


    // The content of the post:
    // ------------------------
    posttext = com.info.Dom({
        "tag": "span",
        "attrs": {
            "id": "posttext" + this.id,
            "style": "word-wrap: break-word; overflow: hidden;"
        },
        children: [
            {
                "text": this.content
            }
        ]
    });


    // The date of the post
    // --------------------
    postdate = document.createElement("span");

    localized = commons.localizeTime(this.date, window.tz);
    postdatetext = localized.format(settings.DATE_FORMAT);

    postdate = com.info.Dom({
        "tag": "span",
        "attrs": {
            "id": "postdate" + this.id,
            "class": "float-right"
        },
        children: [
            {
                "text": postdatetext
            }
        ]
    });


    // The author of the post
    // ----------------------
    postauthor = com.info.Dom({
        "tag": "span",
        "attrs": {
            "id": "postauthor" + this.id,
            "class": "grey float-right",
            "onclick": "showProfile(" + this.authorid + ")"
        },
        "children": [
            {
                "text": this.author
            }
        ]
    });

    // The link for the comment. <a>Comments [1]</a>
    // ---------------------------------------------
    postcommentlink = com.info.Dom({
        "tag": "a",
        "attrs": {
            "id": "postcomment" + this.id,
            "class": "link showcomments",
            "data-id": this.id
        },
        children: [
            {
                "text": "Comments[" + this.comments + "]"
            }
        ]
    });




    // div for everything under post.
    postunderdiv = document.createElement("div");
    postunderdiv = com.info.Dom({
        "tag": "div",
        "attrs": {
            "id": "postUnder" + this.id,
            "class": "postUnder"
        },
        "styles": {
            "height": "0%",
            "display": "none"
        }
    });



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
