
main_loader.load("js/elements/loginbar/loginbar_simple.js");
main_loader.load("js/elements/loginbar/loginbar_plain.js");
main_loader.load("js/http/common.js");

var fadmin_topbar_username;
var fadmin_topbar_userpass;

function loginbar_wrapper(pdiv,style)
{
    this.object;
    
    switch(style)
    {
        case "simple":
            this.object=new loginbar_simple(pdiv);
            break;
        case "plain":
            this.object=new loginbar_plain(pdiv);
            break;
        case "inv":
            this.object=new loginbar_plain(pdiv);
            break;
        default:
            this.object=new loginbar_plain(pdiv);
    }
    
//public:
    this.destroy=function()
    {
        this.object.destroy();
    }
	this.onEvent=function(type,evt)
    {
        switch(type)
        {
            case "login":
                alert(evt);
                break;
        }
    }
    this.load=function(url)
    {
        this.object.preset();
        httpGetSetup(url,this.object);
    }
    this.reset=function()
    {
        this.load("sys/index.php?area=user&comm=user_logstat_name");
    }
    this.reset();
}

function fadmin_topbar_login()
{
    fadmin_topbar_username=document.fadmin_topbar_form.username.value;
    fadmin_topbar_userpass=document.fadmin_topbar_form.userpass.value;
    main_handler.onClick("login||user","area=public&comm=user_login&username="+btoa(fadmin_topbar_username)+"&userpass="+btoa(fadmin_topbar_userpass)+"&mode=cookie");
}

function fadmin_topbar_logout()
{
    fadmin_topbar_username="";
    fadmin_topbar_userpass="";
    main_handler.onClick("logout||user","area=user&comm=user_logout");
}


main_loader.ready();
