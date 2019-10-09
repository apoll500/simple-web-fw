
//element globals
var e_topbar=null;
var e_menu=null;
var e_pansel=null;//not jet implemented.

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

function __u_chstyle__check_colors(m)
{
    var col1=m.style.color;
    var col0=m.style.backgroundColor;
    if(gstyle=="inv")
    {
        m.style.color="#FFFFFF";
        m.style.backgroundColor="#000000";
    }
    else if(gstyle=="plain")
    {
        m.style.color="#000000";
        m.style.backgroundColor="#FFFFFF";
    }
    for(var i=0;i<m.children.length;i++)
    {
        __u_chstyle__check_colors(m.children[i]);
    }
}

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
function __u_load_menu(m,pname)
{
    var menu_name="menu";
    if(pname.substr(0,5)=="menu_")
    {
        if(e_menu)
        {
            e_menu.destroy();
            e_menu=null;
        }
        menu_name=pname;
    }
    if(!e_menu)
    {
        e_menu=new modern_menu_wrapper(m,gstyle);
        //--menu--
        menu=e_menu.object;
        e_menu.load(site+"/"+menu_name);
        if(e_mbox)
        {
            e_mbox.object.set_adiv(e_menu.object);
            return true;
        }
    }
    return false;
}
function __u_load_page(page)
{
    var m=document.getElementById("MAIN");
    
    var pname=page;
    var ppos=page.search("/");
    if(ppos!=-1)pname=page.substr(ppos+1);
    
    if(!e_topbar)e_topbar=new fadmin_topbar_wrapper(m,gstyle);
    
    if(__u_load_menu(m,pname))return;
    /*
    if(!menu)
    {
        e_menu=new modern_menu_wrapper(m,gstyle);
        menu=e_menu.object;
        e_menu.load(site+"/menu");
    }
    else
    {
        if(pname.substr(0,5)=="menu_")
        {
            e_menu.destroy();
            e_menu=new modern_menu_wrapper(m,gstyle);
            menu=e_menu.object;
            e_menu.load(site+"/"+pname);
            if(e_mbox)
            {
                e_mbox.object.set_adiv(menu);
                return;
            }
        }
    }
    */
    if(!e_mbox)
    {
        //console.log("set main");
        e_mbox=new fmain_wrapper(menu,m,gstyle);
        domel["main"]=e_mbox;
    }
    
    if(load_module_from_page(page))
    {
    }
    else if(pname.substr(0,5)=="blog_")
    {
        page="blog/"+pname;
        if(typeof window["mods_blog_load_clean"] == 'function')window["mods_blog_load_clean"]("load",page);
        else e_mbox.load2(page,"left");
    }
    else if(pname.substr(0,5)=="menu_")
    {
        e_mbox.load2(site+"/home","center");
    }
    else
    {
        e_mbox.load2(page,"center");
    }
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
