goog.provide("com.info.Comment");

com.info.Comment = function(specs) {
    this.content = specs["content"];
    this.id = specs["id"];
    this.author = specs["author"];
    this.authorid = specs['authorid'];
    this.date = specs["date"];
    this.postId = specs["postId"];
}


com.info.Comment.prototype.getDom = function() {
    commentBox = document.createElement("div");
    br = document.createElement("br")
    hr = document.createElement("hr")
    // Text of comment
    // ---------------
    commenttext = document.createElement("span")
    commenttextnode = document.createTextNode(this.content);
    commenttext.setAttribute("id", "commenttext" + this.id)
    commenttext.appendChild(commenttextnode);



    // Date of comment
    commentdate = document.createElement("span");
    localized = commons.localizeTime(this.date, window.tz);
    commentdatetext = document.createTextNode(localized.format(settings.DATE_FORMAT));
    commentdate.setAttribute("id", "commentdate" + this.id);
    commentdate.setAttribute("class", "grey float-right")
    commentdate.appendChild(commentdatetext)


    // Author of comment
    commentauthor = document.createElement("span");
    commentauthornode = document.createTextNode(this.author);
    // console.log(this);
    commentauthor.setAttribute("id", "commentauthor" + this.id);
    commentauthor.setAttribute("class", "grey float-right");
    commentauthor.setAttribute("onclick", "showProfile(" + this.authorid + ")");
    commentauthor.appendChild(commentauthornode);

    // append everything
    commentBox.appendChild(commenttext);
    commentBox.appendChild(commentdate);
    commentBox.appendChild(br);
    commentBox.appendChild(commentauthor);
    commentBox.appendChild(hr);




    return commentBox;
}