com.info.CommentHandler = function(specs) {
    this.commentLink = specs["commentLink"];
    // reg comment hook
    com.info.CommentHandler.registerCommentHook(this.commentLink);
}





com.info.CommentHandler.prototype.registerSubmitFunc = function() {
    // alert($(button).attr("data-post-id"));
    // TODO: Send comment content to server.


    // Make new comment element.

    /* PostId needed to determine text */
    postId = this.id;

    /* Text needed here to determine post validity */
    text = $("#textInput" + postId).val();

    id = 0;


    if (text == "") {
        commons.notify({
            "type": NOTICE_TYPES.ERROR,
            "msg": "Your post cannot be blank!",
            "title": "Uh oh!",
            "delay": 5000
        });
        // stop processing this request.
        return;
    }

    /* Start actually processing this request */
    $.ajax({
        type: 'POST',
        url: '',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: 'addcomment',
            postId: parseInt($(button).attr("data-post-id")),
            text: $("#textInput" + postId).val()
        },
        commentData: {
            postId: parseInt($(button).attr("data-post-id")),
            text: $("#textInput" + postId).val(),
            date: new Date(),
            /* author = window.username, */
            /* Not needed because the code can retrieve username from the */
            /* window object without needing to go via this.commentData   */
        },
        success: function (data) {
            if (data["ok"]) {
                /* Yay, this post has cleared. */
                /* Nothing to do here!         */
            }
            else {
                /* Looks like the post has failed! */

                /* the two checks that are implemented are the locked post and blank         */
                /* comment check.                                                            */
                /* and these checks are implemented on the users's side as well as the       */
                /* on the server side. If the user is tampering around with the code         */
                /* just fail silently. (that's what they get when they tamper with code)     */


            }
            // The below is the same comment renderer used for other comments too! //

            commentBox = $("#commentbox" + this.commentData["postId"])[0];

            commentBox.appendChild(genComment({
                id: data["id"],
                content: this.commentData["text"],
                date: data["date"],
                user: window.username,
                authorid: window.userid,
            }))




        }
    });
    /* Clear the comment box's value. */
    /* This goes AFTER post-ing the   */
    /* backend because if i reset it  */
    /* the script would give blank    */
    /* to the backend because it      */
    /* reads the text box again when  */
    /* post-ing the server.           */
    $("#textInput" + postId).val("");
}

com.info.CommentHandler.prototype.registerCommentHook = function() {
    // register hook for when a link to show comments is clicked.
    $(this.postcommentlink).click(function () {
        // TODO: Clean this up!
        commentBox = $("#postUnder" + $(this).attr("data-id"));
        if (commentBox.attr("loaded") == "true") {
            // Ok, just open and close this then.
            if (commentBox.attr("shown") == "true") {
                // close the box
                commentBox.slideUp(settings.TOGGLE_SPEED)
                commentBox.attr("shown", "false")
            } else if (commentBox.attr("shown") == "false") {
                // open the box
                commentBox.slideDown(settings.TOGGLE_SPEED)
                commentBox.attr("shown", "true")
            }
        } else {
            // Get comments from server!
            console.log(this);
            $.ajax({
                type: 'POST',
                url: '',
                // passing data-id to the success func.
                postid: $(this).attr("data-id"),
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    action: "getcomments",
                    postid: $(this).attr("data-id"),
                },
                success: function (data) {
                    /* if more comments, then append link to go to seperate
                    page for more comments                                 */

                    if (data["more"] != -1) {
                        // factory required! 
                        moreCommentsLink = document.createElement("a");

                        moreCommentsLinkIcon = document.createElement("i");
                        moreCommentsLinkIcon.setAttribute("class", "fas fa-plus-square");

                        moreCommentsText = document.createTextNode(" Show " + data["more"] + " more comments")

                        moreCommentsLink.appendChild(moreCommentsLinkIcon);
                        moreCommentsLink.appendChild(moreCommentsText);

                        $("#commentbox" + this.postid)[0].append(moreCommentsLink);

                    }
                    for (comment in data["comments"]) {
                        prep = data["comments"][comment];
                        prep["postId"] = this.postId;
                        commentElement = new com.info.Comment(prep);
                        commentElement = commentElement.getDom();
                        $("#commentbox" + this.postid)[0].append(commentElement);

                    }


                    if (window.userPermissions["add-comment"]) {
                        // Create textbox for adding comment
                        commentInputBox = document.createElement("textarea");
                        // set style
                        commentInputBox.setAttribute("class", "form-control");
                        commentInputBox.setAttribute("id", "textInput" + this.postid);
                        if (data["locked"]) {
                            commentInputBox.setAttribute("disabled", true);
                            commentInputBox.setAttribute("placeholder", settings.POST_LOCKED_PLACEHOLDER);
                        } else if (!data["locked"]) {
                            commentInputBox.setAttribute("placeholder", settings.COMMENT_PLACEHOLDER);
                        }
                        this.InputBox = commentInputBox;

                        // create button for adding post
                        commentSubmit = document.createElement("button");

                        if (data["locked"]) {
                            // commentSubmit.setAttribute("disabled", true);

                            // init popover.
                            commentSubmit.setAttribute("data-toggle", "popover");
                            // commentSubmit.setAttribute("title", settings.POST_LOCKED_POPOVER_TITLE);
                            commentSubmit.setAttribute("data-content", settings.POST_LOCKED_POPOVER_CONTENT);
                            commentSubmit.setAttribute("tabindex", 0);
                            commentSubmit.setAttribute("data-trigger", "focus");

                        } else if (!data["locked"]) {
                            // only register click event if the post is not locked.
                            commentSubmit.onclick()
                        }

                        commentSubmitText = document.createTextNode(settings.CREATE_COMMENT_TEXT);
                        commentSubmit.appendChild(commentSubmitText);
                        commentSubmit.setAttribute("class", "btn btn-primary comment-button");
                        commentSubmit.setAttribute("data-post-id", this.postid);
                        this.commentSubmit = commentSubmit;



                        $("#controlsbox" + this.postid)[0].appendChild(commentInputBox);
                        $("#controlsbox" + this.postid)[0].appendChild(commentSubmit);

                    } else {
                        noPermission = document.createElement("i");
                        noPermissionText = document.createTextNode(settings.CANT_COMMENT_TEXT);
                        noPermission.appendChild(noPermissionText);
                        noPermission.setAttribute("class", "text-muted");

                        $("#controlsbox" + this.postid)[0].appendChild(noPermission);
                    }


                    $("#postUnder" + this.postid).slideDown(settings.TOGGLE_SPEED);
                    $("#postUnder" + this.postid).attr("shown", "true");
                    $("#postUnder" + this.postid).attr("loaded", "true");


                    // These need to be done AFTER the element is appended to the div.
                    if (data["locked"] && window.userPermissions["add-comment"]) {
                        $(commentSubmit).popover();
                        commentSubmit.setAttribute("title", settings.POST_LOCKED_POPOVER_TITLE);
                    }
                }
            });
        }

    });

}
