goog.provide("com.info.dom");
/// more efficient dom creation! ///
com.info.dom = function(specs){
    
    if ("text" in specs) {
        // this is a text node. 
        let text = document.createTextNode(specs["text"]);
        return text;
    }
    if ("tag" in specs) {
        // fill in blanks
        if (!"attrs" in specs) {
            specs["attrs"] = {};
        }
        if (!"children" in specs) {
            specs["children"] = [];
        }
        // this is a html node. 
        let node = document.createElement(specs["tag"]);
        // set attrs
        for (attr in specs["attrs"]) {
            node.setAttribute(attr, specs["attrs"][attr]);
        }
        for (child in specs["children"]) {
            let childnode = com.info.dom(specs["children"][child]);
            node.appendChild(childnode);
        }
        return node;
        
    }
}