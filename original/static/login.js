//static/login.js -- part of the public wall
// (C) 2008. CC BY-NC-SA 2.0


$("#loginform").submit(function() {
    $.ajax({
        type: "POST",
        url: "/user-login/",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function(data) {
            console.log(data)
            if (data["ok"] == true) {
                location.href = "/?loggedin=1"
            }
            if (data["ok"] == false) {
              notify(data['error'], "info")
                $("#submit-button").attr("disabled", false);


            }
        },
    });
    event.preventDefault();
})