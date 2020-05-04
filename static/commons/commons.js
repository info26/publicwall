class NOTICE_TYPES {
    static NOTICE =  "notice";
    static INFO = "info";
    static SUCCESS = "success";
    static ERROR = "error";
}

class settings {
    static DATE_FORMAT = "YYYYMMDD hh:mm:ssa";
    static TOGGLE_SPEED = 500;
}
class commons {
    static notify(specs){

        switch(specs["type"]) {
            case "notice":
                PNotify.notice({
                    title: specs["title"],
                    text: specs["msg"],
                    delay: specs["delay"]
                })
                break;
            case "info":
                PNotify.info({
                    title: specs["title"],
                    text: specs["msg"],
                    delay: specs["delay"]
                })
                break;
            case "success":
                PNotify.success({
                    title: specs["title"],
                    text: specs["msg"],
                    delay: specs["delay"]
                })
                break;
            case "error":
                PNotify.error({
                    title: specs["title"],
                    text: specs["msg"],
                    delay: specs["delay"]
                })
                break;
        }
    }
    static localizeTime(dateObject,tz){
        return moment.utc(dateObject).tz(tz);
    }
}
$(function(){
    // the following configures pnotify to use the material theme. 
    PNotify.defaults.styling = "material";
    PNotify.defaults.icons = "material";
    // Change PNotify to modeless mode. 
    PNotify.defaultStack.close(true);
    PNotify.defaultStack.maxOpen = Infinity;
    PNotify.defaultStack.modal = false;
})