/* The following code is covered under the MIT license */ 
/*
Copyright 2020

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// Hey! Thanks for looking at my code! This is a 100% Javascript renderer for the public wall. 
// On the older version, the posts were rendered using Django templates, but now they are rendered
// using this javascript renderer. 


$(function(){
    // Get posts from server. 
    $.ajax({
        type: "POST",
        url: "",
        data: {
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            action: "getposts"
        },
        success: function(data) {

            for (post in data["posts"]) {
                br = document.createElement("br")
                br.setAttribute("class", "float-right")
                hr = document.createElement("hr")

                // Main post element
                // -----------------
                postele = document.createElement("div")
                // -----------------


                // The content of the post:
                // ------------------------
                posttext = document.createElement("span")
                posttexttext = document.createTextNode(data["posts"][post]["content"]);
                posttext.appendChild(posttexttext);
                posttext.setAttribute("id", "posttext" + data["posts"][post]["id"])




                // The date of the post
                // --------------------
                postdate = document.createElement("span");
                postdatetext = document.createTextNode(data["posts"][post]["date"])
                postdate.appendChild(postdatetext)
                postdate.setAttribute("id", "postdate" + data["posts"][post]["id"])
                postdate.setAttribute("class", "float-right")



                // The author of the post
                // ----------------------
                postauthor = document.createElement("span");
                postauthortext = document.createTextNode(data["posts"][post]["user"])
                postauthor.setAttribute("class", "float-right")
                postauthor.appendChild(postauthortext);
                postauthor.setAttribute("id", "postauthor" + data["posts"][post]["id"])


                // The link for the comment. <a>Comments [1]</a>
                // ---------------------------------------------
                postcommentlink = document.createElement("a")
                postcommenttext = document.createTextNode("Comments[" + data["posts"][post]["comments"] + "]")
                postcommentlink.appendChild(postcommenttext);
                postcommentlink.setAttribute("id", "postcomment" + data["posts"][post]["id"])
                postcommentlink.setAttribute("class", "link")


                // Appends everything
                postele.appendChild(posttext);
                postele.appendChild(postdate);
                postele.appendChild(br);
                postele.appendChild(postauthor);
                postele.appendChild(postcommentlink);
                postele.appendChild(hr)
                
                // Appends the prepared element into the DOM tree. 
                $("#content").append(postele);
            }
        },
    });
});