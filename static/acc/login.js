// (C) 2008. CC BY-NC-SA 2.0


$("#login-form").submit(function() {
    $.ajax({
        type: "POST",
        url: "",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function(data) {
            console.log(data)
            if (data["correct"] == true) {
                location.href = "/?loggedin=1"
            }
            if (data["correct"] == false) {
                commons.notify({
                    type: NOTICE_TYPES.ERROR, 
                    title: "Uh oh!", 
                    msg: "Your password or username is incorrect", 
                    delay: 5000
                })
            }
        },
    });
    event.preventDefault();
})