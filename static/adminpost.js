// (C) 2008. CC BY-NC-SA 2.0

function editcommentfunc(editcommid){
  window.currenteditingcomment = editcommid
  //ask server for info on comment. AJAX request is fine. 
  $.ajax({
        type: 'POST',
        url: '/getcommentinfo/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            commentid: window.currenteditingcomment,
        },
        success: function(data) {
            if (data["ok"] == true) {
              $("#cuserinputedit").val(data['user']);
              $("#cdateinputedit").val(data['date']);
              $("#ctextinputedit").val(data['content']);
              $("#commenteditmodal").modal();
            } else {
              notify(data["error"], "info")
            }
        }
    });
};

function savecommentdata(){
  $.ajax({
    type:'POST',
    url: '/savecommentinfo/',
    data: {
      csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
      date: $("#cdateinputedit").val(),
      user: $("#cuserinputedit").val(),
      content: $("#ctextinputedit").val(),
      commentid: window.currenteditingcomment
      //pick up here. 
    },
    success: function(data){
      if (data["ok"] == true) {
        window.location.href="/?scrolltocomm="+window.currenteditingcomment
      } else {
        notify(data["error"], "info")
      }
    }
  })
};

$(".edita").click(function(){
  window.currentediting = $(this).attr("data-id")
      $.ajax({

        type: 'POST',
        url: '/getpostinfo/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            postid: window.currentediting
        },
        success: function(data) {
            if (data["ok"] == true) {
              //write information to modal, then open it.
              $("#textinputedit").val(data["text"]);
              $("#dateinputedit").val(data["date"]);
              $("#userinputedit").val(data["user"]);
              $("#lockedinputedit").prop("checked", data['locked']);
              $("#pinnedinputedit").prop("checked", data['pinned']);
              $("#editmodal").modal();
            } else {
              notify(data["error"], "info")
            }
        }
    })
});

function editmodalsavedata(){
        $.ajax({

        type: 'POST',
        url: '/savepostinfo/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            postid: window.currentediting,
            text : $("#textinputedit").val(),
            date : $("#dateinputedit").val(),
            user : $("#userinputedit").val(),
            locked : $("#lockedinputedit").prop("checked"),
            pinned : $("#pinnedinputedit").prop("checked")
        },
        success: function(data) {
            if (data["ok"] == true) {
              console.log("operation ok. ");
              window.location.href="/?scrollto="+window.currentediting
            } else {
              notify(data["error"], "info")
            }
        }
    });
};

function deletepost(){
        $.ajax({

        type: 'POST',
        url: '/deletepost/',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            postid: window.currentediting,
        },
        success: function(data) {
            if (data["ok"] == true) {
              console.log("operation ok. ");
              location.reload();
            } else {
              notify(data["error"], "info")
            }
        }
    })
};

function deletecomment() {
  $.ajax({
    type:'POST',
    url: '/deletecomment/',
    data: {
      csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
      commentid: window.currenteditingcomment
    },
    success: function(data){
      if (data["ok"] == true) {
        //maybe scroll to the post affected? implement it later i guess. 
        window.location.href="/"
      } else {
        notify(data["error"], "info")
      }
    }
  })

}