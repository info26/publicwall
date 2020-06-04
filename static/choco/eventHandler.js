choco.bare.initNamespace("choco.events");

choco.events.eventHandler = class {
    /*
     * creates a new event handler
     */
    constructor() {
        this.eventHooks = {};
    }
    /*
     * @param event: name of the event
     * @param callback: function to execute
     * @param data: data to be passed to function when execued. 
     * This class will execute the function like this: callback(eventdata, data);
     * note: eventdata contains data sent from the event caller. 
     */
    addEventListener(event, callback, data) {
        if (event in this.eventHooks == false) {
            this.eventHooks[event] = [];
        }
        this.eventHooks[event].push([callback, data]);
    }
    /* 
     * @param event: specifies the event name.
     * @param eventdata: extra information about the event. 
     * to be used by object's event handler. 
     */
    broadcastEvent(event, eventdata) {
        var i = 0;
        if (event in this.eventHooks) {
            for (i = 0; i < this.eventHooks[event].length; i++) {
                var func = this.eventHooks[event][i][0];
                func(eventdata, this.eventHooks[event][i][1]);
            }
        }
    }
}