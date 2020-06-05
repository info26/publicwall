choco.loadModule("dom");



/*
 * class for managing tooltips.
 * (bootstrap)
 * (bootstrap) reqs (popper)
 * (bootstrap) also reqs (jquery)
 * jquery, popper, and bootstrap's js is needed for this class to work under the bootstrap renderer. 
 * ABILITY TO CUSTOMIZE RENDERER COMING SOON(TM)!
 */

choco.bare.initNamespace("choco.ui.tooltip");

choco.ui.tooltip = class {
    /*
     * we're not gonna allow any initial values to be set
     * as the element may not be rendered yet, and we don't want to set undefined
     * values. 
     * HOWEVER, we should set the default values, so it at least can work without
     * the dev setting ANY values. that -- is a good development principle
     * it's good to make something VERY customizable, 
     * but not TOO customizable that lots of things need to be configured. 
     */
    constructor() {
        /* see above */
        this.condition = function(a, b) {return true;} 
        // default function. we need 'a' and 'b' to support the two variables being passed in,
        // even though we don't need them, javascript will complain.  


        this.enabled = true; // default value
        // we can't assume the parent, so don't set this as default. 
        // we can't assume the text either. 
    }
    
    /*
     * marks which parent this
     * tooltip manager is serving.
     * so -- it can be passed to the
     * condition function.
    */
    setParent(parent) {
        this.parent = parent;
        this.update();
    }
    getparent() {
        return this.parent;
    }
    /*
     * the container the tooltip
     * will appear
     */
    setContainer(container) {
        this.container = container; 
        this.update();
    }
    getContainer() {
        return this.container;
    }
    /*
     * text of tooltip 
     */
    setText(text) {
        this.text = text;
        this.update();
    }
    getText() {
        return this.text
    }
    /*
     * placement of tooltip. 
     */
    setPlacement(placement) {
        this.placement = placement;
        this.update();
    }
    getPlacement() {
        return this.placement;
    }

    /*
     * a function, of which determines 
     * when the tooltip shall appear. 
     * executes function like this: condition(this, this.conditionData);
     */
    setCondition(condition) {
        this.condition = condition;
        this.update();
    }
    getCondition(condition) {
        return this.condition;
    }
    /*
     * some data to be passed to the condition function. 
     */
    setConditionData(conditionData) {
        this.conditionData = conditionData;
        this.update(); // we should update because, maybe the function returns something different with this new knowledge. 
    }
    getConditionData() {
        return this.conditionData;
    }
    
    /* 
     * manages if this is enabled
     * this overrides the condition. 
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        this.update();
    }
    isEnabled() {
        return this.enabled;
    }
    /*
     * an internal function to enumerate whether
     * tooltip should be shown or not! 
     */
    shouldShow_() {
        // remember, the enabled attr overrides the condition, so check that first. 
        if (this.enabled == false) {
            return false;
        }
        return this.condition(this, this.conditionData);
    }


    update() {
        $(this.container).tooltip('dispose'); // needed because the tooltip won't PROPERLY listen to my instructions. 
        if (this.shouldShow_()) {
            $(this.container).tooltip(
                {
                    container: 'body',
                    title: this.text,
                    placement: this.placement,
                }
            );
            $(this.container).tooltip('enable'); //just in case it was disabled. 
        } else {
            $(this.container).tooltip('disable');
        }
    }





}