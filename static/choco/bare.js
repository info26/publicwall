choco = {};
choco.bare = {};
choco.modules = {};
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
 * @param url(string): what url to load
 * @param onloadfunc(function): callback after script has loaded. 
 * @param location(string): where to put the script tag
 * @returns: appended script tag. 
 */
choco.bare.loadJS = function(url, onloadfunc, location){
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = onloadfunc;
    scriptTag.onreadystatechange = onloadfunc;
    location.appendChild(scriptTag);
    return scriptTag;
};

// NOTE: This function should not rely on any other functions! 
choco.loadModule = function(moduleId) {
    pack = moduleId.split(".");
    // remove the "choco" part. 
    pack = pack.slice(1);
    result = "";
    for (pac in pack) {
        result = result.concat(pack[pac]);
        if (pac == pack.length - 1) {
        } else {
            result = result.concat("/");
        }
    }
    choco.bare.loadJS(result + ".js", function(){}, document.body);
    

};