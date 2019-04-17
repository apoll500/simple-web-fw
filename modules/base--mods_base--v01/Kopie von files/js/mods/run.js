
//(0)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function run(token)
{
    switch(token)
    {
        default:
            new sysmod_box("run()<br>unknown token:<br>"+token);
    }
}
//(1)---------------------------------------------------------------------------
// running a module command
//------------------------------------------------------------------------------
function mods_run(module,token)
{
    mods_run_data(module,token,"");
}
function mods_run_data(module,token,data)
{
    dataevent_reset(1);
    if(typeof window["mods_"+module+"_run"] == 'function')window["mods_"+module+"_run2"](token,data);
}
/*
function mods_run_form(module,token,formular)
{
    mods_run_data(module,token,collectData(formular));
}
*/

//(1)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function save_form(next,module,area,command,formular)
{
    formdata="";
    for(var i=0;i<document.forms[formular].elements.length;i++)
    {
        if(document.forms[formular].elements[i].type=="checkbox")
        {
            //formdata+="&"+document.forms[formular].elements[i].name+"="+btoa(document.forms[formular].elements[i].checked);
            formdata+="&"+document.forms[formular].elements[i].name+"="+encode_b64(document.forms[formular].elements[i].checked);
        }
        else
        {
            //formdata+="&"+document.forms[formular].elements[i].name+"="+btoa(document.forms[formular].elements[i].value);
            formdata+="&"+document.forms[formular].elements[i].name+"="+encode_b64(document.forms[formular].elements[i].value);
        }
    }
    main_handler.onClick(next+"||"+module,"area="+area+"&comm="+module+"_"+command+formdata);
}
function save_form2(next,module,area,command,formular,extra_data)
{
    formdata="";
    for(var i=0;i<document.forms[formular].elements.length;i++)
    {
        if(document.forms[formular].elements[i].type=="checkbox")
        {
            //formdata+="&"+document.forms[formular].elements[i].name+"="+btoa(document.forms[formular].elements[i].checked);
            formdata+="&"+document.forms[formular].elements[i].name+"="+encode_b64(document.forms[formular].elements[i].checked);
        }
        else
        {
            //formdata+="&"+document.forms[formular].elements[i].name+"="+btoa(document.forms[formular].elements[i].value);
            formdata+="&"+document.forms[formular].elements[i].name+"="+encode_b64(document.forms[formular].elements[i].value);
        }
    }
    main_handler.onClick(next+"||"+module,"area="+area+"&comm="+module+"_"+command+formdata+extra_data);
}
function run_form(next,module,area,command,formular,context)
{
    formdata="";
    for(var i=0;i<document.forms[formular].elements.length;i++)
    {
        if(document.forms[formular].elements[i].type=="checkbox")
        {
            //formdata+="&"+document.forms[formular].elements[i].name+"="+btoa(document.forms[formular].elements[i].checked);
            formdata+="&"+document.forms[formular].elements[i].name+"="+encode_b64(document.forms[formular].elements[i].checked);
        }
        else
        {
            //formdata+="&"+document.forms[formular].elements[i].name+"="+btoa(document.forms[formular].elements[i].value);
            formdata+="&"+document.forms[formular].elements[i].name+"="+encode_b64(document.forms[formular].elements[i].value);
        }
    }
    main_handler.onClick(next+"|"+context+"|"+module,"area="+area+"&comm="+module+"_"+command+formdata);
}
//(1)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
/*
function _mods_run_form(module,area,comm,formular,func,context)
{
    main_handler.onClick(func+"|"+context+"|"+module,"area="+area+"&comm="+module+"_"+comm+"&"+collectData(formular));
}
function _mods_run_data(module,area,comm,data,func,context)
{
    var x="";if(data!="")x="&";
    main_handler.onClick(func+"|"+context+"|"+module,"area="+area+"&comm="+module+"_"+comm+x+data);
}
*/
//(2)---------------------------------------------------------------------------
//------------------------------------------------------------------------------
function collectData(formular)
{
    var formdata="";
    for(var i=0;i<document.forms[formular].length;i++)
    {
        if(document.forms[formular].elements[i].type=="radio")
        {
            if(document.forms[formular].elements[i].checked==true)
            {
                formdata+=document.forms[formular].elements[i].getAttribute("name");
                formdata+=":";
                formdata+=encode_b64(document.forms[formular].elements[i].value);
                formdata+="-";
            }
        }
        else if(document.forms[formular].elements[i].type!="button")
        {
            formdata+=document.forms[formular].elements[i].getAttribute("name");
            formdata+=":";
            if(document.forms[formular].elements[i].type=="text")
            {
                formdata+=encode_b64(document.forms[formular].elements[i].value);
            }
            else if(document.forms[formular].elements[i].type=="password")
            {
                formdata+=encode_b64(document.forms[formular].elements[i].value);
            }
            else if(document.forms[formular].elements[i].type=="textarea")
            {
                formdata+=encode_b64(document.forms[formular].elements[i].value);
            }
            else if(document.forms[formular].elements[i].type=="hidden")
            {
                formdata+=encode_b64(document.forms[formular].elements[i].value);
            }
            formdata+="-";
        }
    }
    return formdata;
}
var translate_user_input_last_error_status=0;
function translate_user_input(str,format)
{
    return translate_user_input2(str,format,false);
}
function translate_user_input2(str,format,showerr)
{
    translate_user_input_last_error_status=0;
    var a=(format+"~~~~~~").split("~");
    if(a[0]=="A")
    {
        if(a[1]=="number")
        {
            var d=(a[2]+".").split(".");
            var maxl;
            var maxr;
            var allow_sign=false;
            if(d[0].substr(0,1)=="s")
            {
                allow_sign=true;
                d[0]=d[0].substr(1);
            }
            if(d[0]=="n")
            {
                maxl=9;//staying save with 32bit integers.
            }
            else
            {
                maxl=d[0].length;
            }
            maxr=d[1].length;
            str2=translate_ui_fixed(str,allow_sign,maxl,maxr);
            if(str2.substr(0,2)=="E:")
            {
                if(showerr)
                {
                    sysmod_box("WARNING:<br>Invalid Data Detected!<hr>Stored value: "+str+"<br>"+str2);
                }
                translate_user_input_last_error_status=1;
            }
            str=str2;
            var min;
            var max;
            var num;
            var pt=a[4];
            if(pt="f")
            {
                max=parseFloat(a[5]);
                min=parseFloat(a[6]);
                num=parseFloat(str);
                if(num<min || num>max)
                {
                    if(num<min)num=min;
                    else if(num>max)num=max;
                    if(showerr)
                    {
                        sysmod_box("WARNING:<br>Invalid Data Detected!<hr>stored value: "+str+"<br>allowed values: from "+min+" to "+max+"");
                    }
                    translate_user_input_last_error_status=1;
                    str=""+num;
                }
            }
            else if(pt="i")
            {
                max=parseInt(a[5]);
                min=parseInt(a[6]);
                num=parseFloat(str);
                if(num<min || num>max)
                {
                    if(num<min)num=min;
                    else if(num>max)num=max;
                    if(showerr)
                    {
                        sysmod_box("WARNING:<br>Invalid Data Detected!<hr>stored value: "+str+"<br>allowed values: from "+min+" to "+max+"");
                    }
                    translate_user_input_last_error_status=1;
                    str=""+num;
                }
            }
        }
    }
    return str;
}
function translate_ui_float(str)
{
    var o="";
    var mode="sign";
    for(var i=0;i<str.length;i++)
    {
        var ch=str.substr(i,1);
        if(mode=="sign")
        {
            if(ch=="-")
            {
                o+=ch;
                mode="digits";
            }
            else if(ch=="+")
            {
                mode="digits";
            }
            else if(ch.charCodeAt(0)>="0".charCodeAt(0) && ch.charCodeAt(0)<="9".charCodeAt(0))
            {
                o+=ch;
                mode="digits";
            }
            else
            {
                //ignore char
            }
        }
        else if(mode=="digits")
        {
            if(ch.charCodeAt(0)>="0".charCodeAt(0) && ch.charCodeAt(0)<="9".charCodeAt(0))
            {
                o+=ch;
            }
            else if(ch=="." || ch==",")
            {
                o+=".";
                mode="right";
            }
            else
            {
                //ignore char
            }
        }
        else if(mode=="right")
        {
            if(ch.charCodeAt(0)>="0".charCodeAt(0) && ch.charCodeAt(0)<="9".charCodeAt(0))
            {
                o+=ch;
            }
            else if(ch=="." || ch==",")
            {
                mode="error";
                break;
            }
            else
            {
                //ignore char
            }
        }
    }
    if(mode=="error")
    {
        return "error";
    }
    return o;
}
function translate_ui_fixed(str,allow_sign,maxl,maxr)
{
    var o="";
    var mode="sign";
    var info="";
    var l=0;
    var r=0;
    var dotfound=false;
    if(!allow_sign)
    {
        mode="left_digits";
    }
    if(str.substr(0,2)=="E:")
    {
        return str;
    }
    for(var i=0;i<str.length;i++)
    {
        var ch=str.substr(i,1);
        if(mode=="sign")
        {
            if(ch=="-")
            {
                o+=ch;
                mode="left_digits";
            }
            else if(ch=="+")
            {
                mode="left_digits";
            }
            else if(ch.charCodeAt(0)>="0".charCodeAt(0) && ch.charCodeAt(0)<="9".charCodeAt(0))
            {
                o+=ch;
                l++;
                mode="left_digits";
            }
            else
            {
                //ignore char
            }
        }
        else if(mode=="left_digits")
        {
            if(ch.charCodeAt(0)>="0".charCodeAt(0) && ch.charCodeAt(0)<="9".charCodeAt(0))
            {
                if(l<maxl)
                {
                    o+=ch;
                    l++;
                }
                else
                {
                    mode="error";
                    info="E:number to large (to many digits)";
                    break;
                }
            }
            else if(ch=="." || ch==",")
            {
                if(maxr>0)o+=".";
                mode="right_digits";
                dotfound=true;
            }
            else
            {
                //ignore char
            }
        }
        else if(mode=="right_digits")
        {
            if(ch.charCodeAt(0)>="0".charCodeAt(0) && ch.charCodeAt(0)<="9".charCodeAt(0))
            {
                if(r<maxr)
                {
                    o+=ch;
                    r++;
                }
                else
                {
                    //ignore digit
                }
            }
            else if(ch=="." || ch==",")
            {
                mode="error";
                info="E:more than one decimal point";
                break;
            }
            else
            {
                //ignore char
            }
        }
    }
    if(l==0)
    {
        o+="0";
    }
    if(!dotfound && maxr>0)
    {
        o+=".";
    }
    for(var i=r;i<maxr;i++)
    {
        o+="0";
    }
    if(mode=="error")
    {
        return info;
    }
    return o;
}

main_loader.ready();
