
choco.bare.initNamespace("choco.random");

/*
 * @returns suitable element id starting with "id-"
 */
choco.random.randId = function() {
    // hopefully this isn't too slow. 
    return "id-" + Math.floor(Date.now()*Math.random()).toString(16);
}
/*
 * @param min: the minimum boundary of the @return. 
 * @param max: the maximum boundary of the @return.
 * @return: @param min <= @return > @param max 
 */
choco.random.randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}