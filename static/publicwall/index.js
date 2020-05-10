/* The following code is covered under the MIT license */
/*
Copyright 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Hey! Thanks for looking at my code! This is a 100% Javascript renderer for the public wall.
// On the older version, the posts were rendered using Django templates, but now they are rendered
// using this javascript renderer.


$(function () {
    // Get posts from server.
    $.ajax({
        type: "POST",
        url: "",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: "getinfo"
        },
        success: function (data) {
            // write user's tz
            window.tz = data["tz"];
            window.username = data["username"];
            // text box to post things.
            //
            posttextbox = document.createElement("textarea");
            posttextbox.setAttribute("class", "form-control");
            posttextbox.setAttribute("placeholder", settings.POST_PLACEHOLDER)
            $("#content").append(posttextbox);


            for (post in data["posts"]) {
                br = document.createElement("br")
                // floating a br right causes problems
                // in firefox. 
                br.setAttribute("class", "grey")
                hr = document.createElement("hr")

                // Main post element
                // -----------------
                postele = document.createElement("div")
                // -----------------


                // The content of the post:
                // ------------------------
                posttext = document.createElement("span")
                posttexttext = document.createTextNode(data["posts"][post]["content"]);
                posttext.appendChild(posttexttext);
                posttext.setAttribute("id", "posttext" + data["posts"][post]["id"])




                // The date of the post
                // --------------------
                postdate = document.createElement("span");
                localized = commons.localizeTime(data["posts"][post]["date"], window.tz);
                postdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT))
                postdate.appendChild(postdatetext)
                postdate.setAttribute("id", "postdate" + data["posts"][post]["id"])
                postdate.setAttribute("class", "grey float-right")



                // The author of the post
                // ----------------------
                postauthor = document.createElement("span");
                postauthortext = document.createTextNode(data["posts"][post]["user"])
                postauthor.setAttribute("class", "grey float-right")
                postauthor.appendChild(postauthortext);
                postauthor.setAttribute("id", "postauthor" + data["posts"][post]["id"])


                // The link for the comment. <a>Comments [1]</a>
                // ---------------------------------------------
                postcommentlink = document.createElement("a")
                postcommenttext = document.createTextNode("Comments[" + data["posts"][post]["comments"] + "]")
                postcommentlink.appendChild(postcommenttext);
                postcommentlink.setAttribute("id", "postcomment" + data["posts"][post]["id"])
                postcommentlink.setAttribute("class", "link showcomments")
                postcommentlink.setAttribute("data-id", data["posts"][post]["id"])


                // div for everything under post.
                postunderdiv = document.createElement("div");
                postunderdiv.setAttribute("id", "postUnder" + data["posts"][post]["id"]);
                postunderdiv.setAttribute("class", "postUnder");
                postunderdiv.style.height = "0%";
                postunderdiv.style.display = "none";




                // Div for the comment box
                postcommentdiv = document.createElement("div")
                postcommentdiv.setAttribute("data-id", data["posts"][post]["id"]);
                postcommentdiv.setAttribute("loaded", false);
                postcommentdiv.setAttribute("id", "commentbox" + data["posts"][post]["id"])
                postcommentdiv.setAttribute("class", "commentbox");

                //Div for comment controls box. eg. textbox for form and button
                // to add comment.
                // Div for the comment box
                postcontrolsdiv = document.createElement("div")
                postcontrolsdiv.setAttribute("id", "controlsbox" + data["posts"][post]["id"])


                postunderdiv.appendChild(postcommentdiv);
                postunderdiv.appendChild(postcontrolsdiv);

                // Appends everything
                postele.appendChild(posttext);
                postele.appendChild(postdate);
                postele.appendChild(br);
                postele.appendChild(postauthor);
                postele.appendChild(postcommentlink);
                // postele.appendChild(postcommentdiv);
                // postele.appendChild(postcontrolsdiv);
                postele.appendChild(postunderdiv);
                postele.appendChild(hr);

                // Appends the prepared element into the DOM tree.
                $("#content").append(postele);
            }
            //Call to continue initialization.
            continueInit();
        },
    });
});
function continueInit() {
    // register hook for when a link to show comments is clicked.
    $(".showcomments").click(function () {
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
                    for (comment in data["comments"]) {
                        br = document.createElement("br")
                        hr = document.createElement("hr")



                        commentBox = $("#commentbox" + this.postid)[0];


                        // Text of comment
                        // ---------------
                        commenttext = document.createElement("span")
                        commenttextnode = document.createTextNode(data["comments"][comment]["content"]);
                        commenttext.setAttribute("id", "commenttext" + data["comments"][comment]["id"])
                        commenttext.appendChild(commenttextnode);



                        // Date of comment
                        commentdate = document.createElement("span");
                        localized = commons.localizeTime(data["comments"][comment]["date"], window.tz);
                        commentdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT));
                        commentdate.setAttribute("id", "commentdate" + data["comments"][comment]["id"]);
                        commentdate.setAttribute("class", "grey float-right")
                        commentdate.appendChild(commentdatetext)


                        // Author of comment
                        commentauthor = document.createElement("span")
                        commentauthornode = document.createTextNode(data["comments"][comment]["user"]);
                        commentauthor.setAttribute("id", "commentauthor" + data["comments"][comment]["id"])
                        commentauthor.setAttribute("class", "grey float-right")
                        commentauthor.appendChild(commentauthornode);

                        // append everything
                        commentBox.appendChild(commenttext);
                        commentBox.appendChild(commentdate);
                        commentBox.appendChild(br);
                        commentBox.appendChild(commentauthor);
                        commentBox.appendChild(hr);
                    }
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
                        commentSubmit.setAttribute("onclick", "postComment(this)");
                    }

                    commentSubmitText = document.createTextNode(settings.CREATE_COMMENT_TEXT);
                    commentSubmit.appendChild(commentSubmitText);
                    commentSubmit.setAttribute("class", "btn btn-primary");
                    commentSubmit.setAttribute("data-post-id", this.postid);




                    $("#controlsbox" + this.postid)[0].appendChild(commentInputBox);
                    $("#controlsbox" + this.postid)[0].appendChild(commentSubmit);


                    $("#postUnder" + this.postid).slideDown(settings.TOGGLE_SPEED);
                    $("#postUnder" + this.postid).attr("shown", "true");
                    $("#postUnder" + this.postid).attr("loaded", "true");


                    // These need to be done AFTER the element is appended to the div.
                    $(commentSubmit).popover();
                    commentSubmit.setAttribute("title", settings.POST_LOCKED_POPOVER_TITLE);
                }
            });
        }

    });
}

function postComment(button) {
    // alert($(button).attr("data-post-id"));
    // TODO: Send comment content to server.


    // Make new comment element.

    /* PostId needed to determine text */
    postId = parseInt($(button).attr("data-post-id"));

    /* Text needed here to determine post validity */
    text = $("#textInput" + postId).val();

    //TODO: Actually AJAX server!
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
            /* window object.                                             */
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
            br = document.createElement("br")
            hr = document.createElement("hr")


            commentBox = $("#commentbox" + this.commentData["postId"])[0];


            // Text of comment
            // ---------------
            commenttext = document.createElement("span")
            commenttextnode = document.createTextNode(this.commentData["text"]);
            commenttext.setAttribute("id", "commenttext" + id)
            commenttext.appendChild(commenttextnode);



            // Date of comment
            commentdate = document.createElement("span");
            localized = commons.localizeTime(this.commentData["date"], window.tz);
            commentdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT));
            commentdate.setAttribute("id", "commentdate" + data["id"]);
            commentdate.setAttribute("class", "grey float-right")
            commentdate.appendChild(commentdatetext)


            // Author of comment
            commentauthor = document.createElement("span")
            commentauthornode = document.createTextNode(window.username);
            commentauthor.setAttribute("id", "commentauthor" + data["id"])
            commentauthor.setAttribute("class", "grey float-right")
            commentauthor.appendChild(commentauthornode);

            // append everything
            commentBox.appendChild(commenttext);
            commentBox.appendChild(commentdate);
            commentBox.appendChild(br);
            commentBox.appendChild(commentauthor);
            commentBox.appendChild(hr);

            $("#commentBox" + this.commentData["postId"]);



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
