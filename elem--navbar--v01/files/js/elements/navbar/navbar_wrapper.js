
main_loader.load("js/elements/navbar/simple_navbar.js");
main_loader.load("js/elements/navbar/plain_navbar.js");
main_loader.load("js/http/common.js");

function navbar_wrapper(pdiv,style)
{
    this.object;
    
    switch(style)
    {
        case "simple":
            this.object=new simple_navbar(pdiv);
            break;
        case "plain":
            this.object=new plain_navbar(pdiv);
            break;
        case "inv":
            this.object=new plain_navbar(pdiv);
            break;
        default:
            this.object=new plain_navbar(pdiv);
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
