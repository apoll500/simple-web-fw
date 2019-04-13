
main_loader.load("js/elements/main/main_simple.js");
main_loader.load("js/elements/main/main_plain.js");
main_loader.load("js/http/common.js");

function main_wrapper(pdiv,style)
{
    this.object;
    this.layout="left";
    this.vars_context=new file_storage();
    
    this.content_token="";
    this.name="main";

    switch(style)
    {
        case "simple":
            this.object=new main_simple(pdiv);
            break;
        case "plain":
            this.object=new main_plain(pdiv);
            break;
        case "inv":
            this.object=new main_plain(pdiv);
            break;
        default:
            this.object=new main_plain(pdiv);
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
    this.load2=function(content,layout)
    {
        this.object.layout=layout;
        
        this.object.preset();

        if(content.charAt(0)=='_')
        {
            //httpGetAsync(baseurl+"php/"+content.substr(1)+".php",receive_text,this);
            httpGetAsync("php/"+content.substr(1)+".php",receive_text,this);
        }
        else
        {
            //httpGetAsync(baseurl+"content/"+lang+"/"+content+".txt",receive_text,this);
            httpGetAsync("content/"+lang+"/"+content+".txt",receive_text,this);
        }
    }
    this.setup=function(s)
    {
        this.object.setup(s);
        window.scrollTo(0,0);
    }
    this.scroll=function(x,y)
    {
        window.scrollTo(x,y);
        //console.log("scroll("+x+","+y+")");
    }
}

main_loader.ready();
