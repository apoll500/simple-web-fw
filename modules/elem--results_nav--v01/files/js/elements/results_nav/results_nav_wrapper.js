
main_loader.load("js/elements/results_nav/results_nav_simple.js");
main_loader.load("js/elements/results_nav/results_nav_plain.js");
main_loader.load("js/http/common.js");

function results_nav_wrapper(pdiv,style,adiv,formular)
{
    this.object;
    
    switch(style)
    {
        case "simple":
            this.object=new results_nav_simple(pdiv,adiv,formular);
            break;
        case "plain":
            this.object=new results_nav_plain(pdiv,adiv,formular);
            break;
        case "inv":
            this.object=new results_nav_plain(pdiv,adiv,formular);
            break;
        default:
            this.object=new results_nav_plain(pdiv,adiv,formular);
    }
    
//public:
    this.destroy=function()
    {
        this.object.destroy();
    }
    this.reset=function()
    {
    }
    this.load=function(url)
    {
        httpGetAsync(url,receive_text,this.object);
    }
    this.load2=function(content,layout)
    {
        this.object.preset();
        
        if(content.charAt(0)=='_')
        {
            httpGetAsync(baseurl+"php/"+content.substr(1)+".php",receive_text,this);
        }
        else
        {
            httpGetAsync(baseurl+"content/"+lang+"/"+content+".txt",receive_text,this);
        }
    }
    this.setup=function(s)
    {
        this.object.setup(s);
        if(this.postloadfunction)this.postloadfunction(this.postloadfunction_elem,this.postloadfunction_data);
    }
    this.setup_data=function(data,id)
    {
        //data.print();
        this.object.setup_data(data,id);
    }
}

function results_nav_goto_item(i,formular)
{
    if(isNaN(i))
    {
        new sysmod_box("Error:<br>Your input could not be evaluated to an integer.<br>Please input a valid page number.");
        return;
    }
    document.forms[formular].startindex.value=i;
    document.forms[formular].submit();
}
function results_nav_hover_element(element)
{
    document.getElementById(element).style.backgroundColor="#EEEEEE";
}
function results_nav_reset_element(element)
{
    document.getElementById(element).style.backgroundColor="#DDDDDD";
}

main_loader.ready();
