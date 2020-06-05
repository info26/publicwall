choco.bare.initNamespace("choco.ui.checkbox");


// required for id-ing
choco.loadModule("random");
// required for rendering. 
choco.loadModule("dom");

choco.ui.checkbox = class {
    /*
     * @param label: the label of the bs4 checkbox
     */
    constructor(label, disabled, renderer) {
        this.label = label;
        this.disabled = disabled;
        this.renderer = renderer;


        this.el = redom.el("choco-bs4-checkbox");
        this.elementId_ = choco.random.randId();
        this.tooltip = new choco.ui.tooltip(); // creates a tooltip manager for you? isn't that nice?
        this.tooltip.setParent(this);
        this.tooltip.setConditionData(this);
        // the default settings for if the tooltip should show is if this element is disabled. 
        // this can be changed by program if needed. 
        this.tooltip.setCondition(
            function(tooltipMan, extraData) {
                return extraData.enabled == false;
            }
        );
        

    }
    /*
     * @param label: the new label of the bs4 checkbox. 
     * also "refreshes" the checkbox. 
     */
    setLabel(label) {
        this.label = label;
        this.update();
    }
    /*
     * @param disabled: set if this checkbox is disabled or not
     * also "refreshes" the checkbox.
     */
    setDisabled(disabled) {
        this.disabled = disabled;
        this.update();
    }
    /*
     * @param checked: specifies if this checkbox will be checked or not
     */
    setChecked(checked) {
        this.inputElement.checked = checked;
    }


    // --------------------------------------------


    /*
     * @return: the current label text.
     */
    getLabel() {
        return this.label;
    }
    /*
     * @return: if this checkbox is disabled or not. 
     */
    isDisabled() {
        return this.disabled;
    }
    /*
     * @return: if this checkbox is checked or not
     */
    isChecked() {
        return this.inputElement.checked;
    }

    /* refresh function */
    update() {
        choco.dom.emptyElement(this.el);

        var updatedElement = this.renderer(this);

        this.el.appendChild(updatedElement);

        // init the tooltip
        this.tooltip.setContainer(this.inputContainer);
    }
}



choco.bare.initNamespace("choco.ui.checkbox.renderers");

/*
 * renders a bootstrap checkbox
 */
choco.ui.checkbox.renderers.Bootstrap = function(checkbox) {
    // build the checkbox. 


    checkbox.inputContainer = choco.dom.domGen({
        "tag": "div",
        "attrs": {
            "class": "custom-control custom-checkbox",

        },
        "styles": {
            "display": "inline-block"
        }
    });
    // UPDATE: checkbox tooltip management is done by the tooltip class. 

    checkbox.inputElement = choco.dom.domGen({
        "tag": "input",
        "attrs": {
            "type": "checkbox",
            "class": "custom-control-input",
            "id": checkbox.elementId_
        }
    });

    
    if (checkbox.disabled) {
        checkbox.inputElement.setAttribute("disabled", "");
    } else {
        checkbox.inputElement.removeAttribute("disabled");
    }


    checkbox.inputLabel = choco.dom.domGen({
        "tag": "label",
        "attrs": {
            "class": "custom-control-label",
            "for": checkbox.elementId_
        },
        "children": [
            {"text": checkbox.label}
        ]
    });

    choco.dom.massAppend(
        [checkbox.inputElement, checkbox.inputLabel], 
        checkbox.inputContainer
    );

    return checkbox.inputContainer;
}
