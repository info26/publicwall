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
                postele = document.createElement("div")
                posttext = document.createTextNode(data["posts"][post]["content"]);
                postdate = document.createElement("span");
                postdatetext = document.createTextNode(data["posts"][post]["date"])
                postdate.appendChild(postdatetext)
                postdate.setAttribute("class", "float-right")
                postauthor = document.createElement("span");
                postauthortext = document.createTextNode(data["posts"][post]["user"])
                postauthor.setAttribute("class", "float-right")
                postauthor.appendChild(postauthortext);
                postele.appendChild(posttext);
                postele.appendChild(postdate);
                postele.appendChild(br);
                postele.appendChild(postauthor);
                postele.appendChild(hr)
                $("#content").append(postele);
            }
        },
    });
});