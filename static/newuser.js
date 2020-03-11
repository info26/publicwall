//new user.js
// an advanced form of user registration

// (C) 2008. CC BY-NC-SA 2.0

$("#stage1form").submit(function(){

  // send code to server for verifying. 
    $.ajax({
        type: "POST",
        url: "/new-user/",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: "validatecode",
            code: $("#codeinput").val()
        },
        success: function(data) {
            console.log(data)
            if (data["ok"] == true) {
              if(data["found"] == true){
              $("#stage2").slideDown(500);
              } else {
                notify("Invalid code!", "info")
              }
            }
        },
    });
    event.preventDefault();
})


$("#stage2form").submit(function(){

  // send code to server for verifying. 
    $.ajax({
        type: "POST",
        url: "/new-user/",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: "newuser",
            code: $("#codeinput").val(),
            username: $("#usernameinput").val(),
            password: $("#passwordinput").val(),
            email: $("#emailinput").val()
        },
        success: function(data) {
            if (data["ok"] == true) {
              $("#success").slideDown(30)
            } else {
                notify(data["error"], "info")
            }
        },
    });
    event.preventDefault();
})

// check if username is taken.
