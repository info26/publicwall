bare = {};
bare.initNamespace = function(namespace) {
    var parts = namespace.split(".");
    // get base part. 
    var base = parts[0];
    if (eval("typeof " + base) != "undefined") {
        // avoid clobbering it
    } else {
        eval(base + " = {}");
    }
    curObject = eval(base);
    var part; 
    parts = parts.slice(1);
    for (part in parts) {
        curObject[parts[part]] = curObject[parts[part]] || {};
        curObject = curObject[parts[part]];
    }
}