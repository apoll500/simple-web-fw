//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
main_loader.load("js/parser/reader.js");
main_loader.load("js/http/storage.js");
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function httpGetSetup(url,element)
{
    httpSendGetMessage(url,receive_text,element,"null");
}
function httpPostSetup(url,data,element)
{
    httpSendPostMessage(url,data,receive_text,element,"null");
}
function httpGetAsync(url,callback,element)
{
    httpSendGetMessage(url,callback,element,"null");
}
function httpPostAsync(url,data,callback,element)
{
    httpSendPostMessage(url,data,callback,element,"null");
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function httpSendGetMessage(url,callback,element,type)
{
    filedata=global_file_storage.load(url);
    if(filedata!="")
    {
        callback(filedata,element,type);
        return;
    }
    var original_url=url;
    
    if(url.substr(url.length-4)==".txt" || url.substr(url.length-4)==".wgd")
    {
        url=url+"?r="+Math.random();
    }
    //console.log(url);
    
    http_begin(url);
    var r=new XMLHttpRequest();
    var pc=pagecount;
    r.onreadystatechange=
            function()
            {
                loadcount=pc;
                if(r.readyState==4)
                {
                    http_end(url);
                    if(r.status==200)
                    {
                        global_file_storage.store_file(original_url,r.responseText);
                        if(pc==pagecount)
                        {
                            callback(r.responseText,element,type);
                        }
                        else
                        {
                            console.log("--> ignoring file "+url);
                        }
                    }
                    else
                    {
                        if(pc==pagecount)
                        {
                            callback("ERROR "+r.status+"\n\n<span style='padding:20px;padding-top:32px;color:#FFFFAA;background-color:#FFAA77;border-radius:15px;'><span style='font-size:24pt;color:#FFAA77;background-color:#FFFFAA;border-radius:5px;'>&#x26a0;</span> File Not Found!</span>\n\n\n<b>Location:</b>\n"+url+"\n\n<hr>\n<a href='JavaScript:history.go(-1);'>&#x21E6; back</a>\n\n",element,type);
                        }
                        else
                        {
                            console.log("--> ignoring file "+url);
                        }
                    }
                }
            };
    r.open("GET",url,true);
    r.send(null);
    
    var infobox=null;
    var loadcheckfunction=function()
    {
        if(pc==pagecount && pc!=loadcount)
        {
            if(infobox==null)infobox=new sysmod_box("waiting for response<hr><img src='images/load.gif'><br>");
            setTimeout(loadcheckfunction,1000);
        }
        else
        {
            if(infobox!=null)
            {
                infobox.destroy();
                infobox=null;
            }
        }
    };
    setTimeout(loadcheckfunction,1000);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function httpSendPostMessage(url,data,callback,element,type)
{
    filedata=global_file_storage.load(url+"?"+data);
    if(filedata!="")
    {
        callback(filedata,element,type);
        return;
    }
    var original_data=data;

    if(data=="")
    {
        data="r="+Math.random();
    }
    //console.log(url+" -- "+data);
    
    http_begin(url);
    var r=new XMLHttpRequest();
    var pc=pagecount;
    r.onreadystatechange=
            function()
            {
                loadcount=pc;
                if(r.readyState==4)
                {
                    http_end(url);
                    if(r.status==200)
                    {
                        global_file_storage.store_file(url+"?"+original_data,r.responseText);
                        if(pc==pagecount)
                        {
                            callback(r.responseText,element,type);
                        }
                        else
                        {
                            console.log("--> ignoring file "+url);
                        }
                    }
                    else
                    {
                        if(pc==pagecount)
                        {
                            callback("ERROR "+r.status+"\n\n<span style='padding:20px;padding-top:30px;color:#FFFFAA;background-color:#FFAA77;border-radius:15px;'><span style='font-size:24pt;color:#FFAA77;background-color:#FFFFAA;border-radius:5px;'>&#x26a0;</span> File Not Found!</span>\n\n\n<b>Location:</b>\n"+url+"\n\n<hr>\n<a href='JavaScript:history.go(-1);'>&#x21E6; back</a>\n\n",element,type);
                        }
                        else
                        {
                            console.log("--> ignoring file "+url);
                        }
                    }
                }
            };
    r.open("POST",url,true);
    r.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    r.send(data);
    
    var infobox=null;
    var loadcheckfunction=function()
    {
        if(pc==pagecount && pc!=loadcount)
        {
            if(infobox==null)infobox=new sysmod_box("waiting for response<hr><img src='images/load.gif'><br>");
            setTimeout(loadcheckfunction,1000);
        }
        else
        {
            if(infobox!=null)
            {
                infobox.destroy();
                infobox=null;
            }
        }
    };
    setTimeout(loadcheckfunction,1000);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function receive_text(text,element,_unused)
{
    var r=new Reader(text,text.length);
    var ch=0;
    var s="";
    while(ch!=-1)
    {
        ch=r.get();
        
        //work around -- escape double-quotes (if not jet escaped).
        if(ch=="\""
            && typeof element.vars_context == 'object'
            && element.vars_context.load("$mode")=="text"
            && s.slice(-1)!="\\")
        {
            s+="\\";
        }
        
        if(ch!=-1)s+=ch;
    }

    //replace variables
    if(typeof element.vars_context == 'object')
    {
        if(element.vars_context.load("$mode")=="text")
        {
            var parser=new varparser();
            parser.setup();
            parser.parse2("$text=\""+s+"\";",element.vars_context);
            s=element.vars_context.load("$text");
            element.vars_context.store("$mode","null");
        }
    }
    
    element.setup(s);
}
function receive_message(message,element,type)
{
    var r=new Reader(message,message.length);
    var ch=0;
    var s="";
    while(ch!=-1)
    {
        ch=r.get();
        if(ch!=-1)s+=ch;
    }
    element.onEvent(type,s);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var http_request_counter=0;
var http_statusbar_delay=0;
function http_begin(url)
{
    if(http_request_counter==0)
    {
        document.getElementById("fix_microloader_background").style.visibility="visible";
        document.getElementById("fix_microloader_satus").style.visibility="visible";
        http_statusbar_delay=0;
    }
    http_request_counter++;
    //console.log("begin("+http_request_counter+"): "+url);
    document.getElementById("fix_microloader_satus").style.width=Math.floor(100/10*(10-http_request_counter))+"%";
}
function http_end(url)
{
    http_request_counter--;
    //console.log("  end("+http_request_counter+"): "+url);
    if(http_request_counter>=0)
    {
        http_statusbar_delay+=100;
        var status=100/10*(10-http_request_counter);
        setTimeout(function()
                {
                    document.getElementById("fix_microloader_satus").style.width=Math.floor(status)+"%";
                },http_statusbar_delay);
    }
    if(http_request_counter==0)
    {
        http_statusbar_delay+=100;
        setTimeout(function()
                {
                    document.getElementById("fix_microloader_background").style.visibility="hidden";
                    document.getElementById("fix_microloader_satus").style.visibility="hidden";
                },http_statusbar_delay);
    }
}

main_loader.ready();
