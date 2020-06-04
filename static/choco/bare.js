choco = {};
choco.bare = {};
/* save the choco library
 * 's path it is currently running from. 
 * maybe a better way to do this? I don't know. */
var path = document.currentScript.src.toString();
choco.loadedPath_ = path.substring(0, path.lastIndexOf("/") + 1); // +1 to insure the last '/' is included in. //
/* 
 * keep a working list of the current modules
 * that are imported, to prevent
 * them from being loaded again. 
 */
choco.loadedModules_ = ['base'];


/*
 * @param namespace: the namespace to init
 */
choco.bare.initNamespace = function(namespace) {
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

/* 
 * BLANK_FUNC: a quick and handy blank function for callbacks. 
 * does nothing. 
 */
choco.BLANK_FUNC = function() {}

/*
 * @param url(string): what url to load
 * @param onloadfunc(function): callback after script has loaded. 
 * @param location(string): where to put the script tag
 * @return: appended script tag. 
 * this function prepares a <script> tag with .src @param url and appends it to the location of @param location. 
 */
choco.bare.loadJS = function(url, onloadfunc, location){
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = onloadfunc;
    scriptTag.onreadystatechange = onloadfunc;
    location.appendChild(scriptTag);
    return scriptTag;
};

/*
 * @param module(string): module name
 * loads a module
 */
choco.loadModule = function(module, callback) {
    if (typeof callback == "undefined") {
        callback = choco.BLANK_FUNC;
    }
    if (module in choco.loadedModules_ == false) {
        choco.bare.loadJS(choco.loadedPath_ + module + ".js", callback, document.body);
        choco.loadedModules_.push(module);
    }
}