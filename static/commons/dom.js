goog.provide("com.info.Dom");
// simple script to generate dom elements.
com.info.Dom = function(specs){

    if ("text" in specs) {
        // this is a text node.
        let text = document.createTextNode(specs["text"]);
        return text;
    }
    if ("tag" in specs) {
        // more efficient way to do it?
        // i don't know.
        specs["attrs"] = specs["attrs"] ? specs["attrs"] : {};
        specs["children"] = specs["children"] ? specs["children"] : [];
        specs["styles"] = specs["styles"] ? specs["styles"] : {};
        specs["classes"] = specs["classes"] ? specs["classes"] : [];
        // this is a html node.
        // hoisting is bad!!!!!!!
        let node = document.createElement(specs["tag"]);
        // set attrs
        for (attr in specs["attrs"]) {
            node.setAttribute(attr, specs["attrs"][attr]);
        }
        for (style in specs["styles"]) {
            node.style[style] = specs["styles"][style];
        }
        for (child in specs["children"]) {
            let childnode = com.info.Dom(specs["children"][child]);
            node.appendChild(childnode);
        }
        return node;

    }
}
