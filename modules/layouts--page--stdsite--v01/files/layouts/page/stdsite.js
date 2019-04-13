
//element globals
var e_topbar=null;
var e_navbar=null;
var e_foot=null;

//loading elements
main_loader.load("js/elements/flapbox/flapbox_wrapper.js");
main_loader.load("js/elements/flapbox/flapbox_simple.css");
main_loader.load("js/elements/flapbox/flapbox_plain.css");

main_loader.load("js/elements/sysmod_box/sysmod_box.js");
main_loader.load("js/elements/sysmod_box/sysmod_box.css");

main_loader.load("js/elements/navbar/navbar_wrapper.js");
main_loader.load("js/elements/navbar/simple_navbar"+css_substyle+".css");

main_loader.load("js/elements/foot/foot_wrapper.js");
main_loader.load("js/elements/foot/foot_simple"+css_substyle+".css");

main_loader.load("js/elements/main/main_wrapper.js");
main_loader.load("js/elements/main/main_simple"+css_substyle+".css");

main_loader.load("js/elements/loginbar/loginbar_wrapper.js");
main_loader.load("js/elements/loginbar/loginbar_simple_bw.css");

//loading element layouts
main_loader.load("layouts/elem/main/setup.js");

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

    if(!e_topbar)
    {
        e_topbar=new loginbar_wrapper(m,gstyle);
    }
    
    if(!e_navbar)
    {
        e_navbar=new navbar_wrapper(m,gstyle);
        e_navbar.load("content/"+lang+"/navbar.txt");
    }
    else
    {
        //Markierung setzen.
        e_navbar.load("content/"+lang+"/navbar.txt");
    }
    
    if(!e_mbox)
    {
        e_mbox=new main_wrapper(m,gstyle);
        domel["main"]=e_mbox;
    }
    
    /*
    if(page.substr(0,4)=="mod_")
    {
        var s=(page.substr(4)+"_").split('_');
        s[1]=page.substr(s[0].length+5);
        if(typeof window["mods_"+s[0]+"_load_clean"] == 'function')window["mods_"+s[0]+"_load_clean"](s[1],s[2]);
        else console.log("Module "+s[0]+" is missing.");
    }
    */
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
        e_foot.load("content/"+lang+"/foot.txt");
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
    if(e_topbar)e_topbar.destroy();
    if(e_navbar)e_navbar.destroy();
    if(e_mbox)e_mbox.destroy();
    if(e_foot)e_foot.destroy();
    e_topbar=null;
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