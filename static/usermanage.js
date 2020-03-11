//usermanage.js
// for user management.

//hook form for looking up user. 


$("#userlookup").submit(function () {
    window.editing = $("#idfield").val();
    $.ajax({
        type: 'POST',
        url: '/requestuser/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            id: $("#idfield").val()
        },
        success: function (data) {
          if(data['ok'] == true){
            window.data = data
            $("#resultwell").slideUp(500);
            setTimeout(function(){
            $("#usernameinput").val(window.data['username']);
            $("#descriptioninput").val(window.data['description']);
            $("#curtimezone").html(window.data['timezone']);
            $("#timezone").val(window.data['timezone']);
            $("#resultwell").slideDown(500);
            }, 500)
          } else {
            if(data['errorcode'] == "DoesNotExist"){
              notify("User does not exist", "info")
            }
          }
        }
    });
    event.preventDefault();
});

// fix after #2 is resolved. 
// function save(){
//   $.ajax({
//     type: 'POST',
//     url: '/saveuser/',
//     data: {
//       csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
//       id: window.editing,
//       username: $("#usernameinput").val(),
//       description: $("#descriptioninput").val(),
//       timezone: $("#curtimezone")
//     }
//   })
// }
