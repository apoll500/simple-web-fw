
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

    //sys requests
	this.onClick0=function(type,evt)
    {
        httpSendPostMessage("sys/index.php","site="+site+"&lang="+lang+"&"+evt,receive_message,this,type);
    }
	this.onClick=function(type,evt)
    {
        //pagecount++;
        httpSendPostMessage("sys/index.php","site="+site+"&lang="+lang+"&"+evt,receive_message,this,type);
    }
    //load txt files
    this.loadText0=function(type,content)
    {
        console.log("loadText0: "+content+" (type="+type+")");
        httpSendGetMessage(baseurl+"content/"+lang+"/"+content+".txt",receive_message,this,type);
    }
    this.loadText=function(type,content)
    {
        //pagecount++;
        console.log("loadText: "+content+" (type="+type+")");
        httpSendGetMessage(baseurl+"content/"+lang+"/"+content+".txt",receive_message,this,type);
    }
    this.loadModuleText=function(type,module,filename)
    {
        httpSendGetMessage(baseurl+"content/"+lang+"/"+module+"/"+filename+".txt",receive_message,this,type);
    }
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
            case "error_top":
                var msg=select_error_lines(evt,context);
                print_reply(this,document.getElementById("placeholder").className,msg);
                document.getElementById("placeholder").parentNode.removeChild(document.getElementById("placeholder"));
                break;
            case "error_std":
                var d=document.getElementById("error_info_box");
                var msg=select_error_lines(evt,context);
                if(d)d.innerHTML="<div style='font-family:arial;'>"+msg+"<div>";
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
                break;
            case "memshow_admin":
                handler_run_std(this,module,evt,type,context,"ADMIN",handler_memshow);
                break;
            case "memshow_developer":
                handler_run_std(this,module,evt,type,context,"DEVELOPER",handler_memshow);
                break;
            default:
                console.log("Handler.onEvent()<br>unknown event ("+type+").");
        }
    }
    this.setup=function(s)
    {
        alert("setup");
    }
}
function select_error_lines(evt,context)
{
    var j=0;
    var msg="";
    var e=evt.split("\n");
    var c=context.split(",");
    for(var i=0;i<e.length;i++)
    {
        var k=e[i].indexOf(":");
        if(c[0]==e[i].substr(0,k))
        {
            var s=e[i].substr(k+1);
            if(s.charAt(0)=="[" && c.length>1)
            {
                m=s.indexOf("]")-1;
                console.log(s.substr(1,m));
                if(c[1]==s.substr(1,m))
                {
                    if(j>0)msg+="<br>";
                    if(e[i].charAt(k+1)=="-")
                    {
                        if(j>0)msg+="<span style='font-size:11pt;'><i>"+e[i].substr(k+2)+"</i></span>";
                        else msg+=""+e[i].substr(k+2)+"";
                    }
                    else if(e[i].charAt(k+1)=="+")msg+="<span style='font-size:14pt;color:#FF3300;'><b>"+e[i].substr(k+2)+"</b></span>";
                    else msg+=""+e[i].substr(k+1)+"";
                    j++;
                }
            }
            else
            {
                if(j>0)msg+="<br>";
                if(e[i].charAt(k+1)=="-")
                {
                    if(j>0)msg+="<span style='font-size:11pt;'><i>"+e[i].substr(k+2)+"</i></span>";
                    else msg+=""+e[i].substr(k+2)+"";
                }
                else if(e[i].charAt(k+1)=="+")msg+="<span style='font-size:14pt;color:#FF3300;'><b>"+e[i].substr(k+2)+"</b></span>";
                else msg+=""+e[i].substr(k+1)+"";
                j++;
            }
        }
    }
    if(msg=="")
    {
        msg=evt;
    }
    return msg;
}
function handler_fill_form(handler,module,evt,type,context,data,part)
{
    //fill_form(module,evt,type,context,data);
    //console.log("fill: "+module);
    for(var i=1;i<part.length;i++)
    {
        fill_form_i(module,part[i],type,context,data,true);
        fill_form_s(handler,module,part[i],type,context,data,true);
    }
}
function handler_fill_delform(handler,module,evt,type,context,data,part)
{
    //console.log("fill: "+module);
    for(var i=1;i<part.length;i++)
    {
        fill_form_i(module,part[i],type,context,data,false);
        fill_form_s(handler,module,part[i],type,context,data,true);
    }
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
        var m=document.getElementById("memdiv");
        if(m)m.style.visibility="visible";
        var p=document.getElementById("prediv");
        if(p)
        {
            p.style.visibility="hidden";
            p.style.height="3px";
        }
        if(!m)console.log("handler.js: handler_memshow: memdiv missing");
        if(!p)console.log("handler.js: handler_memshow: prediv missing");
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
    main_handler.onEvent("page",module+"/"+context);
}
function handler_mods_load(handler,module,evt,type,context,data,part)
{
    mods_load_data(module,context,data);
}
function handler_reply(handler,module,evt,type,context,data,part)
{
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
    
    domel[handler.dom_element_name].scroll(0,0);
}
function print_reply2(handler,stylename,message)
{
    var d=document.getElementById("placeholder");
    if(d)d.innerHTML=message;
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
    
    var navb=global_file_storage.load_text(module+"/"+listname+"_nav");
    var item=global_file_storage.load_text(module+"/"+listname+"_item");

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
    {
        document.getElementById("dcontent_"+dcontext+"2").innerHTML=output;
        
        if(typeof window["mods_"+module+"_results_refinement"] == 'function')
        {
            window["mods_"+module+"_results_refinement"](document.getElementById("dcontent_"+dcontext+"2"));
        }
        else
        {
            document.getElementById("dcontent_"+dcontext+"2").style.backgroundColor="#CCCCCC";
        }
    }
}
function fill_form_s(handler,module,parti,type,context,formular,unused)
{
    if(parti=="")
    {
        run_module_error_handling(module,"[E200]",handler,"[E200]|mising data.",type,context,formular,"","");
        return;
    }
    if(parti.substr(0,11)=="base64data:")
    {
        var f=parti.substr(11).split(",");
        for(var i=0;i<f.length;i++)
        {
            var name=get_name(f[i]);
            var value=get_value(f[i]);
            var o=document.getElementById("output");
            if(o)
            {
                o.innerHTML=o.innerHTML.replace(new RegExp("§"+name,"gim"),value);
                o.style.visibility="visible";
            }
            else
            {
                replace_in_tree(module,e_mbox.object.box,name,value);
                replace_in_document(module,name,value);
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
        }
    }
    else
    {
        console.log(module+"::fill_form_s() - unknown parti: "+parti);
    }
}
function replace_in_tree(module,o,name,value)
{
    if(name=="GALLERY_ITEM" && o.tagName=="DIV" && (o.id=="main_gallery" || o.id=="mini_gallery"))
    {
        if(o.id=="main_gallery")
        {
            var a=value.split(",");
            var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[2]+"&comm="+a[3]+"_thumbnail&size="+256+"&"+a[4]+"="+a[0];
            var urld=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[2]+"&comm="+a[3]+"_download&"+a[4]+"="+a[0];
            var p=document.createElement("div");
            p.style.float="left";
            p.innerHTML="<table style='border-spacing:0px;'><tr><td style='height:256px;vertical-align:middle;'><a href='"+urld+"' target='_blank'><img src='"+url+"' style='margin:2px;' valign='bottom'></a></td></tr></table>";
            o.appendChild(p);
        }
        if(o.id=="mini_gallery")
        {
            var a=value.split(",");
            var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[2]+"&comm="+a[3]+"_thumbnail&size="+32+"&"+a[4]+"="+a[0];
            var p=document.createElement("div");
            p.style.float="left";
            p.innerHTML="<table style='border-spacing:0px;'><tr><td style='height:32px;vertical-align:middle;'><img src='"+url+"' style='margin:2px;' valign='bottom'></td></tr></table>";
            o.appendChild(p);
        }
    }
    else if(o.children.length>0)
    {
        for(var i=0;i<o.children.length;i++)
        {
            replace_in_tree(module,o.children[i],name,value);
        }
    }
    else if(o.tagName=="DIV" || o.tagName=="SPAN" || o.tagName=="B" || o.tagName=="I" || o.tagName=="U" || o.tagName=="P" || o.tagName=="PRE" || o.tagName=="CODE")
    {
        var oldHTML=o.innerHTML;
        var newHTML=oldHTML.replace(new RegExp("§"+name,"gim"),value);
        if(newHTML!=oldHTML)
        {
            o.innerHTML=newHTML;
            o.style.visibility="visible";
        }
    }
    else if(o.tagName=="IMG")
    {
        if(o.id.substr(0,4)=="sys_")
        {
            var a=o.id.split("_");
            if(a[1]=="download" && a[4]==name)
            {
                var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[2]+"&comm="+a[3]+"_download&"+name+"="+value;
                o.setAttribute("src",url);
            }
            if(a[1]=="thumbnail" && a[6]==name)
            {
                var size=Math.max(a[2],a[3]);
                var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[4]+"&comm="+a[5]+"_thumbnail&size="+size+"&"+name+"="+value;
                o.setAttribute("src",url);
            }
        }
    }
    else
    {
        //o.innerHTML=o.innerHTML.replace(new RegExp("§"+name,"gim"),value);
    }
}
function replace_in_document(module,name,value)
{
    var links=document.getElementsByTagName("A");
    for(var i=0;i<links.length;i++)
    {
        var o=links[i];
        if(o.id.substr(0,4)=="sys_")
        {
            var a=o.id.split("_");
            if(a[1]=="download" && a[4]==name)
            {
                var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[2]+"&comm="+a[3]+"_download&"+name+"="+value;
                o.setAttribute("href",url);
            }
        }
    }
}
function prepare_fill_data(data)
{
    if(data && data!="" && typeof data === 'string')
    {
        var vars=new file_storage();
        //console.log(data);
        var d=data.split("|");
        for(var i=0;i<d.length;i++)
        {
            //console.log(d[i]);
            var k=(d[i]+"").search("=");
            if(k!=-1)
            {
                var name=d[i].substr(0,k);
                var value=d[i].substr(k+1);
                vars.store("$"+name,value);
                //console.log(name+" = "+value);
            }
        }
        domel[main_handler.dom_element_name].vars_context=vars;
        domel[main_handler.dom_element_name].vars_context.store("$mode","fill");
        domel[main_handler.dom_element_name].vars_context.print();
    }
}
function fill_form_i(module,parti,type,context,formular,do_enable_fields)
{
    if(!document.forms.namedItem(formular))
    {
        //console.log("missing form");
        return;
    }
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
    
    var part=evt.split("|");
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
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E101]"://unknown area.
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E103]"://no_data.
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E104]"://unknown command.
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E105]"://no_login
            if(level=="user")
            {
                handler.gotopage=currentpage;
                handler.gotodata=data;
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
            new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            break;
        case "[E108]"://not_allowed.
            mods_user_load("noadmin");
            break;
        //case "[E401]":
        //case "[E402]":
        case "[E109]"://sql error.
            if(part.length>=8)
            {
                var e="";
                if(part[6]=="")part[6]="UNKNOWN ERROR!";
                e+="<div id='error_info_box' style='margin:10px;padding:5px;background-color:#FFDDAA;border-radius:5px;'>"+part[6]+"</div>";
                e+="<a href=\"JavaScript:toggle_box('main_error_details_box')\" style='font-size:11pt;'>error details&#x2b07;</a>";
                e+="<div id=\"main_error_details_box\" style='font-size:11pt;line-height:20px;display:none;'>";
                e+="Error Code: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[0]+"</span><br>";
                e+="Error Detail: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[1]+"</span><br>";
                e+="Module: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+module+"</span><br>";
                e+="Task: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[2]+"</span><br>";
                e+="Database: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[3]+"</span><br>";
                e+="Command: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[4]+"</span><br>";
                e+="Table: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[5]+"</span><br>";
                //e+="Fehler-Info: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[6]+"</span><br>";
                //e+="Zusatz-Info: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[7]+"</span><br>";
                if(part.length>=9)e+="SQL-Message:<br><span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[8]+"</span>";
                e+="</div>";
                var box1=new sysmod_box("Error Message:<hr>"+e);
                if(part[7]!="")handler.loadModuleText("error_std|"+part[1],module,part[7]);
            }
            else
            {
                console.log(module+"::Error: "+type+": "+evt);
                new sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
            }
            break;
        default:
            run_module_error_handling(module,part[0],handler,evt,type,context,data,func,level);
    }
    return false;
}
function run_module_error_handling(module,part0,handler,evt,type,context,data,func,level)
{
    if(typeof window["mods_"+module+"_perror"] == 'function')
    {
        if(!window["mods_"+module+"_perror"](part0,handler,evt,type,context,data,func,level))
        {
            run_module_error_handling_default(module,part0,handler,evt,type,context,data,func,level);
        }
    }
    else
    {
        run_module_error_handling_default(module,part0,handler,evt,type,context,data,func,level);
    }
}
function run_module_error_handling_default(module,part0,handler,evt,type,context,data,func,level)
{
    if(part0.substr(0,3)=="[E4")
    {
        var err2="";
        var e=evt.split("|");
        if(e.length>2)err2=e[2];
        default_perror_std_3xx(part0,err2,handler,evt,module);
    }
    else sysmod_box(module+"::Error: "+type+":<hr>Fehlermeldung:<br>"+evt);
}
function default_perror_std(err,err2,handler,evt,module)
{
    var e="";
    e+="<div id='error_info_box' style='margin:10px;padding:5px;background-color:#FFDDAA;border-radius:5px;'>Module Error "+err+"</div>";
    e+="<a href=\"JavaScript:toggle_box('main_error_details_box')\" style='font-size:11pt;'>error details&#x2b07;</a>";
    e+="<div id=\"main_error_details_box\" style='font-size:11pt;line-height:20px;display:none;'>";
    e+="Error Code: <span style='background-color:#FFFFAA;border:solid 1px #FFAAAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+err+"</span><br>";
    //e+="Error Info: <span style='background-color:#DDDDDD;'><i>"+evt+"</i></span><br>";
    
    var s=evt.split("|");
    if(s.length>1)e+="Error Detail: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'><i>"+s[1]+"</i></span><br>";
    if(s.length>2)e+="Error Token: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'><i>"+s[2]+"</i></span><br>";
    
    e+="Module: <span style='background-color:#FFFFAA;border:solid 1px #FFAAAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+module+"</span><br>";
    e+="</div>";
    var box1=new sysmod_box("Error Message:<hr>"+e);
    handler.loadModuleText("error_std|"+err+","+err2,module,"module_errors");
}
function default_perror_top(err,err2,handler,evt,module)
{
    if(typeof domel[handler.dom_element_name].object.title == 'undefined')var elem=domel[handler.dom_element_name].object.box;
    else var elem=domel[handler.dom_element_name].object.title;
    var d=document.createElement("div");
    d.id="placeholder";
    d.className="servererrorbox";
    d.innerHTML="Error: "+evt;
    elem.insertBefore(d,elem.firstChild);
    handler.loadText("error_top|"+err+","+err2,module+"/module_errors");
}
function default_perror_std_3xx(err,err2,handler,evt,module)
{
    var part=evt.split("|");
    if(part.length>=8)
    {
        var e="";
        if(part[6]=="")part[6]="UNKNOWN ERROR!";
        e+="<div id='error_info_box' style='margin:10px;padding:5px;background-color:#FFDDAA;border-radius:5px;'>"+part[6]+"</div>";
        e+="<a href=\"JavaScript:toggle_box('main_error_details_box')\" style='font-size:11pt;'>error details&#x2b07;</a>";
        e+="<div id=\"main_error_details_box\" style='font-size:11pt;line-height:20px;display:none;'>";
        e+="Error Code: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[0]+"</span><br>";
        e+="Error Detail: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[1]+"</span><br>";
        e+="Module: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+module+"</span><br>";
        e+="Task: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[2]+"</span><br>";
        e+="Database: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[3]+"</span><br>";
        e+="Command: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[4]+"</span><br>";
        e+="Table: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[5]+"</span><br>";
        //e+="Fehler-Info: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[6]+"</span><br>";
        //e+="Zusatz-Info: <span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[7]+"</span><br>";
        if(part.length>=9)e+="SQL-Message:<br><span style='background-color:#FFFFAA;border:solid 1px #FFDDAA;border-radius:5px;'>"+part[8]+"</span>";
        e+="</div>";
        var box1=new sysmod_box("Error Message:<hr>"+e);
        handler.loadModuleText("error_std|"+part[0],module,"module_errors");
    }
    else
    {
        default_perror_std(err,err2,handler,evt,module);
    }
}
function toggle_box(box_id)
{
    var box=document.getElementById(box_id);
    if(box)
    {
        if(box.style.display!='block')box.style.display='block';
        else box.style.display='none';
    }
    else
    {
        console.log("invalid toggle box id box_id.");
    }
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
