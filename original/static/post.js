//static/post.js -- part of the public wall
// version 2.8
// (C) 2008. CC BY-NC-SA 2.0. 
// The above copyright does not apply to sections listed. 




$("#post").submit(function () {
    //do stuff with data, then reload the page. 
    $("#submit-button").attr("disabled", true);
    $.ajax({
        type: "POST",
        url: "/post-post/",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            post_text: $("#post_text").val()
        },
        success: function (data) {
            console.log(data)
            if (data["ok"] == true) {
                location.href = "/"
            }
            if (data["ok"] == false) {
                notify(data["error"], "info")
                $("#submit-button").attr("disabled", false);


            }
        },
    });
    event.preventDefault();

})

$(".commenta").click(function () {
    //get comment set from server .
    //enumerate comment set. 
    //display comment set. 
    if ($(".commentdiv" + $(this).attr("data-id")).attr("data-filled") == "False") {
        $.ajax({
            type: "POST",
            url: "/get-comments/",
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                commentid: parseInt($(this).attr("data-id"))
            },
            success: function (data) {
                if (data["ok"] == true) {
                    console.log(data)
                    console.log(data['commentid'])
                    $(".commentdiv" + data['commentid']).append("Comments")
                    $.each(data['data'], function (key, value) {
                        if (data['editpost'] == true) {
                            //Revision 5 -- Change the way the comments render, as well as add some styling to the comment box. 
                            $(".commentdiv" + data['commentid']).append("<hr>" + "<a class='edita' onclick='editcommentfunc(" + value['id'] + ")' data-id=" + value['id'] + ">Edit comment</a><br><span class='postdate commentdate" + value["id"] + "'>" + value["date"] + "</span><span class='commenttext" + value["id"] + "'>" + value["text"] + "</span><br><span class='userspan userspan" + value['id'] + "'>Posted by: " + value["user"] + "</span>")
                        } else {
                            $(".commentdiv" + data['commentid']).append("<hr>" + "<span class='postdate commentdate" + value["id"] + "'>" + value["date"] + "</span><span class='commenttext" + value["id"] + "'>" + value["text"] + "</span><br><span class='userspan userspan" + value['id'] + "'>Posted by: " + value["user"] + "</span>")
                        }
                    });
                    $(".controlcommentdiv" + data['commentid']).append("<form><div class='form-group'><textarea class='form-control commenttextarea' id='textarea" + data['commentid'] + "'></textarea></div><div class='form-group'><a  class='btn btn-primary' onclick='postcomment(" + data['commentid'] + ")' data-id=" + data['commentid'] + ">Comment</button></div></form>")
                    if (data["postlocked"]) {
                        $("#textarea" + data['commentid']).attr("disabled", true)
                    }
                    $(".commentdiv" + data['commentid']).toggle(250);
                    $('.controlcommentdiv' + data['commentid']).toggle(250)
                    $(".commentdiv" + data['commentid']).attr("data-filled", "True")
                }
                if (data["ok"] == false) {
                    notify(data["error"], "info")
                }

            },
        });
    } else {

        $(".commentdiv" + $(this).attr("data-id")).toggle(250)
        $('.controlcommentdiv' + $(this).attr("data-id")).toggle(250)
    }



})

function postcomment(id) {
    window.tempid = id
    $.ajax({

        type: 'POST',
        url: '/make-comment/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            postid: window.tempid,
            commenttext: $("#textarea" + window.tempid).val()
        },
        success: function (data) {
            if (data["ok"] == true) {
                console.log(data);
                $(".commentdiv" + data['commentid']).append("<hr><div class='postdate'>" + data["date"] + "</div>" + "" + $("#textarea" + window.tempid).val() + "<br>Posted by: " + data['user'])
                $("#textarea" + window.tempid).val("")
            } else {
                notify(data["error"], "info")
            }
        }
    })

}

//gomakethings.com
// Copyright does not apply to this section of code. 111 - 132
document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase() !== 'textarea') return;
    autoExpand(event.target);
}, false);
var autoExpand = function (field) {

    // Reset field height
    field.style.height = 'inherit';

    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);

    // Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';

};

//below are editing functions. 

//build 92 -- remove admin functions to prevent data leakage. 


function openProfile(userid) {
    window.currentviewing = userid
    $.ajax({

        type: 'POST',
        url: '/user-profile/' + window.currentviewing + "/",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
        },
        success: function (data) {
            if (data["ok"] == true) {
                $("#modaltitle").text(data["username"]);
                $("#descriptiontitle").text(data["description"]);
                $("#iddisplay").text(data["id"])
                $("#usermodal").modal();
            } else {
                notify(data["error"], "info")
            }
        }
    })
}