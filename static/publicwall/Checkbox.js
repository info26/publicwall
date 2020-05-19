goog.provide("com.info.Checkbox");

com.info.Checkbox = function(specs) {
    this.id = specs["id"];
    this.text = specs["text"];
}

com.info.Checkbox.prototype.getDom = function() {
    
    box = document.createElement("div");
    box.setAttribute("class", "custom-control custom-checkbox");
    boxInput = document.createElement("input");
    boxInput.setAttribute("type", "checkbox");
    boxInput.setAttribute("class", "custom-control-input");
    boxInput.setAttribute("id", this.id);
    boxPostLabel = document.createElement("label");
    boxPostLabel.setAttribute("class", "custom-control-label");
    boxPostLabel.setAttribute("for", this.id);
    boxPostLabelText = document.createTextNode(this.text);
    boxPostLabel.appendChild(boxPostLabelText);
    box.appendChild(boxInput);
    box.appendChild(boxPostLabel);


    this.domElement = box;

    return box;
}
