goog.require("com.info.Checkbox");


goog.provide("com.info.Base");


com.info.Base.init = function() {
    /* apply active class to 'home' tab. */
    $("#home-nav-item").addClass("active")
    /* Show logged in navbar */
    $("#nav-logged-in").show();
    if (window.urlParams.has("loggedin")) {
        // no need to wait for the 
        // documentReady event. 
        // init() gets called by the
        // documentReady event :p 
        commons.notify({
            type: NOTICE_TYPES.SUCCESS,
            title: "You have logged in!",
            delay: 5000,
        });
    }
    // render the initial stuff eg. posts and the posting textbox
    com.info.Base.render();
    // register the scroll listener -- to load more posts when user scrolls
    // to bottom of page. 
    com.info.Base.scrollListener();
    // auto expand text boxes. 
    com.info.Misc.initTextboxAutoExpand();
}





com.info.Base.registerPostingFunc = function() {
    $(com.info.Base.postButton).click(function() {
        /*
        alert("Post content: " + $("#posttext").val());
        */
        if ($("#posttext").val() == "") {
            commons.notify({
                type: NOTICE_TYPES.ERROR,
                msg: "Your post cannot be blank! ",
                delay: 5000,
                title: "Uh oh!"
            });
            // Stop processing request
            return;
        }
        /* Clear empty posts alert. */
        /* This won't error out as
        jquery is perfectly fine when it can't find
        the element i'm looking for.               */
        $("#no-posts-alert").hide();
        if (window.userPermissions["admin"]) {
            /* Sort of a hacky way to do it */

            locked = $(com.info.Base.lockPost).find("input").is(":checked");
            pinned = $(com.info.Base.pinPost).find("input").is(":checked");
        } else {
            locked = false;
            pinned = false;
        }

        $.ajax({
            type: 'POST',
            url: '',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                action: "addpost",
                content: $(com.info.Base.textBox).val(),
                locked: locked,
                pinned: pinned,
            },
            postdata: {
                content: $(com.info.Base.textBox).val(),
                locked: locked,
                pinned: pinned,
            },
            success: function (data) {
                gennedPost = new com.info.Post({
                    id: data["id"],
                    content: this.postdata["content"],
                    /* TODO: Change this VVV*/
                    pinned: this.postdata.pinned,
                    author: window.username,
                    date: data["date"],
                    /* Assume this post has 0 comments*/
                    comments: 0,

                })

                /* Using pure DOM because jquery
                seems to glitch out when querying children
                and looping over the list. */
                renderedPosts = $("#posts")[0].children;
                firstNotPinned = null;

                if (pinned == false) {
                    for (post = 0; post < renderedPosts.length; post++) {
                        /*if (typeof $(renderedPosts[post]).attr("pinned") == "undefined") {
                            continue;
                        }*/
                        // console.log($(renderedPosts[post]).attr("pinned"));
                        if ($(renderedPosts[post]).attr("pinned") == "false") {
                            /* We found the first post that isn't pinned. YAY! */
                            firstNotPinned = renderedPosts[post];
                            break;
                        }
                    }
                }
                if (firstNotPinned == null) {
                    /* All the posts are pinned.... */
                    /* so just plop it at the top   */
                    $("#posts").prepend(gennedPost.getDom());
                }
                $(gennedPost.getDom()).insertBefore(firstNotPinned);
                $(com.info.Base.textBox).val('');


            }
        });
    })
}

