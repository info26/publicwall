
// ------------------------------------
choco.bare.initNamespace("choco.dom");
// simple script to generate dom elements.
choco.dom.domGen = function(specs){

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
        // this is a html node.
        // hoisting is bad!!!!!!!
        var node = document.createElement(specs["tag"]);
        // set attrs
        for (attr in specs["attrs"]) {
            node.setAttribute(attr, specs["attrs"][attr]);
        }
        for (style in specs["styles"]) {
            node.style[style] = specs["styles"][style];
        }
        for (child in specs["children"]) {
            var childnode = choco.dom.domGen(specs["children"][child]);
            node.appendChild(childnode);
        }
        return node;

    }
}

// ------------------------------------
/*
 * @param children(array): list of children to append to @param element. 
 * @param element(HTMLElement): what element to append the @children to
 */
choco.dom.massAppend = function(children, element) {
    for (child in children) {
        element.appendChild(children[child]);
    }
}
/*
 * @param element: which element to empty.
 */
choco.dom.emptyElement = function(element) {
    element.innerHTML = "";
}