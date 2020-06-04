choco.bare.initNamespace("choco.bs4.checkbox");


// required for id-ing
choco.loadModule("random");
// required for rendering. 
choco.loadModule("dom");

choco.bs4.checkbox = class {
    /*
     * @param label: the label of the bs4 checkbox
     */
    constructor(label, disabled) {
        this.label = label;
        this.disabled = disabled;


        this.el = redom.el("choco-bs4-checkbox");
        this.elementId_ = choco.random.randId();
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
     * @param: specifies if this checkbox will be checked or not
     */
    setChecked(checked) {
        this.inputElement.checked = checked;
    }
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
        // clear the container
        choco.dom.emptyElement(this.el);
        // build the checkbox. 
        this.inputContainer = choco.dom.domGen({
            "tag": "div",
            "attrs": {
                "class": "custom-control custom-checkbox",
            },
        });
        this.inputElement = choco.dom.domGen({
            "tag": "input",
            "attrs": {
                "type": "checkbox",
                "class": "custom-control-input",
                "id": this.elementId_
            }
        });
        if (this.disabled) {
            this.inputElement.setAttribute("disabled", "");
        } else {
            this.inputElement.removeAttribute("disabled");
        }
        this.inputLabel = choco.dom.domGen({
            "tag": "label",
            "attrs": {
                "class": "custom-control-label",
                "for": this.elementId_
            },
            "children": [
                {"text": this.label}
            ]
        });

        choco.dom.massAppend(
            [this.inputElement, this.inputLabel], 
            this.inputContainer
        );

        this.el.appendChild(this.inputContainer);
    }
}