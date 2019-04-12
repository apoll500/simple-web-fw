
main_loader.load("js/elements/foot/foot_simple.js");
main_loader.load("js/elements/foot/foot_plain.js");
main_loader.load("js/http/common.js");

function foot_wrapper(pdiv,style)
{
    this.object;
    
    switch(style)
    {
        case "simple":
            this.object=new foot_simple(pdiv);
            break;
        case "plain":
            this.object=new foot_plain(pdiv);
            break;
        case "inv":
            this.object=new foot_plain(pdiv);
            break;
        default:
            this.object=new foot_plain(pdiv);
    }
    
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
