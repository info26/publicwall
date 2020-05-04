// profile.js
// 2008 profolio code
// all rights reserved
// international copyright secured

// licensed for use.

function savesettings(){
      $.ajax({
        type: "POST",
        url: "/save-profile/",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            'description': $("#profilebox").val(),
            username: $("#usernameinput").val()
        },
        success: function(data) {
          if (data["ok"]) {
          $("#donemodal").modal();
          } else {
            notify(data['error'], "info")
          }
        },
    });
}