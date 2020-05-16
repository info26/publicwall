/* apply active class to 'home' tab. */
$("#profile-nav-item").addClass("active")
/* Show logged in navbar */
$("#nav-logged-in").show();
function saveChanges() {
    /* Gets called when user hits save changes. */
    $.ajax({
        type: 'POST',
        url: '',
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            username: $("#username").val(),
            description: $("#description").val(),
            timezone: $("#timezone").val(),
        },
        success: function(data) {
            if (!data["ok"]) {
                commons.notify({
                    type: NOTICE_TYPES.ERROR,
                    title: "Uh oh!",
                    msg: "That username has already been taken!",
                    delay: 5000,
                })
                return;
            }
            commons.notify({
                type: NOTICE_TYPES.SUCCESS,
                title: "Success!",
                msg: "Your changes have been saved!",
                delay: 5000,
            })
        }
    });
}