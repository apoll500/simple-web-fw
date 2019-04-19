
//element globals
var e_topbar=null;

//loading elements
main_loader.load("js/elements/modern_menu/modern_menu_wrapper.js");
main_loader.load("js/elements/modern_menu/modern_menu.css");
main_loader.load("js/elements/modern_menu/modern_menu_plain.css");

main_loader.load("js/elements/fmain/fmain_wrapper.js");
main_loader.load("js/elements/fmain/fmain_simple.css");

main_loader.load("js/elements/fadmin_topbar/fadmin_topbar_wrapper.js");
main_loader.load("js/elements/fadmin_topbar/fadmin_topbar_simple.css");

//loading element layouts
main_loader.load("layouts/elem/main/setup.js");

//(1)--------------------
function __update()
{
    if(gstyle=="inv")
    {
        var links=document.getElementsByTagName("a");
        for(var i=0;i<links.length;i++)
        {
            if(links[i].href)
            {
                links[i].style.color="#FFFF88";  
            }
        }
        var spans=document.getElementsByTagName("span");
        for(var i=0;i<spans.length;i++)
        {
            spans[i].style.backgroundColor="#000000";  
        }
        var codes=document.getElementsByTagName("code");
        for(var i=0;i<codes.length;i++)
        {
            codes[i].style.backgroundColor="#000000";  
        }
        var divs=document.getElementsByTagName("div");
        for(var i=0;i<divs.length;i++)
        {
            if(divs[i].id!="MAIN" && divs[i].id.substr(0,4)!="fix_")
            {
                divs[i].style.backgroundColor="#000000";  
            }
        }
    }
}
//(2)--------------------
function __u_load_page(page)
{
    var m=document.getElementById("MAIN");
    
    if(!e_topbar)
    {
        e_topbar=new fadmin_topbar_wrapper(m,gstyle);
    }
    
    if(!menu)
    {
        var menuwrap=new modern_menu_wrapper(m,gstyle);
        menu=menuwrap.object;
        menuwrap.load("menu");
    }
    
    if(!e_mbox)
    {
        //console.log("set main");
        e_mbox=new fmain_wrapper(menu,m,gstyle);
        domel["main"]=e_mbox;
    }
    
    //e_mbox.load2(page,"center");
    if(!load_module_from_page(page))e_mbox.load2(page,"center");
}
//(3)--------------------
function __u_chstyle(old_style,new_style)
{
    var m=document.getElementById("MAIN");
    if(new_style=="simple")
    {
        document.body.style.backgroundColor="#FFFFFF";
        document.body.style.color="#000000";
        m.style.padding="0px";
        //m.style.backgroundColor="#000000";
    }
    else if(new_style=="inv")
    {
        document.body.style.backgroundColor="#000000";
        document.body.style.color="#FFFFFF";
        m.style.padding="20px";
        //m.style.backgroundColor="#000000";
    }
    else if(new_style=="plain")
    {
        document.body.style.backgroundColor="#FFFFFF";
        document.body.style.color="#000000";
        m.style.padding="20px";
        //m.style.backgroundColor="#FFFFFF";
    }
    if(e_topbar)e_topbar.destroy();
    //if(e_navbar)e_navbar.destroy();
    if(e_mbox)e_mbox.destroy();
    //if(e_foot)e_foot.destroy();
    e_topbar=null;
    //e_navbar=null;
    e_mbox=null;
    //e_foot=null;
}
//(4)--------------------
function __u_setlang(newLang)
{
    //if(e_foot)e_foot.destroy();
    //e_foot=null;
}

main_loader.ready();
