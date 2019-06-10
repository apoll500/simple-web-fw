
main_loader.load("js/elements/canvas/canvas_simple.js");
main_loader.load("js/elements/canvas/canvas_plain.js");
main_loader.load("js/http/common.js");
main_loader.load("js/webgd/main.js");

function canvas_wrapper(pdiv,style)
{
    this.object;
    
    switch(style)
    {
        case "simple":
            this.object=new canvas_simple(pdiv);
            break;
        case "plain":
            this.object=new canvas_plain(pdiv);
            break;
        case "inv":
            this.object=new canvas_plain(pdiv);
            break;
        default:
            this.object=new canvas_plain(pdiv);
    }
    this.object.preset();
    
//public:
    this.destroy=function()
    {
        this.object.destroy();
    }
    this.load=function(url)
    {
        httpGetAsync(url,receive_text,this.object);
    }
}

main_loader.ready();