com.info.Base.render = function() {
    $.ajax({
        type: "POST",
        url: "",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: "getinfo"
        },
        success: function (data) {
            $("#content").empty();
            // write user's tz
            window.tz = data["tz"];
            window.username = data["username"];
            window.userid = data["userid"];
            // write user perms
            window.userPermissions = data["permissionList"];

            // console.log(data);


            if (data["pages"] == 1) {
                // No more pages!
                com.info.Base.pageRendered = -1;
            } else {
                // there are more pages!
                com.info.Base.pageRendered = 1;
            }
            // text box to post things.
            //
            posttextbox = document.createElement("textarea");
            posttextbox.setAttribute("class", "form-control");
            if (!window.userPermissions["add-post"]) {
                // wait, this user doesn't have permission to add a post !!!!! //
                posttextbox.setAttribute("disabled", true);
                posttextbox.setAttribute("placeholder", settings.POST_DISABLED_PLACEHOLDER);
            } else {
                posttextbox.setAttribute("placeholder", settings.POST_PLACEHOLDER);
            }
            posttextbox.setAttribute("id", "posttext");

            com.info.Base.textBox = posttextbox;

            $("#content").append(posttextbox);




            // locking / pinning:
            // locking:

            if (window.userPermissions["add-post"]) {

                postControlBox = document.createElement("div");
                postControlBox.setAttribute("class", "form-inline");

                /* group1 = document.createElement("div"); */
                if (window.userPermissions["admin"]) {
                    lockPost = new com.info.Checkbox({
                        id: "lockPostCheckbox",
                        text: "Locked?"
                    });
                    com.info.Base.lockPost = lockPost;
                    lockPost = lockPost.getDom();
                    com.info.Base.lockPost = lockPost;
                    /* Slight spacing */
                    lockPost.classList.add("mr-2");
                    postControlBox.appendChild(lockPost);

                    pinPost = new com.info.Checkbox({
                        id: "pinPostCheckbox",
                        text: "Pinned?"
                    })

                    pinPost = pinPost.getDom();
                    com.info.Base.pinPost = pinPost;

                    postControlBox.appendChild(pinPost);
                }


                $("#content").append(postControlBox);

            }



            // button to submit text box content:
            postbutton = document.createElement("button");
            postbuttontext = document.createTextNode(settings.POST_POST_BUTTON_TEXT);
            postbutton.appendChild(postbuttontext);
            postbutton.setAttribute("class", "btn btn-primary post-button");
            com.info.Base.postButton = postbutton;
            $("#content").append(postbutton);


            if (!window.userPermissions["add-post"]) {
                postbutton.setAttribute("data-toggle", "popover");
                postbutton.setAttribute("data-content", settings.CANT_POST_POPOVER_CONTENT);
                postbutton.setAttribute("tabindex", 0);
                postbutton.setAttribute("data-trigger", "focus");
            } else {
                com.info.Base.registerPostingFunc();
            }



            // initing the post button popover: if no permission to post:
            // for some reason, these need to be done AFTEr the element
            // is appended the the dom tree.
            if (!window.userPermissions["add-post"]) {
                $(postbutton).popover();
                postbutton.setAttribute("title", settings.CANT_POST_POPOVER_TITLE);
            }


            for (post in data["posts"]) {



                Post = new com.info.Post(data["posts"][post]);
                posteleDom = Post.getDom();
                // Post.registerCommentHook();
                // Appends the prepared element into the DOM tree.
                $("#posts").append(posteleDom);




            }

            if (data["posts"].length == 0) {
                br = document.createElement("br");
                br2 = document.createElement("br");
                noPostsAlert = document.createElement("div");
                noPostsAlert.setAttribute("class", "alert alert-primary");
                noPostsAlertText = document.createTextNode(settings.NO_POSTS_ALERT_TEXT);
                noPostsAlert.appendChild(noPostsAlertText);
                noPostsAlert.setAttribute("id", "no-posts-alert");
                $("#content").append(br);
                $("#content").append(br2);
                $("#content").append(noPostsAlert);
                com.info.Base.noPostsAlert = noPostsAlert;
            }
            //Call to continue initialization.
            // registerCommentHook('.showcomments');

        },
    });
};


com.info.Base.scrollListener = function() {
    // init page rendered to 0;
    com.info.Base.pageRendered = 1;
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            if (com.info.Base.pageRendered == -1) {
                return;
            }
            com.info.Base.pageRendered++;
            $.ajax({
                type: 'POST',
                url: '',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    action: "getmoreposts",
                    page: com.info.Base.pageRendered,
                },
                success: function(data) {
                    if (data["more"] == false) {
                        // no more pages.
                        com.info.Base.pageRendered = -1;
                    }
                    for (post in data["posts"]) {

                        postele = new com.info.Post(data["posts"][post]);
                        // Appends the prepared element into the DOM tree.
                        $("#posts").append(postele.getDom());
                    }
                }
            });
        }
    })
}
