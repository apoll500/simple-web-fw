
main_loader.load("js/elements/flapbox/flapbox.js");
main_loader.load("js/elements/flapbox/flapbox_plain.js");
main_loader.load("js/http/common.js");

function flapbox_wrapper(pdiv,minh,maxh,titletext,style)
{
    this.object;
    
    switch(style)
    {
        case "simple":
            this.object=new flapbox(pdiv,minh,maxh,titletext);
            break;
        case "plain":
            this.object=new flapbox_plain(pdiv,titletext);
            break;
        case "inv":
            this.object=new flapbox_plain(pdiv,titletext);
            break;
        default:
            this.object=new flapbox_plain(pdiv,titletext);
    }
    
//public:
    this.destroy=function()
    {
        this.object.destroy();
    }
    this.load=function(url)
    {
        this.object.load(url);
    }
}

main_loader.ready();
