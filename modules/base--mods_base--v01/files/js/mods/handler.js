
//(0)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function Handler(element)
{
    this.dom_element_name=element;
    this.gotopage=null;
    this.gotodata=null;
    this.user_context=new file_storage();
    this.main_context=new file_storage();
    //this.vars_context=new file_storage();
    
    //this.last_event_type="";
    //this.last_event_module="";
    //this.last_event_context="";

	this.onClick0=function(type,evt)
    {
        httpSendPostMessage("sys/index.php","site="+site+"&lang="+lang+"&"+evt,receive_message,this,type);
    }
	this.onClick=function(type,evt)
    {
        //pagecount++;
        httpSendPostMessage("sys/index.php","site="+site+"&lang="+lang+"&"+evt,receive_message,this,type);
    }
    this.loadText0=function(type,content)
    {
        httpSendGetMessage(baseurl+"content/"+lang+"/"+content+".txt",receive_message,this,type);
    }
    this.loadText=function(type,content)
    {
        //pagecount++;
        httpSendGetMessage(baseurl+"content/"+lang+"/"+content+".txt",receive_message,this,type);
    }
    /*
    this.loadContent=function(type,module,content)
    {
        httpSendGetMessage(baseurl+"content/"+lang+"/"+module+"/"+content+".txt",receive_message,this,type);
    }
    */
	this.onEvent=function(type0,evt)
    {
        //console.log("this.onEvent() -- "+type0+" -- "+evt);
        
        //this.type="";
        //this.module="";
        //this.context="";
        var type="";
        var module="";
        var context="";
        
        var t=type0.split("|");
        var n=t.length;
        if(n==1)
        {
            type=t[0];
        }
        else if(n==2)
        {
            type=t[0];
            context=t[1];
        }
        else if(n==3)
        {
            type=t[0];
            context=t[1];
            module=t[2];
            if(typeof window["mods_"+module+"_handle"] == 'function')
                if(!window["mods_"+module+"_handle"](this,type,evt,context))
                    return;
        }
        
        //console.log("main handler: "+type+" -> "+evt);
        switch(type)
        {
            case "store_file":
                dataevent_store0();
                dataevent_run();
                break;
            case "page":
                //pagecount++;
                //pagedata_loaded=0;
                //console.log(this.dom_element_name+":"+evt);
                domel[this.dom_element_name].load2(evt,"center");
                ////load_page(evt);
                break;
            case "text":
                //Version (A)
                //document.getElementById("placeholder").innerHTML=evt;
                //document.getElementById("placeholder").id="filled";
                //Version (B)
                print_reply(this,document.getElementById("placeholder").className,evt);
                document.getElementById("placeholder").parentNode.removeChild(document.getElementById("placeholder"));
                break;
            case "fill_form":
                handler_run_std(this,module,evt,type,context,"mform",handler_fill_form);
                break;
            case "save":
            case "reply":
                handler_run_std(this,module,evt,type,context,"",handler_reply);
                break;
            case "reply_page":
                handler_run_std(this,module,evt,type,context,"",handler_reply_page);
                break;
            case "reply_page_public":
                handler_run_std2(this,module,evt,type,context,"",handler_reply_page,"public");
                break;
            case "goto_page":
                handler_run_std(this,module,evt,type,context,"",handler_goto_page);
                break;
            case "mods_load":
                handler_run_std(this,module,evt,type,context,"",handler_mods_load);
                break;
            case "print_parts":
                handler_run_std(this,module,evt,type,context,"",handler_print_parts);
                break;
            case "memshow":
                handler_run_std(this,module,evt,type,context,"",handler_memshow);
                //handler_memshow(this,this.dom_element_name,module,evt,type,context);
                break;
            case "memshow_admin":
                handler_run_std(this,module,evt,type,context,"ADMIN",handler_memshow);
                //handler_memshow_admin(this,this.dom_element_name,module,evt,type,context);
                break;
            case "memshow_developer":
                handler_run_std(this,module,evt,type,context,"DEVELOPER",handler_memshow);
                //handler_memshow_developer(this,this.dom_element_name,module,evt,type,context);
                break;
            default:
                console.log("Handler.onEvent()<br>unknown event ("+type+").");
        }
        //dataevent_run();
    }
    this.setup=function(s)
    {
        alert("setup");
    }
}
function handler_fill_form(handler,module,evt,type,context,data,part)
{
    //fill_form(module,evt,type,context,data);
    //console.log("fill: "+module);
    fill_form_i(module,part[1],type,context,data,true);
}
function handler_fill_delform(handler,module,evt,type,context,data,part)
{
    //console.log("fill: "+module);
    fill_form_i(module,part[1],type,context,data,false);
}
function handler_fill_fkeys(handler,module,evt,type,context,data,part)
{
    var formular=data;
    var parti=part[1];
    if(parti.substr(0,11)=="base64data:")
    {
        var f=parti.substr(11).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value(f[i]);
            //console.log("parameter:"+name+"="+value);

            //get local name
            var local_name=context_load2(0,module+"_local_field_for_"+name,"");
            
            //console.log("handler_fill_fkeys() "+module+"_local_field_for_"+name+"="+local_name+" SET "+value);
            
            if(local_name!="" && typeof document.forms[formular].elements[local_name] != 'undefined')
            {
                document.forms[formular].elements[local_name].value=value;
            }
        }
    }
    else if(parti.substr(0,6)=="plain:")
    {
        var f=parti.substr(6).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value_plain(f[i]);
            
            //get local name
            var local_name=context_load2(0,module+"_local_field_for_"+name,"");
            
            if(local_name!="" && typeof document.forms[formular].elements[local_name] != 'undefined')
            {
                document.forms[formular].elements[local_name].value=value;
            }
        }
    }
    else
    {
        console.log(module+"::handler_fill_fkeys() - unknown parti: "+parti);
    }
}
function handler_fill(handler,module,evt,type,formular,data,part)
{
    var vars=new file_storage();
    var flds=new file_storage();
    parse_response(formular[0],flds);
    for(var i=1;i<part.length && i<formular.length;i++)
    {
        vars.reset();
        parse_response(part[i],vars);
        for(var j=0;j<document.forms[formular[i]].elements.length;j++)
        {
            var value=vars.get(document.forms[formular[i]].elements[j].name);
            if(value!=null)document.forms[formular[i]].elements[j].value=value;          
            if(flds.load(document.forms[formular[i]].elements[j].name)=="true")document.forms[formular[i]].elements[j].disabled=false;
        }
    }
}
function handler_memshow(handler,module,evt,type,context,data,part)
{
    if(data=="" || part[1]==data)
    {
        document.getElementById("memdiv").style.visibility="visible";
        document.getElementById("prediv").style.visibility="hidden";
        document.getElementById("prediv").style.height="3px";
    }
    else
    {
        if(data=="DEVELOPER")mods_user_load("nodeveloper");
        else if(data=="ADMIN")mods_user_load("noadmin");
        else mods_user_load("noadmin");
    }
}
function handler_goto_page(handler,module,evt,type,context,data,part)
{
    load_page(context);
}
function handler_reply_page(handler,module,evt,type,context,data,part)
{
    //console.log(">> "+typeof domel[handler.dom_element_name]);
    if(typeof domel[handler.dom_element_name].vars_context == 'object')
    {
        var vars=new file_storage();
        for(var i=1;i<part.length;i++)
        {
            if(is_response(part[i]))parse_response(part[i],vars);
        }
        domel[handler.dom_element_name].vars_context=vars;
        domel[handler.dom_element_name].vars_context.store("$mode","text");
        //domel[handler.dom_element_name].vars_context.print();
        //load_page(module+"_"+context);
    }
    main_handler.onEvent("page",module+"_"+context);
}
function handler_mods_load(handler,module,evt,type,context,data,part)
{
    mods_load_data(module,context,data);
}
function handler_reply(handler,module,evt,type,context,data,part)
{
    /*
    if(typeof domel[handler.dom_element_name].object.title == 'undefined')var elem=domel[handler.dom_element_name].object.box;
    else var elem=domel[handler.dom_element_name].object.title;

    var d=document.createElement("div");
    d.id="reply_"+Math.random();
    d.className="serverinfobox";
    d.innerHTML="OK";
    d.innerHTML+="<div style='float:right;'><a href='JavaScript:document.getElementById(\""+d.id+"\").parentNode.removeChild(document.getElementById(\""+d.id+"\"));'>[x]</a></div>";
    elem.insertBefore(d,elem.firstChild);
    */
    print_reply(handler,"serverinfobox","OK");
}
function print_reply(handler,stylename,message)
{
    if(typeof domel[handler.dom_element_name].object.title == 'undefined')var elem=domel[handler.dom_element_name].object.box;
    else var elem=domel[handler.dom_element_name].object.title;

    var d=document.createElement("div");
    d.id="reply_"+Math.random();
    d.className=stylename;
    d.innerHTML=message;
    d.innerHTML+="<div style='float:right;'><a href='JavaScript:document.getElementById(\""+d.id+"\").parentNode.removeChild(document.getElementById(\""+d.id+"\"));'>[x]</a></div>";
    elem.insertBefore(d,elem.firstChild);
    
    //console.log("scroll"+domel[handler.dom_element_name]);
    domel[handler.dom_element_name].scroll(0,0);
}
function print_reply_placeholder(handler,stylename,message)
{
    if(typeof domel[handler.dom_element_name].object.title == 'undefined')var elem=domel[handler.dom_element_name].object.box;
    else var elem=domel[handler.dom_element_name].object.title;

    var d=document.createElement("div");
    d.id="placeholder";
    d.className=stylename;
    d.innerHTML=message;
    elem.insertBefore(d,elem.firstChild);
}
function handler_print_parts(handler,module,evt,type,context,data,part)
{
    document.getElementById(context).innerHTML="";
    if(data=="")
    {
        for(var i=1;i<part.length;i++)
        {
            document.getElementById(context).innerHTML+=part[i]+"<br>";
        }
    }
    else
    {
        var item=global_file_storage.load_text(data);
        var parser=new varparser();
        var vars=new file_storage();
        parser.setup();
        for(var i=2;i<part.length;i++)
        {
            vars.reset();
            parse_response(part[1],vars);
            parse_response(part[i],vars);
            parser.dfa.reset();
            parser.parse2(item,vars);
            document.getElementById(context).innerHTML+=vars.load("$text");
        }
    }
}
function handler_handle_search_results(handler,module,evt,type,context,data,part)
{
    var a=(data+",,").split(",");
    var formular=a[0];
    var listname=a[1];
    var dcontext=a[2];
    
    var navb=global_file_storage.load_text(module+"_"+listname+"_nav");
    var item=global_file_storage.load_text(module+"_"+listname+"_item");

    var parser=new varparser();
    var vars=new file_storage();
    parse_response(part[1],vars);
    
    parser.setup();
    parser.parse2(navb,vars);
    if(document.getElementById("dcontent_"+dcontext+"1"))
        new results_nav_wrapper(document.getElementById("dcontent_"+dcontext+"1"),gstyle,null,formular).setup_data(vars,0);
    if(document.getElementById("dcontent_"+dcontext+"3"))
        new results_nav_wrapper(document.getElementById("dcontent_"+dcontext+"3"),gstyle,null,formular).setup_data(vars,1);

    fill_form_i(module,part[1],type,context,formular);

    var output="";
    if(part.length>2)
    {
        vars.reset();
        parse_response(part[1],vars);
        parse_response(part[2],vars);
        parser.dfa.reset();
        parser.parse2(item,vars);
        output+=vars.load("$begin");
    }
    for(var i=2;i<part.length;i++)
    {
        vars.reset();
        parse_response(part[1],vars);
        parse_response(part[i],vars);
        parser.dfa.reset();
        parser.parse2(item,vars);
        //vars.print();
        output+=vars.load("$text");
    }
    output+=vars.load("$end");
    if(document.getElementById("dcontent_"+dcontext+"2"))
        document.getElementById("dcontent_"+dcontext+"2").innerHTML=output;
}
function handler_handle_search_results_comments(handler,module,evt,type,context,data,part)
{
    var a=(data+",,").split(",");
    var formular=a[0];
    var listname=a[1];
    var dcontext=a[2];
    
    var navb=global_file_storage.load_text(module+"_"+listname+"_nav");
    var item=global_file_storage.load_text(module+"_"+listname+"_item");

    var parser=new varparser();
    var vars=new file_storage();
    parse_response(part[1],vars);
    
    parser.setup();
    parser.parse2(navb,vars);
    new results_nav_wrapper(document.getElementById("dcontent_"+dcontext+"1"),gstyle,null,formular).setup_data(vars,0);
    new results_nav_wrapper(document.getElementById("dcontent_"+dcontext+"3"),gstyle,null,formular).setup_data(vars,1);

    fill_form_i(module,part[1],type,context,formular);

    document.getElementById("dcontent_"+dcontext+"2").innerHTML="";
    for(var i=2;i<part.length;i++)
    {
        vars.reset();
        parse_response(part[1],vars);
        parse_response(part[i],vars);
        
        vars.store("comment_text",vars.load("comment_text").replace(/\n/g,"<br>"));
        vars.store("post_time",blog_make_timestr(vars.load("post_time")));
        
        parser.dfa.reset();
        parser.parse2(item,vars);
        //vars.print();
        document.getElementById("dcontent_"+dcontext+"2").innerHTML+=vars.load("$text");
    }
}
function blog_make_timestr(numtime)
{
    var a=numtime.split(".");
    a[0]=parseInt(a[0]);
    a[1]=parseInt(a[1]);
    var Y=Math.floor(a[0]/10000);
    var M=Math.floor((a[0]-Y*10000)/100);
    var D=(a[0]-Y*10000-M*100);
    var h=Math.floor(a[1]/10000);
    var m=Math.floor((a[1]-h*10000)/100);
    var s=(a[1]-h*10000-m*100);
    return D+"."+M+"."+Y+" (um "+h+":"+m+" Uhr)";
}
function fill_form_i(module,parti,type,context,formular,do_enable_fields)
{
    if(!document.forms.namedItem(formular))return;
    if(parti.substr(0,11)=="base64data:")
    {
        var f=parti.substr(11).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value(f[i]);
            if(typeof document.forms[formular].elements[name] != 'undefined')
            {
                document.forms[formular].elements[name].value=value;
                if(do_enable_fields)
                {
                    var sx=document.forms[formular].elements[name].className.substr(-2);
                    if(!(sx.substr(0,1)>='0' && sx.substr(0,1)<='9' && sx.substr(1,1)>='d'))
                    {
                        document.forms[formular].elements[name].disabled=false;
                    }
                }
                var callback=getEventCallback(document.forms[formular].elements[name],"change");
                if(callback!=null)callback(null);
            }
        }
        //enable submit button
        document.forms[formular].elements["b01"].disabled=false;
    }
    else if(parti.substr(0,6)=="plain:")
    {
        var f=parti.substr(6).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value_plain(f[i]);
            if(typeof document.forms[formular].elements[name] != 'undefined')
            {
                document.forms[formular].elements[name].value=value;
                if(do_enable_fields)
                {
                    var sx=document.forms[formular].elements[name].className.substr(-2);
                    if(!(sx.substr(0,1)>='0' && sx.substr(0,1)<='9' && sx.substr(1,1)>='d'))
                    {
                        document.forms[formular].elements[name].disabled=false;
                    }
                }
                var callback=getEventCallback(document.forms[formular].elements[name],"change");
                if(callback!=null)callback(null);
            }
        }
        //enable submit button
        document.forms[formular].elements["b01"].disabled=false;
    }
    else
    {
        console.log(module+"::fill_form_i() - unknown parti: "+parti);
    }
    //
    if(typeof e_mbox.check_inputs2 == 'function')e_mbox.check_inputs2(module);
}
function handler_run_std(handler,module,evt,type,context,data,func)
{
    return handler_run_std2(handler,module,evt,type,context,data,func,"user");
}
function handler_run_std2(handler,module,evt,type,context,data,func,level)
{
    if(typeof domel[handler.dom_element_name].object.title == 'undefined')var elem=domel[handler.dom_element_name].object.box;
    else var elem=domel[handler.dom_element_name].object.title;
    
    var part=evt.split("|");//console.log("-"+part[0]+"-");
    switch(part[0])
    {
        case "[OK]":
        case "[OK][OK]":
            if(dataevent_store2(type,context,module,evt))
            {
                if(func)func(handler,module,evt,type,context,data,part);
                return true;
            }
            break;
        case "[E100]"://system down.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E101]"://unknown area.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E103]"://no_data.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E104]"://unknown command.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E105]"://no_login
            if(level=="user")
            {
                handler.gotopage=currentpage;
                handler.gotodata=data;
                //console.log("P "+currentpage+" "+data);
                mods_user_load("login");
            }
            else if(level=="public")//ignore no-login, if level is public
            {
                if(dataevent_store2(type,context,module,evt))
                {
                    if(func)func(handler,module,evt,type,context,data,part);
                    return true;
                }
            }
            break;
        case "[E106]"://no admin.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E107]"://upload_err.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E108]"://not_allowed.
            mods_user_load("noadmin");
            //console.log(module+"::Error: "+type+": "+evt);
            //new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E109]"://sql error.
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E202]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_no_email_verify");
            break;
        case "[E203]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_max_flogin");
            break;
        case "[E204]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_no_email");
            break;
        case "[E205]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_agbs_not_checked");
            break;
        case "[E206]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_txt_short_pass");
            break;
        case "[E207]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_txt_email_diff");
            break;
        case "[E208]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_txt_pass_diff");
            break;
        case "[E209]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_txt_false_pass");
            break;
        case "[E211]":
            var d=document.createElement("div");
            d.id="placeholder";
            d.className="servererrorbox";
            d.innerHTML="Error: "+evt;
            elem.insertBefore(d,elem.firstChild);
            handler.loadText("text","user_wrong_email_verify");
            break;
        default:
            console.log(module+"::Error: "+type+": "+evt);
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
    }
    return false;
}

