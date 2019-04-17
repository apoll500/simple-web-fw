
//(0)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
main_loader.load("js/mods/dataevent.js");
main_loader.load("js/mods/handler.js");
main_loader.load("js/mods/load.js");
main_loader.load("js/mods/run.js");

/*******************************************************************************
*                                                                              *
*  UTF-8 - Encoding                                                            *
*                                                                              *
*  JavaScript uses either UCS-2 or UTF-16!                                     *
*  Therefore all strings have to be converted to and from UTF-8.               *
*                                                                              *
*******************************************************************************/
function encode_utf8(s)
{
    return unescape(encodeURIComponent(s));
}
function decode_utf8(s)
{
    return decodeURIComponent(escape(s));
}
function encode_b64_data(s)
{
    //An application receiving the base64 data, does not necessarily know if
    //this data represents a string for which a terminating '\0' would be
    //required. So it makes sense to add it here.
    return btoa(encode_utf8(s)+"\0");
}
function encode_b64(s)
{
    return btoa(encode_utf8(s));
}
function decode_b64(s)
{
    return decode_utf8(atob(s));
}
/*******************************************************************************
*                                                                              *
*  Helpers                                                                     *
*                                                                              *
*                                                                              *
*******************************************************************************/
function load_parent_forms_data(area,n)
{
    load_parent_forms_data2(null,area,n,false);
}
function load_parent_forms_data2(module,area,n,doext)
{
    if(context_sublevel>=0)
    {
        var pme=0;
        var pm=context_load("parent_module","");
        if(pm=="")pme=1;
        //console.log("-- "+pme+" --------------------------------------");
        //console.log("pm="+pm);
        dataevent_reset(n);//+context_sublevel2+1-pme);
        for(var i=context_sublevel2;i>=0;i--)
        {
            var m=context_load2(context_sublevel-i,"parent_module","");
            if(m!="")
            {
                var t=context_load2(context_sublevel-i,m+"_table","");
                var k=context_load2(context_sublevel-i,m+"_keys","");
                var kk=k.split(",");
                var vdata="";
                for(var j=0;j<kk.length;j++)
                {
                    console.log("sublevel main:"+(context_sublevel-i));
                    var v=context_load2(context_sublevel-i,m+"_key_"+kk[j],"");
                    vdata+="&"+kk[j]+"="+v;//encode_b64(v);
                }
                if(pme==0)
                {
                    if(i==0)
                    {
                        if(doext)
                        {
                            console.log("fill_show_form_ext||"+module+" --- area="+area+"&comm="+m+"_show"+vdata);
                            main_handler.onClick0("fill_show_form_ext||"+module,"area="+area+"&comm="+m+"_show"+vdata);
                        }
                        else
                        {
                            console.log("fill_show_form||"+m+" --- area="+area+"&comm="+m+"_show"+vdata);
                            main_handler.onClick0("fill_show_form||"+m,"area="+area+"&comm="+m+"_show"+vdata);
                        }
                    }
                    else
                    {
                        console.log("fill_show_form_"+(i-pme)+"||"+m+" --- area="+area+"&comm="+m+"_show"+vdata);
                        main_handler.onClick0("fill_show_form_"+(i-pme)+"||"+m,"area="+area+"&comm="+m+"_show"+vdata);
                    }
                }
                else
                {
                    if(i==0)
                    {
                    }
                    else
                    {
                        console.log("fill_show_form_"+i+"||"+m+" --- area="+area+"&comm="+m+"_show"+vdata);
                        main_handler.onClick0("fill_show_form_"+i+"||"+m,"area="+area+"&comm="+m+"_show"+vdata);
                    }
                }
            }
        }
    }
}
function get_all_forms_data()
{
    var o="";
    for(var i=0;i<document.forms.length;i++)
    {
        var form_name=document.forms[i].name;
        o+="-_"+encode_b64(form_name);
        for(var j=0;j<document.forms[i].elements.length;j++)
        {
            var element_name=document.forms[i].elements[j].name;
            var element_value=document.forms[i].elements[j].value;
            o+="-"+encode_b64(element_name)+"-"+encode_b64(element_value);
        }
    }
    //console.log("get_all_forms_data() "+o);
    return o;
}
function restore_all_foms_data(data)
{
    var name="";
    var value="";
    var form_name;
    a=data.split("-");
    
    var inputform="mform";
    if(document.forms.namedItem("sform1"))
    {
        inputform="sform1";
    }
    
    for(var i=1;i<a.length;i++)
    {
        if(a[i].substr(0,1)=="_")
        {
            form_name=decode_b64(a[i].substr(1));
        }
        else
        {
            if(name=="")
            {
                name=decode_b64(a[i]);
            }
            else
            {
                value=decode_b64(a[i]);
                //console.log("restore_all_foms_data() "+form_name+"::"+name+"::"+value);
                document.forms.namedItem(form_name).elements.namedItem(name).value=value;
                if(form_name==inputform)
                {
                    var sx=document.forms.namedItem(form_name).elements.namedItem(name).className.substr(-2);
                    if(!(sx.substr(0,1)>='0' && sx.substr(0,1)<='9' && sx.substr(1,1)>='d'))
                    {
                        document.forms.namedItem(form_name).elements.namedItem(name).disabled=false;
                    }
                }
                name="";
                value="";
            }
        }
    }
}
/*******************************************************************************
*                                                                              *
*  Level Context                                                               *
*                                                                              *
*                                                                              *
*******************************************************************************/
var context_sublevel=0;
var context_sublevel2=0;
function context_counter_increase()
{
    context_sublevel++;
    context_sublevel2++;
}
function context_counter_new_stage()
{
    //required if comming not from, show edit or delete.
    context_sublevel++;
    
    context_sublevel2=0;
}
function context_counter_reset()
{
    context_sublevel=0;
    context_sublevel2=0;
    context_store("parent_module","");
}
function context_store(name,value)
{
    context_store2(context_sublevel,name,value);
}
function context_store2(level,name,value)
{
    var prefix=context_make_prefix2(level);
    //console.log("STORE: "+prefix+name+"="+value);
    e_mbox.vars_context.store(prefix+name,value);
    //DEBUG
    context_cleanup();
}
function context_load0(name)
{
    return context_load(name,"");
}
function context_load(name,default_value)
{
    return context_load2(context_sublevel,name,default_value);
}
function context_load2(level,name,default_value)
{
    var prefix=context_make_prefix2(level);
    var v=e_mbox.vars_context.load2(prefix+name,default_value);
    //console.log("LOAD: "+prefix+name+"="+v);
    
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if(name=="data")v=data_workaround(v);
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    return v;
}
function context_make_prefix()
{
    context_make_prefix2(context_sublevel);
}
function context_make_prefix2(level)
{
    var prefix="L";
    if(level<10)prefix+="0"+level;
    else if(level<100)prefix+=""+level;
    else
    {
        console.log("ERROR: context_make_prefix2() -- context_sublevel="+level);
    }
    prefix+="_";
    return prefix;
}
function context_cleanup()
{
    for(var i=0;i<e_mbox.vars_context.container.length;i++)
    {
        var prefix=e_mbox.vars_context.container[i].filename.substr(0,4);
        if(prefix.substr(0,1)=="L" && prefix.substr(3)=="_")
        {
            var level=parseInt(prefix.substr(1,2));
            if(level>context_sublevel)
            {
                console.log("~cleaning "+e_mbox.vars_context.container[i].filename);
                e_mbox.vars_context.container[i].filename="";
                e_mbox.vars_context.container[i].filedata="";
            }
        }
    }
}
/*******************************************************************************
*                                                                              *
*  Last Caller Status                                                          *
*                                                                              *
*                                                                              *
*******************************************************************************/
function caller_status(m,tab,t,d,l,ll)
{
    this.module=m;
    this.table=tab;
    this.token=t;
    this.data=d;
    this.level=l;
    this.level2=ll;
}
function caller_status_storage()
{
    this.current_status=new caller_status("","","","",0,0);
    this.prev_status=new caller_status("","","","",0,0);
    this.store=function(m,tab,t,d)
    {
        this.prev_status=this.current_status;
        this.current_status=new caller_status(m,tab,t,d,context_sublevel,context_sublevel2);
        //console.log("[HISTORY:] "+m+","+tab+","+t+","+d);
    }
    this.remove=function()
    {
        this.current_status=this.prev_status;
        this.prev_status=new caller_status("","","","",0,0);
    }
    this.recall=function()
    {
        caller_recall(this.current_status.module,this.current_status.token,this.current_status.data,this.current_status.level,this.current_status.level2);
    }
    this.recall_prev=function()
    {
        caller_recall(this.prev_status.module,this.prev_status.token,this.prev_status.data,this.prev_status.level,this.prev_status.level2);
    }
    this.print=function()
    {
        console.log("[STATUS:] module,token,data,level");
        console.log("curr-status: "+this.current_status.module+","+this.current_status.token+","+this.current_status.data+","+this.current_status.level+","+this.current_status.level2);
        console.log("prev-status: "+this.prev_status.module+","+this.prev_status.token+","+this.prev_status.data+","+this.prev_status.level+","+this.prev_status.level2);
    }
}
var global_claller_status=new caller_status_storage();
/*******************************************************************************
*                                                                              *
*  Caller Depth (Stack)                                                        *
*                                                                              *
*                                                                              *
*******************************************************************************/
function caller_stack_push_status()
{
    caller_stack_push(
            global_claller_status.current_status.module,
            global_claller_status.current_status.table,
            global_claller_status.current_status.token,
            global_claller_status.current_status.data,
            global_claller_status.current_status.level,
            global_claller_status.current_status.level2);
}
function caller_stack_push_prev_status()
{
    caller_stack_push(
            global_claller_status.prev_status.module,
            global_claller_status.prev_status.table,
            global_claller_status.prev_status.token,
            global_claller_status.prev_status.data,
            global_claller_status.prev_status.level,
            global_claller_status.prev_status.level2);
}
function caller_stack_push(module,table,token,data)
{
    var sub_depth=caller_stack_depth();
    //increase depath
    sub_depth++;
    e_mbox.vars_context.store("sub_depth",sub_depth);
    //store values
    caller_stack_set2(sub_depth,module,table,token,data);
    //caller_stack_peek_print();
    return sub_depth;
}
function caller_stack_set(module,table,token,data)
{
    var sub_depth=caller_stack_depth();
    //store values
    caller_stack_set2(sub_depth,module,table,token,data);
}
function caller_stack_set_data(data)
{
    var sub_depth=caller_stack_depth();
    var module=caller_stack_peek_module2(sub_depth);
    var table=caller_stack_peek_table2(sub_depth);
    var token=caller_stack_peek_token2(sub_depth);
    var level=caller_stack_peek_level2(sub_depth);
    var level2=caller_stack_peek_level22(sub_depth);
    //store values
    caller_stack_set2_e(sub_depth,module,table,token,data,level,level2);
}
function caller_stack_set2(sub_depth,module,table,token,data)
{
    caller_stack_set2_e(sub_depth,module,table,token,data,context_sublevel,context_sublevel2);
}
function caller_stack_set2_e(sub_depth,module,table,token,data,level,level2)
{
    //store values
    e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_module",module);
    e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_table",table);
    e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_token",token);
    e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_level",level);
    e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_level2",level2);
    if(Array.isArray(data))
    {
        for(var i=0;i<data.length;i++)
        {
            e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_data"+i,data[i]);
        }
        e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_data","");
    }
    else
    {
        e_mbox.vars_context.store("global_stack_"+sub_depth+"_caller_data",data);
    }
    //caller_stack_peek_print();
}
function caller_stack_pop()
{
    var sub_depth=caller_stack_depth();
    //delete items
    e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_module");
    e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_table");
    e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_token");
    e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_data");
    e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_level");
    e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_level2");
    var i=0;
    while(true)
    {
        if(!e_mbox.vars_context.del("global_stack_"+sub_depth+"_caller_data"+i))
        {
            break;
        }
        i++;
    }
    //decrease depth
    sub_depth=Math.max(0,sub_depth-1);
    e_mbox.vars_context.store("sub_depth",sub_depth);
    return sub_depth;
}
function caller_stack_clear()
{
    var sub_depth=caller_stack_depth();
    //delete items
    for(var sd=0;sd<=sub_depth;sd++)
    {
        e_mbox.vars_context.del("global_stack_"+sd+"_caller_module");
        e_mbox.vars_context.del("global_stack_"+sd+"_caller_table");
        e_mbox.vars_context.del("global_stack_"+sd+"_caller_token");
        e_mbox.vars_context.del("global_stack_"+sd+"_caller_data");
        e_mbox.vars_context.del("global_stack_"+sd+"_caller_level");
        e_mbox.vars_context.del("global_stack_"+sd+"_caller_level2");
        var i=0;
        while(true)
        {
            if(!e_mbox.vars_context.del("global_stack_"+sd+"_caller_data"+i))
            {
                break;
            }
            i++;
        }
    }
    //reset depth
    e_mbox.vars_context.store("sub_depth",0);
}
function caller_stack_peek_print()
{
    var sub_depth=caller_stack_depth();
    var module=caller_stack_peek_module2(sub_depth);
    var table=caller_stack_peek_table2(sub_depth);
    var token=caller_stack_peek_token2(sub_depth);
    var data=caller_stack_peek_data2(sub_depth);
    var level=caller_stack_peek_level2(sub_depth);
    var level2=caller_stack_peek_level22(sub_depth);
    console.log("[STACK:] peek: "+module+","+table+","+token+","+data+","+level+","+level2);
}
function caller_stack_peek_print_full()
{
    var sub_depth=caller_stack_depth();
    for(var i=0;i<sub_depth+1;i++)
    {
        var module=caller_stack_peek_module2(i);
        var table=caller_stack_peek_table2(i);
        var token=caller_stack_peek_token2(i);
        var data=caller_stack_peek_data2(i);
        var level=caller_stack_peek_level2(i);
        var level2=caller_stack_peek_level22(i);
        console.log("[STACK:] "+i+": "+module+","+table+","+token+","+data+","+level+","+level2);
    }
}
function caller_stack_peek_recall()
{
    var sub_depth=caller_stack_depth();
    var module=caller_stack_peek_module2(sub_depth);
    var table=caller_stack_peek_table2(sub_depth);
    var token=caller_stack_peek_token2(sub_depth);
    var data=caller_stack_peek_data2(sub_depth);
    var level=caller_stack_peek_level2(sub_depth);
    var level2=caller_stack_peek_level22(sub_depth);
    caller_recall(module,table,token,data,level,level2);
}
function caller_stack_pop_recall()
{
    var sub_depth=caller_stack_depth();
    var module=caller_stack_peek_module2(sub_depth);
    var table=caller_stack_peek_table2(sub_depth);
    var token=caller_stack_peek_token2(sub_depth);
    var data=caller_stack_peek_data2(sub_depth);
    var level=caller_stack_peek_level2(sub_depth);
    var level2=caller_stack_peek_level22(sub_depth);
    //console.log("CURRENT TOKEN="+global_claller_status.prev_status.token);
    //console.log("BACK TOKEN="+token);
    if(global_claller_status.prev_status.token!="subcreate" || token.substr(0,9)!="subsearch")
    {
        context_store("parent_module","");
    }
    caller_stack_pop();
    caller_recall(module,table,token,data,level,level2);
}
function caller_recall(module,table,token,data,level,level2)
{
    context_sublevel=level;
    context_sublevel2=level2;
    console.log("test"+typeof context_sublevel);
        
    //console.log("mods_"+module+"_load_clean("+token+","+data+")");
    if(typeof window["mods_"+module+"_load_clean"] == 'function')
    {
        window["mods_"+module+"_load_clean"](token,data);
    }
    else
    {
        load_page("home");
        //to display an error message instead of loading page 'home'.
        //new sysmod_box("Error:<br>Function on stack does not exist.<br> Function: mods_"+module+"_load_clean()");
    }
}
function caller_stack_depth()
{
    var sub_depth=parseInt(e_mbox.vars_context.load2("sub_depth","0"));
    return sub_depth;
}
function caller_stack_peek_module()
{
    var sub_depth=caller_stack_depth();
    return caller_stack_peek_module2(sub_depth);
}
function caller_stack_peek_table()
{
    var sub_depth=caller_stack_depth();
    return caller_stack_peek_table2(sub_depth);
}
function caller_stack_peek_token()
{
    var sub_depth=caller_stack_depth();
    return caller_stack_peek_token2(sub_depth);
}
function caller_stack_peek_data()
{
    var sub_depth=caller_stack_depth();
    data=caller_stack_peek_data2(sub_depth);

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    data=data_workaround(data);
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    return data;
}
function caller_stack_peek_level()
{
    var sub_depth=caller_stack_depth();
    return caller_stack_peek_level2(sub_depth);
}
function caller_stack_peek_level2()
{
    var sub_depth=caller_stack_depth();
    return caller_stack_peek_level22(sub_depth);
}
function caller_stack_peek_module2(sub_depth)
{
    var module=e_mbox.vars_context.load("global_stack_"+sub_depth+"_caller_module");
    return module;
}
function caller_stack_peek_table2(sub_depth)
{
    var module=e_mbox.vars_context.load("global_stack_"+sub_depth+"_caller_table");
    return module;
}
function caller_stack_peek_token2(sub_depth)
{
    var token=e_mbox.vars_context.load("global_stack_"+sub_depth+"_caller_token");
    return token;
}
function caller_stack_peek_data2(sub_depth)
{
    var data=e_mbox.vars_context.load("global_stack_"+sub_depth+"_caller_data");
    if(data=="")
    {
        var i=0;
        var d=[];
        while(true)
        {
            var di=e_mbox.vars_context.load2("global_stack_"+sub_depth+"_caller_data"+i,"undefined");
            if(di!="undefined")d[i]=di;
            else break;
            i++;
        }
        if(i>0)return d;
    }
    return data;
}
function caller_stack_peek_level2(sub_depth)
{
    var token=e_mbox.vars_context.load("global_stack_"+sub_depth+"_caller_level");
    return token;
}
function caller_stack_peek_level22(sub_depth)
{
    var token=e_mbox.vars_context.load("global_stack_"+sub_depth+"_caller_level2");
    return token;
}
/*******************************************************************************
*                                                                              *
*  Dump All Data                                                               *
*                                                                              *
*                                                                              *
*******************************************************************************/
function dump()
{
    console.log("------------------------------------------------");
    console.log("DUMP");
    console.log("------------------------------------------------");
    global_claller_status.print();
    caller_stack_peek_print_full();
    console.log("[CONTEXT:] sublevel_counter="+context_sublevel+"/"+context_sublevel2);
    e_mbox.vars_context.print();
    console.log("------------------------------------------------");
}
function data_workaround(data)
{
    //work around
    //data is stored as 'k' or [k] or 'id=k' ... not 'id=k' but [id=k]
    //replace here 'id=k' to [k]
    //
    //TODO:
    //Implement a format marker(?)
    //
    //for 'id=k' ----> not required!
    if(!Array.isArray(data) && data.search("=")!=-1)
    {
        console.log(data);
        console.log("[DATA:] "+data);
        var vals=[];
        var param=data.split(",");
        for(var i=0;i<param.length;i++)
        {
            var pp=param[i].split("=");
            vals[i]=pp[1];
        }
        data=vals;
        console.log("[DATA:] -1---> "+data);
    }
    //for [id=k] ----> avoid this!
    if(Array.isArray(data))
    {
        console.log(data);
        console.log("[DATA:] "+data);
        var vals=[];
        for(var i=0;i<data.length;i++)
        {
            console.log(data[i]);
            if(data[i].search("=")!=-1)
            {
                var pp=data[i].split("=");
                vals[i]=pp[1];
                console.log(vals[i]);
            }
            else vals[i]=data;
        }
        data=null;
        data=vals;
        console.log("[DATA:] -2---> "+data);
    }
    return data;
}

main_loader.ready();
