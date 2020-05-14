/* Url params */
window.urlParams = new URLSearchParams(window.location.search);





class NOTICE_TYPES {
    static NOTICE =  "notice";
    static INFO = "info";
    static SUCCESS = "success";
    static ERROR = "error";
}

class settings {
    /* Date format */
    static DATE_FORMAT = "YYYYMMDD hh:mm:ssa";
    /* Speed of animations */
    static TOGGLE_SPEED = 250;
    static COMMENT_PLACEHOLDER = "Post a new comment...";
    static POST_PLACEHOLDER = "Make a new post...";
    static CREATE_COMMENT_TEXT = "Submit";
    static POST_LOCKED_PLACEHOLDER = "This post is locked...";
    static POST_POST_BUTTON_TEXT = "Submit";
    static POST_DISABLED_PLACEHOLDER = "You are not allowed to post. ";

    static NO_POSTS_ALERT_TEXT = "wow, such empty. ";

    static CANT_POST_POPOVER_CONTENT = "Please contact an administrator to give you permissions to post. ";
    static CANT_POST_POPOVER_TITLE = "You have no permission";

    static CANT_COMMENT_TEXT = "No permission to comment";


    static POST_LOCKED_POPOVER_TITLE = "Post is locked";
    static POST_LOCKED_POPOVER_CONTENT = "Please contact an administrator to unlock this post. ";
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