//(1)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function find_ch(str,ch)
{
    var i=0;
    while(i<str.length && str[i]!='=')i++;
    return i;
}

function get_name(str)
{
    return str.substr(0,find_ch(str,'='));
}

function get_value(str)
{
    var base64value=str.substr(find_ch(str,'=')+1);
    if(base64value==str)return "";
    //return atob(base64value);
    return decode_b64(base64value);
}

function get_value_plain(str)
{
    var value=str.substr(find_ch(str,'=')+1);
    if(value==str)return "";
    return value;
}

function get_variable(str,name)
{
    if(str.substr(0,11)=="base64data:")
    {
        var f=str.substr(11).split(",");
        for(var i=0;i<f.length;i++)
        {
            if(get_name(f[i])==name)
            {
                return get_value(f[i]);
            }
        }
    }
    else if(str.substr(0,6)=="plain:")
    {
        var f=str.substr(6).split(",");
        for(var i=0;i<f.length;i++)
        {
            if(get_name(f[i])==name)
            {
                return f[i].substr(name.length+1);
            }
        }
    }
    return "";
}

//(1)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function parse_response(str,data)
{
    if(str.substr(0,11)=="base64data:")
    {
        var f=str.substr(11).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value(f[i]);
            data.store(name,value);
        }
    }
    else if(str.substr(0,6)=="plain:")
    {
        var f=str.substr(6).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value_plain(f[i]);
            data.store(name,value);
        }
    }
    else
    {
        console.log("::parse_response() - unknown format: ");
    }
}
function is_response(str)
{
    if(str.substr(0,11)=="base64data:" || str.substr(0,6)=="plain:")
    {
        return true;
    }
    return false;
}

main_loader.ready();
