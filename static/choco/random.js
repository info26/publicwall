choco.bare.initNamespace("choco.random");

/*
 * @returns suitable element id starting with "id-"
 */

choco.random.randId = function() {
    // hopefully this isn't too slow. 
    return "id-" + Math.floor(Date.now()*Math.random()).toString(16);
}