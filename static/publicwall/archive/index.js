/* The following code is covered under the MIT license */
/*
Copyright 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


// this script is for index !!

// Hey! Thanks for looking at my code! This is a 100% Javascript renderer for the public wall.
// On the older version, the posts were rendered using Django templates, but now they are rendered
// using this javascript renderer.
/* https://developer.snapappointments.com/bootstrap-select/ */



/* server gives page1 first, so set window.pageRendered to 1 */
/* window.pageRendered = 1; */






/* 
 * render()
 * Function is called when page loads, to render what
 * the user initially sees. 
 */
function render() {

}
/* 
 * postPost()
 * Function is called when user attempts to make a new post, 
 * using the "Submit" button
 */
function postPost() {
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
    $("no-posts-alert").hide();


    $.ajax({
        type: 'POST',
        url: '',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: "addpost",
            content: $("#posttext").val()
        },
        postdata: {
            content: $("#posttext").val(),
        },
        success: function (data) {
            gennedPost = genPostElement({
                id: data["id"],
                content: this.postdata["content"],
                /* TODO: Change this VVV*/
                pinned: false,
                user: window.username,
                date: data["date"],
                /* Assume this post has 0 comments*/
                comments: 0,
                
            })

            /* Using pure DOM because jquery
            seems to glitch out when querying children
            and looping over the list. */
            renderedPosts = $("#posts")[0].children;
            firstNotPinned = null; 
        
            /* TODO: Plop post at top, if it is pinned */
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
            if (firstNotPinned == null) {
                /* All the posts are pinned.... */
                /* so just plop it at the top   */
                $("#posts").prepend(gennedPost);
            }
            $(gennedPost).insertBefore(firstNotPinned);


            /* There is probably a better way to do this.... 
            TOO BAD!                                        */
            registerCommentHook($(gennedPost).children(".showcomments"));
            
        }
    });
    /* render(); */
}








/* Init and render page via render(); and also display
logged in notice. */
$(function () {


});
function registerCommentHook(selector) {
    // register hook for when a link to show comments is clicked.
    $(selector).click(function () {
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

                        commentElement = genComment(data["comments"][comment]);

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
                        commentSubmit.setAttribute("class", "btn btn-primary comment-button");
                        commentSubmit.setAttribute("data-post-id", this.postid);




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

function postComment(button) {



}




/* Auto load more posts! */

$(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        if (window.pageRendered == -1) {
            return;
        }
        window.pageRendered++;
        $.ajax({
            type: 'POST',
            url: '',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                action: "getmoreposts",
                page: window.pageRendered,
            },
            success: function(data) {
                if (data["more"] == false) {
                    // no more pages. 
                    window.pageRendered = -1;
                }
                for (post in data["posts"]) {

                    postele = genPostElement(data["posts"][post]);
                    // Appends the prepared element into the DOM tree.
                    $("#posts").append(postele);
                    /* Register comments hook */
                    registerCommentHook($(postele).children(".showcomments"));

    
                }
            }
        });
    }
})
