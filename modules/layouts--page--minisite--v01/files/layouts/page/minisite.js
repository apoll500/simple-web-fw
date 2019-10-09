
//element globals
var e_navbar=null;
var e_foot=null;

//loading elements
main_loader.load("js/elements/sysmod_box/sysmod_box.js");
main_loader.load("js/elements/sysmod_box/sysmod_box.css");

main_loader.load("js/elements/navbar/navbar_wrapper.js");
main_loader.load("js/elements/navbar/simple_navbar"+css_substyle+".css");

main_loader.load("js/elements/foot/foot_wrapper.js");
main_loader.load("js/elements/foot/foot_simple"+css_substyle+".css");

main_loader.load("js/elements/main/main_wrapper.js");
main_loader.load("js/elements/main/main_simple"+css_substyle+".css");

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

function __u_load_page(page)
{
    var m=document.getElementById("MAIN");
    //m.innerHTML="";

    if(!e_navbar)
    {
        e_navbar=new navbar_wrapper(m,gstyle);
        e_navbar.load("content/"+lang+"/"+site+"/navbar.txt");
    }
    else
    {
        //Markierung setzen.
        e_navbar.load("content/"+lang+"/"+site+"/navbar.txt");
    }
    
    if(!e_mbox)
    {
        e_mbox=new main_wrapper(m,gstyle);
        domel["main"]=e_mbox;
    }
    
    if(load_module_from_page(page))
    {
    }
    else if(page.substr(0,5)=="blog_")
    {
        if(typeof window["mods_blog_load_clean"] == 'function')window["mods_blog_load_clean"]("load",page);
        else e_mbox.load2(page,"left");
    }
    else
    {
        if(gstyle=="simple")
        {
            if(page=="home")e_mbox.load2(page,"center");
            else if(page=="blog")e_mbox.load2(page,"multicol2c");
            else e_mbox.load2(page,"left");
        }
        else if(gstyle=="plain" || gstyle=="inv")
        {
            e_mbox.load2(page,"null");
        }
    }
     
    if(!e_foot)
    {
        e_foot=new foot_wrapper(m,gstyle);
        e_foot.load("content/"+lang+"/"+site+"/foot.txt");
    }
}

function __u_chstyle(old_style,new_style)
{
    var m=document.getElementById("MAIN");
    if(new_style=="simple")
    {
        document.body.style.backgroundColor="#000000";
        document.body.style.color="#FFFFFF";
        m.style.padding="0px";
        m.style.backgroundColor="#000000";
    }
    else if(new_style=="inv")
    {
        document.body.style.backgroundColor="#000000";
        document.body.style.color="#FFFFFF";
        m.style.padding="20px";
        m.style.backgroundColor="#000000";
    }
    else if(new_style=="plain")
    {
        document.body.style.backgroundColor="#FFFFFF";
        document.body.style.color="#000000";
        m.style.padding="20px";
        m.style.backgroundColor="#FFFFFF";
    }
    if(e_navbar)e_navbar.destroy();
    if(e_mbox)e_mbox.destroy();
    if(e_foot)e_foot.destroy();
    e_navbar=null;
    e_mbox=null;
    e_foot=null;
}

function __u_setlang(newLang)
{
    if(e_foot)e_foot.destroy();
    e_foot=null;
}

main_loader.ready();
