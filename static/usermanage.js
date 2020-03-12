//usermanage.js
// for user management.

//hook form for looking up user. 


$("#userlookup").submit(function () {
    
    $.ajax({
        type: 'POST',
        url: '/requestuser/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            id: $("#idfield").val()
        },
        success: function (data) {
          if(data['ok'] == true){
            //only set if user exists. 
            window.editing = $("#idfield").val();
            window.data = data
            $("#resultwell").slideUp(500);
            setTimeout(function(){
            $("#usernameinput").val(window.data['username']);
            $("#descriptioninput").val(window.data['description']);
            $("#curtimezone").html(window.data['timezone']);
            $("#timezone").val(window.data['timezone']);
            $("#timezone").trigger('change');
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

$("#userform").submit(function (){
  $.ajax({
    type: 'POST',
    url: '/saveuser/',
    data: {
      csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
      id: window.editing,
      username: $("#usernameinput").val(),
      description: $("#descriptioninput").val(),
      timezone: $("#timezone").val()
    },
    success: function(data){
      if(data['ok'] == true){
        notify("Success!", "info")
      } else {
        notify(data['error'], "info")
      }
    }
  });
  event.preventDefault();

});
$('#timezone').select2();
