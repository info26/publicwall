/*
The following code is covered under the MIT license

Copyright 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


*/

// shows the navbar for logged out users. 
$("#nav-logged-out").show();
// marks the login nav item as active. 
$("#login-nav-item").addClass("active");


$("#login-form").submit(function() {
    $.ajax({
        type: "POST",
        // all AJAX calls on a page will go to that page's url, with an "action" parameter. 1
        url: "",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function(data) {
            if (data["correct"] == true) {
                // redirect user to index. 
                location.href = "/?loggedin=1";
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

