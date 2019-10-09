
var global_try_load_mssing_module=true;
//(0)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function load(token)
{
    switch(token)
    {
        case "start":
            main_handler.onEvent("page",token);
            break;
        default:
            new sysmod_box("load()<br>unknown token:<br>"+token);
    }
}
//(1)---------------------------------------------------------------------------
// loading a module on demand
//------------------------------------------------------------------------------
function load_module(module_name,token,data)
{
    //dataevent_reset(1);//--TODO-- PRUEFEN
    var url0="js/mods/mod_"+module_name+".js";
    if(!main_loader.is_loaded(url0))
    {
        global_loadstat=new loadstat(document.getElementById("MAIN"));
        main_loader.est_maxfiles+=1;
        main_loader.ready_callback=function(){
                        global_loadstat.destroy();
                        global_try_load_mssing_module=false;
                        mods_load_data(module_name,token,data);
                        global_try_load_mssing_module=true;};
        main_loader.load(url0);
    }
    else
    {
        global_try_load_mssing_module=false;
        mods_load_data(module_name,token,data);
        global_try_load_mssing_module=true;
    }
}
function load_module_silent(module_name,token,data)
{
    //dataevent_reset(1);//--TODO-- PRUEFEN
    var url0="js/mods/mod_"+module_name+".js";
    if(!main_loader.is_loaded(url0))
    {
        global_loadstat=new loadstat(document.getElementById("MAIN"));
        main_loader.est_maxfiles+=1;
        main_loader.ready_callback=function(){
                        global_loadstat.destroy();
                        global_try_load_mssing_module=false;
                        mods_load_data_silent(module_name,token,data);
                        global_try_load_mssing_module=true;};
        main_loader.load(url0);
    }
    else
    {
        global_try_load_mssing_module=false;
        mods_load_data_silent(module_name,token,data);
        global_try_load_mssing_module=true;
    }
}
//(1)---------------------------------------------------------------------------
// loading a module page
//------------------------------------------------------------------------------
function mods_load(module,token)
{
    mods_load_data(module,token,"");
}
function mods_load_data(module,token,data)
{
    data=string_to_array(data);
    var data_string=data_to_string(data);
    dataevent_reset(1);
    currentpage="mod_"+module+"_"+token;
    if(typeof window["mods_"+module+"_load_clean"] == 'function')
    {
        window["mods_"+module+"_load_clean"](token,data);
    }
    else
    {
        if(global_try_load_mssing_module)
        {
            load_module(module,token,data);
        }
        else
        {
            console.log("Module "+module+" is missing.");
            new sysmod_box("Module "+module+" is missing.");
        }
    }
    history.pushState(null,currentpage,"?page="+currentpage+"&style="+gstyle+"&lang="+lang+"&data="+btoa(data_string));
}
function mods_load_silent(module,token)
{
    mods_load_data_silent(module,token,"");
}
function mods_load_data_silent(module,token,data)
{
    data=string_to_array(data);
    var data_string=data_to_string(data);
    //console.log("mods_load_data_silent("+module+","+token+","+data+")");
    dataevent_reset(1);
    currentpage="mod_"+module+"_"+token;
    if(typeof window["mods_"+module+"_load_clean"] == 'function')
    {
        window["mods_"+module+"_load_clean"](token,data);
    }
    else
    {
        if(global_try_load_mssing_module)
        {
            load_module_silent(module,token,data);
        }
        else
        {
            console.log("Module "+module+" is missing.");
            new sysmod_box("Module "+module+" is missing.");
        }
    }
}
function data_to_string(data)
{
    if(isArray(data))
    {
        var data_string="#array#";
        for(var i=0;i<data.length;i++)
        {
            data_string+=","+data[i];
        }
        return data_string;
    }
    else
    {
        return data;
    }
}
function string_to_array(data)
{
    //if an array is falsely given as string.
    if(!isArray(data) && data.substr(0,1)=='[' && data.substr(data.length-1)==']')
    {
        console.log("array given as string");
        data=data.substr(1,data.length-2).split(',');
    }
    return data;
}
function string_to_array_ex(data)
{
    //convert to array from any format
    if(isArray(data))
    {
        return data;
    }
    if(data.substr(0,1)=='[' && data.substr(data.length-1)==']')
    {
        console.log("array given as string");
        return data.substr(1,data.length-2).split(',');
    }
    return [data];
}
function load_module_from_page(page)
{
    var ppos=page.search("/");
    if(ppos!=-1)
    {
        var pname=page.substr(ppos+1);
        if(pname.substr(0,4)=="mod_")
        {
            page=pname;
        }
    }

    if(page.substr(0,4)=="mod_")
    {
        var s=(page.substr(4)+"_").split('_');
        s[1]=page.substr(s[0].length+5);
        if(typeof window["mods_"+s[0]+"_load_clean"] == 'function')
        {
            window["mods_"+s[0]+"_load_clean"](s[1],currentdata);
        }
        else
        {
            if(global_try_load_mssing_module)load_module(s[0],s[1],currentdata); //--TODO-- ev. neue Version ohne dataevent_reset in mods_load_data
            else console.log("Module "+s[0]+" is missing.");
        }
        return true;
    }
    return false;
}
//(1)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
/*
function mods_load_memshow(module,token)
{
    main_handler.onEvent("page",module+"_"+token);
    main_handler.onClick0("memshow|"+token+","+module+"|"+module,"area=user&comm=logstat");
}
function mod_load_form(module,token,area,comm,formular,func,context)
{
    main_handler.onEvent("page",module+"_"+token);
    main_handler.onClick0(func+"|"+context+"|"+module,"area="+area+"&comm="+module+"_"+comm+"&"+collectData(formular));
}
function mod_load_data(module,token,area,comm,data,func,context)
{
    var x="";if(data!="")x="&";
    main_handler.onEvent("page",module+"_"+token);
    main_handler.onClick0(func+"|"+context+"|"+module,"area="+area+"&comm="+module+"_"+comm+x+data);
}
function mod_load_page(module,token)
{
    main_handler.onEvent("page",module+"_"+token);
}
function mod_load_sys(module,area,comm,data,func,context)
{
    var x="";if(data!="")x="&";
    main_handler.onClick0(func+"|"+context+"|"+module,"area="+area+"&comm="+module+"_"+comm+x+data);
}
*/
//(2)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function isArray(a)
{
  return Object.prototype.toString.call(a)==='[object Array]'; 
}
//(3)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
var menu=null;
function nullfunc()
{
}
function collapse(list,item,p,token)
{
    menu.collapse(p);
}
function menu_expand(list,item,p)
{
    menu.collapse(0);
    menu.left_admin_box.toggle(true);
}
function menu_open(list,item,p,token)
{
    //console.log(token);
    load0(token);
}
function load0(token)
{
    var type="";
    var module="";
    var context="";
    
    var t=token.split("|");
    var n=t.length;
    
    if(n==1)
    {
        t=token.split(",");
        n=t.length;
    }
    
    if(n==1)
    {
        load(token);
    }
    else if(n==2)
    {
        mods_load(t[1],t[0]);
    }
    else if(n==3)
    {
        mods_load_data(t[2],t[0],t[1]);
    }
}

main_loader.ready();
