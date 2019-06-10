
var pagecount=0;
var loadcount=0;
var gotopage="";

var main_elements=new Array();
var main_elements_counter=0;

var mousex=0;
var mousey=0;
var mousexs=0;
var mouseys=0;
var doc_mousex=0;
var doc_mousey=0;
var screenx=window.innerWidth;
var screeny=window.innerHeight;

var single_capture=null;
var selected_elem=null;
var selected_style=null;

document.addEventListener("mousemove",main_onMousemove);
document.addEventListener("mousedown",main_onMousedown);
document.addEventListener("mouseup",main_onMouseup);
document.addEventListener("click",main_onClick);
document.addEventListener("dblclick",main_onDblClick);
document.addEventListener("keydown",main_onKeydown);
document.addEventListener("keyup",main_onKeyup);
document.addEventListener("keypress",main_onKeypress);
document.addEventListener("scroll",main_onScroll);
document.addEventListener("wheel",main_onWheel);
window.addEventListener("resize",main_onResize);

function startup_check()
{
    for(var i=0;i<main_elements_counter;i++)
    {
        main_elements[i].onEvent("checkup","");
    }
}
function loading_error(err)
{
    new sysmod_box("Loading Error:<hr>"+err+"<br>Parts of this site are missing.<br>Please reload this page.<hr><img src='images/load.gif'><br>The page will be reloaded in 10 seconds!");
    setTimeout(loading_error_reload,10000);
}
function loading_error_reload()
{
    window.location.assign(baseurl);
}
//------------------------------------------------------------------------------
// If elements depend on other elements, to be created first, this provides an
// accumulator, to store elements for a later creation.
//------------------------------------------------------------------------------
var elements_factory_sub_elements_accumulator=[];
function elements_factory_create_later(a)
{
    if(a[0]=="WINDOW")
    {
        elements_factory_sub_elements_accumulator.push(a);
    }
    else
    {
        console.log("Unkown sub-elements type in elements_factory_create_later().");
    }
}
function elements_factory_reset_accumulator()
{
    elements_factory_sub_elements_accumulator=[];
}
function elements_factory_create_from_accumulator()
{
    for(var i=0;i<elements_factory_sub_elements_accumulator.length;i++)
    {
        //console.log("elements_factory_sub_elements_accumulator() "+elements_factory_sub_elements_accumulator[i][1]);
        var parent_div=document.getElementById("element_"+elements_factory_sub_elements_accumulator[i][1]);
        if(typeof window[elements_factory_sub_elements_accumulator[i][2]+"_wrapper"] == 'function')
        {
            var elem=new window[elements_factory_sub_elements_accumulator[i][2]+"_wrapper"](parent_div,gstyle,elements_factory_sub_elements_accumulator[i]);
            elem.load("initial");
        }
        else
        {
            console.log("[ERROR] Missing element: "+elements_factory_sub_elements_accumulator[i][2]);
            console.log(">> There should be a function called "+elements_factory_sub_elements_accumulator[i][2]+"_wrapper().");
            console.log(">> Please check, if module elements/"+elements_factory_sub_elements_accumulator[i][2]+" has been loaded.");
        }
    }
    elements_factory_reset_accumulator();
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
/*
function create(element_function,content_url,style,pdiv)
{
    var obj=new element_function(pdiv,style);
    load(obj,content_url);
    return obj;
}
*/
/*
function load(object,content_url)
{
    httpGetAsync(content_url,receive_text,object);
}
*/
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function load_element_first(name,css_style,count)
{
    var url0="js/elements/"+name+"/"+name+"_wrapper.js";
    var url1="js/elements/"+name+"/"+name+"_"+css_style+".css";
    if(!main_loader.is_loaded(url0))
    {
        global_loadstat=new loadstat(document.getElementById("MAIN"));
        main_loader.est_maxfiles+=count;
        main_loader.ready_callback=function(){global_loadstat.destroy();load_element(name);};
        main_loader.load(url0);
        main_loader.load(url1);
    }
    else
    {
        load_element(name);
    }
}
function load_element(name)
{
    //console.log("load_element() -- "+name);
    dataevent_store0();
    dataevent_run();
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function load_page_in_new_tab(page)
{
    var win=window.open("?page="+page+"&style="+gstyle+"&lang="+lang,"_blank");
    win.focus();
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function load_page(page)
{
    if(veto_next_click_event)
    {
        veto_next_click_event=false;
        return;
    }

    //pagedata_loaded=0;
    dataevent_reset(1);
    load_page_clean(page);
    var data_string=data_to_string(currentdata);
    history.pushState(null,currentpage,"?page="+currentpage+"&style="+gstyle+"&lang="+lang+"&data="+btoa(data_string));
}
function load_page_data(page,data)
{
    //pagedata_loaded=0;
    dataevent_reset(1);
    load_page_clean_data(page,data);
    var data_string=data_to_string(currentdata);
    history.pushState(null,currentpage,"?page="+currentpage+"&style="+gstyle+"&lang="+lang+"&data="+btoa(data_string));
}
function load_page_clean(page)
{
    if(page=="")page="home";
    //console.log(page);
    currentpage=page;
    pagecount++;
    u_load_page(page);
}
function load_page_clean_data(page,data)
{
    if(page=="")page="home";
    //console.log(page);
    currentpage=page;
    currentdata=data;
    pagecount++;
    u_load_page(page);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function setlang(newLang)
{
    lang=newLang;
    u_setlang(newLang);
    load_page(currentpage);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function setgstyle(style)
{
    if(style=="text")
    {
        var action=currentpage;
        if(action.substr(0,4)=="mod_")action=action.substr(4);
        this.location="text/?action="+action+"&style="+gstyle+"&lang="+lang;
        //this.location="text/?page="+currentpage+"&style="+gstyle+"&lang="+lang;
        return;
    }
    setgstyle_clean(style);
    load_page(currentpage);
}
function setgstyle_clean(style)
{
    u_chstyle(gstyle,style);
    gstyle=style;
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function main_elements_add(elem)
{
    main_elements[main_elements_counter]=elem;
    main_elements_counter++;
}

function main_elements_remove(elem)
{
    var s=0;
    for(var i=0;i<main_elements_counter;i++)
    {
        if(s==0 && main_elements[i]==elem)
        {
            s=1;
        }
        else if(s)
        {
            main_elements[i-1]=main_elements[i];
        }
    }
    if(s)main_elements_counter--;
}

function main_elements_select_next()
{
    if(selected_elem==null)
    {
        if(main_elements_counter>0)
        {
            selected_elem=main_elements[0];
        }
    }
    else
    {
        selected_elem.mbox().style.border=selected_style;

        for(var i=0;i<main_elements_counter;i++)
        {
            if(main_elements[i]==selected_elem)
            {
                if(i<main_elements_counter-1)
                {
                    selected_elem=main_elements[i+1];
                }
                else if(i==main_elements_counter-1)
                {
                    selected_elem=main_elements[0];
                }
                i=main_elements_counter;
            }
        }
    }
    if(selected_elem)
    {
        selected_style=selected_elem.mbox().style.border;
        selected_elem.mbox().style.border="solid 3px red";
        selected_elem.onEvent("select","");
    }
    else console.log("X");
}

function main_elements_select_none()
{
    if(selected_elem)
    {
        selected_elem.mbox().style.border=selected_style;
        selected_elem=null;
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var veto_next_click_event=false;
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function main_onResize()
{
    screenx=window.innerWidth;
    screeny=window.innerHeight;
    main_dispatch("resize",null);
}

function main_onMousemove(evt)
{
    mousexs=mousex
    mouseys=mousey;
	doc_mousex=evt.clientX;
	doc_mousey=evt.clientY;
    mousex=doc_mousex+document.body.scrollLeft;
    mousey=doc_mousey+document.body.scrollTop;
    main_dispatch("mousemove",evt);
}

function main_onMousedown(evt)
{
    main_dispatch("mousedown",evt);
}

function main_onMouseup(evt)
{
    if(evt.button==1 && evt.target.tagName=="A" && evt.target.href.substr(0,11)=="javascript:")
    {
        if(evt.target.href.substr(11,10)=="load_page(")
        {
            evt.preventDefault();
            veto_next_click_event=true;
            var a=evt.target.href.substr(22);
            a=a.substr(0,a.indexOf(")")-1);
            window.open(baseurl+"?page="+a+"&style="+gstyle+"&lang="+lang+"&data="+btoa(currentdata));
            return;
        }
    }
    main_dispatch("mouseup",evt);
}

function main_onClick(evt)
{
    //MMB does not fire click events!
    //moved this to load_page().
    /*
    if(veto_next_click_event && evt.button==1)
    {
        veto_next_click_event=false;
        evt.preventDefault();
        return;
    }
    */
	doc_mousex=evt.clientX;
	doc_mousey=evt.clientY;
    mousex=doc_mousex+document.body.scrollLeft;
    mousey=doc_mousey+document.body.scrollTop;
    main_dispatch("click",evt);
}

function main_onDblClick(evt)
{
	doc_mousex=evt.clientX;
	doc_mousey=evt.clientY;
    mousex=doc_mousex+document.body.scrollLeft;
    mousey=doc_mousey+document.body.scrollTop;
    main_dispatch("dblclk",evt);
}

function main_onKeydown(evt)
{
    var c=evt.which || evt.keyCode;
    if(c==27)
    {
        if(selected_elem)
        {
            main_elements_select_none();
        }
        else
        {
            main_elements_select_next();
        }
        evt.preventDefault();
    }
    else if(selected_elem)
    {
        if(c==9)
        {
            main_elements_select_next();
        }
        else
        {
            selected_elem.onEvent("keydown",evt);
        }
        evt.preventDefault();
    }
}

function main_onKeyup(evt)
{
    main_dispatch("keyup",evt);
}

function main_onKeypress(evt)
{
    var c=evt.which || evt.keyCode;
    if(c=='\t')
    {
        //main_elements_select_next();
    }
    else if(c==27)
    {
        //main_elements_select_none();
    }
    main_dispatch("keypress",evt);
}

function main_onScroll(evt)
{
    main_dispatch("scroll",evt);
}

function main_onWheel(evt)
{
    main_dispatch("wheel",evt);
}

function main_onResize(evt)
{
    screenx=window.innerWidth;
    screeny=window.innerHeight;
    main_dispatch("resize",evt);
}

function main_dispatch(type,evt)
{
	if(single_capture)
	{
		single_capture.onEvent(type,evt);
	}
	else
	{
        var boxlayer=-1;
        if(typeof pw != 'undefined')boxlayer=pw.getBoxFromPoint(mousex,mousey);
        for(var i=0;i<main_elements_counter;i++)
        {
            if(boxlayer==-1 || (typeof main_elements[i].boxlayer != 'undefined' && (main_elements[i].boxlayer==boxlayer || main_elements[i].boxtype=="pw")))
                main_elements[i].onEvent(type,evt);
        }
	}
}

var globalEventCallbacks=[];
function setEventCallback(dom_element,action,callback)
{
    var c=getEventCallback(dom_element,action);
    if(c!=null)
    {
        console.log("[ERROR] setEventCallback: Callback already set.");
        return;
    }
    globalEventCallbacks.push([dom_element,action,callback]);
    dom_element.addEventListener(action,callback);
    //console.log(globalEventCallbacks);
    /*
    for(var i=0;i<globalEventCallbacks.length;i++)
    {
        console.log(i+" --> "+globalEventCallbacks[i][0]+" -- "+globalEventCallbacks[i][1]+" -- "+globalEventCallbacks[i][2]);
    }
    */
}
function getEventCallback(dom_element,action)
{
    for(var i=0;i<globalEventCallbacks.length;i++)
    {
        if(globalEventCallbacks[i][0]==dom_element && globalEventCallbacks[i][1]==action)
        {
            return globalEventCallbacks[i][2];
        }
    }
    return null;
}
function delEventCallback(dom_element,action)
{
    for(var i=0;i<globalEventCallbacks.length;i++)
    {
        if(globalEventCallbacks[i][0]==dom_element && globalEventCallbacks[i][1]==action)
        {
            dom_element.removeEventListener(action,globalEventCallbacks[i][2]);
            globalEventCallbacks.splice(i,1);
            return;
        }
    }
}
