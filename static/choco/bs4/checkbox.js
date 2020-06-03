choco.bare.initNamespace("choco.bs4.checkbox");

choco.bs4.checkbox = class {
    /*
     * @param label: the label of the bs4 checkbox
     */
    constructor(label) {
        this.el = redom.el("choco-bs4-checkbox");
        this.label = label;
        this.elementId_ = choco.random.randId();
    }
    update() {
        // clear the container
        $(this.el).remove();
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
        // this.inputContainer.appendChild(this.inputElement);
        // this.inputContainer.appendChild(this.inputLabel);

        this.el.appendChild(this.inputContainer);
    }
}