goog.require("com.info.Checkbox");


goog.provide("com.info.Base");

com.info.Base.init = function() {
    /* apply active class to 'home' tab. */
    $("#home-nav-item").addClass("active")
    /* Show logged in navbar */
    $("#nav-logged-in").show();
    if (window.urlParams.has("loggedin")) {
        commons.notify({
            type: NOTICE_TYPES.SUCCESS,
            title: "You have logged in!",
            delay: 5000,
        });
    }
    com.info.Base.render();
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
                window.pageRendered = -1;
            } else {
                // there are more pages! 
                window.pageRendered = 1;
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
            $("#content").append(posttextbox);




            // locking / pinning:
            // locking:
            
            if (window.userPermissions["add-post"]) {

                postControlBox = document.createElement("div");
                postControlBox.setAttribute("class", "form-inline");

                /* group1 = document.createElement("div"); */

                lockPost = new com.info.Checkbox({
                    id: "lockPostCheckbox",
                    text: "Locked?"
                });

                lockPost = lockPost.getDom();
                /* Slight spacing */
                lockPost.classList.add("mr-2");
                postControlBox.appendChild(lockPost);

                pinPost = new com.info.Checkbox({
                    id: "pinPostCheckbox",
                    text: "Pinned?"
                })
                pinPost = pinPost.getDom();


                postControlBox.appendChild(pinPost);

                $("#content").append(postControlBox);

            }



            // button to submit text box content: 
            postbutton = document.createElement("button");
            postbuttontext = document.createTextNode(settings.POST_POST_BUTTON_TEXT);
            postbutton.appendChild(postbuttontext);
            postbutton.setAttribute("class", "btn btn-primary post-button");
            if (!window.userPermissions["add-post"]) {
                postbutton.setAttribute("data-toggle", "popover");
                postbutton.setAttribute("data-content", settings.CANT_POST_POPOVER_CONTENT);
                postbutton.setAttribute("tabindex", 0);
                postbutton.setAttribute("data-trigger", "focus");
            } else {
                postbutton.setAttribute("onclick", "postPost()");
            }
            $("#content").append(postbutton);


            // initing the post button popover: if no permission to post: 
            // for some reason, these need to be done AFTEr the element 
            // is appended the the dom tree. 
            if (!window.userPermissions["add-post"]) {
                $(postbutton).popover();
                postbutton.setAttribute("title", settings.CANT_POST_POPOVER_TITLE);
            }


            for (post in data["posts"]) {



                Post = new com.info.Post(data["posts"][post]);
                console.log(Post);
                posteleDom = Post.getDom();
                console.log(Post);
                Post.registerCommentHook();
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
            }
            //Call to continue initialization.
            // registerCommentHook('.showcomments');
        },
    });
}