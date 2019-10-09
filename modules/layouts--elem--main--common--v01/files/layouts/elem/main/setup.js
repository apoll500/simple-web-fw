/*******************************************************************************
*                                                                              *
*  standard setup                                                              *
*                                                                              *
*******************************************************************************/
function run_standard_setup_main(content_str,element,style)
{
    //console.log("run_standard_setup_main(\"...\",,"+style+") for "+element.content_token);
    switch(style)
    {
        case "simple":
            return run_standard_setup_main_simple(content_str,element);
        case "plain":
            return run_standard_setup_main_plain(content_str,element);
        default:
            return false;
    }
    return true;
}
/*******************************************************************************
*                                                                              *
*  simple                                                                      *
*                                                                              *
*******************************************************************************/
var nesting=0;
var identation=0;
var item_hcount=0;

var dx;var a;var h;

var fbox=null;
var sfbox=null;
var ssfbox=null;
var sssfbox=null;

var name_of_current_form="";

/*******************************************************************************
*                                                                              *
*  pformbox                                                                    *
*                                                                              *
*******************************************************************************/
var close_form_with_div=false;
var pformbox_toggle_names=[];
function toggel_pformbox(boxid)
{
    if(document.getElementById("pformbox_"+boxid).style.display=="block")
    {
        document.getElementById("pformbox_"+boxid).style.display="none";
        context_store2(0,"pformbox_status_"+boxid,"closed");
        document.getElementById("toggle_img_"+boxid).src="images/uau0i.png";
    }
    else
    {
        document.getElementById("pformbox_"+boxid).style.display="block";
        context_store2(0,"pformbox_status_"+boxid,"");
        document.getElementById("toggle_img_"+boxid).src="images/uad0i.png";
    }
}
function pformbox_toggle_test_name(name)
{
    for(var k=0;k<pformbox_toggle_names.length;k++)
    {
        if(pformbox_toggle_names[k]==name)return true;
    }
    return false;
}
function pformbox_toggle_get_name(name)
{
    var cnt=1;
    var name2=name;
    while(true)
    {
        if(!pformbox_toggle_test_name(name2))
        {
            pformbox_toggle_names.push(name2);
            return name2;
        }
        else if(cnt>100)
        {
            return name+"_err";
        }
        name2=name+"_"+cnt;
        cnt++;
    }
}

var get_form_for_module_forms=[];
var get_form_for_module_modules=[];
function get_form_for_module(module)
{
    for(var i=0;i<get_form_for_module_forms.length;i++)
    {
        if(get_form_for_module_modules[i]==module)
        {
            return get_form_for_module_forms[i];
        }
    }
    return "";
}
function get_module_of_form(form)
{
    for(var i=0;i<get_form_for_module_forms.length;i++)
    {
        if(get_form_for_module_forms[i]==form)
        {
            return get_form_for_module_modules[i];
        }
    }
    return "";
}

//function elements_setup_main_simple(s,object)
function run_standard_setup_main_simple(content_str,element)
{
    get_form_for_module_forms=[];
    get_form_for_module_modules=[];

    pformbox_toggle_names=[];

    var object=element.object;
    var s=content_str;

    //object.onResize();

    var lines=s.split("\n");

    var o="";

    if(typeof object.title != 'undefined')object.title.innerHTML=lines[0]+"<hr>";

    var html_mode=false;

    for(var i=1;i<lines.length;i++)
    {
        if(lines[i]=="BEGIN_HTML")
        {
            html_mode=true;
            if(i<lines.length)i++;
        }
        else if(lines[i]=="END_HTML")
        {
            html_mode=false;
            if(i<lines.length)i++;
        }
        if(!html_mode)
        {
            o=__elements_setup_main_simple_line(o,object,object.content,lines[i],true);
        }
        else
        {
            o+=lines[i]+"\n";
        }
    }
    if(o!="")
    {
        dx=document.createElement("div");
        dx.innerHTML=o;
        if(sssfbox)sssfbox.content.appendChild(dx);
        else if(ssfbox)ssfbox.content.appendChild(dx);
        else if(sfbox)sfbox.content.appendChild(dx);
        else if(fbox)fbox.content.appendChild(dx);
        else object.content.appendChild(dx);
    }
    //CENTERING
    if(object.layout=="center")
    {
        if(object.d2)object.d2.align="center";
    }
    else
    {
        if(object.d2)object.d2.align="left";
    }
    //
    //CHECK FOR DATA
    dataevent_store0();
    dataevent_run();
    //
    //POSTLOAD
    //...
    elements_factory_create_from_accumulator();
    return true;
}

function __elements_setup_main_simple_clean(s,content_box)
{
    var lines=s.split("\n");
    var o="";
    for(var i=1;i<lines.length;i++)
    {
        o=__elements_setup_main_simple_line(o,null,content_box,lines[i],true);
    }
    if(o!="")
    {
        dx=document.createElement("div");
        dx.innerHTML=o;
        if(sssfbox)sssfbox.content.appendChild(dx);
        else if(ssfbox)ssfbox.content.appendChild(dx);
        else if(sfbox)sfbox.content.appendChild(dx);
        else if(fbox)fbox.content.appendChild(dx);
        else content_box.appendChild(dx);
    }
}

function __elements_setup_main_simple_line(o,object,content_box,lines,dosubs)
{
        //-----------------------------------
        //IBOX
        //-----------------------------------
        //console.log("line");
        if(lines=="BEGIN_IBOX")
        {
            o+="<div class='z02'>";
            nesting++;
        }
        else if(lines=="END_IBOX")
        {
            o+="</div>\
            <div style='clear:left;height:10px;'></div>";//border-bottom:1px solid #AAAAAA;
            nesting--;
            if(nesting==0)
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
        }
        //include other texts
        else if(dosubs && lines=="INCLUDE_CALLER_SHOWFORM")
        {
                for(var h=context_sublevel2;h>=0;h--)
                {
                    //console.log("sublevel setup:"+(context_sublevel-h));
                    var m=context_load2(context_sublevel-h,"parent_module","");
                    if(m!="")
                    {
                        var a=global_file_storage.load(baseurl+"content/"+lang+"/"+m+"/show.txt");
                        //console.log("load parent form "+(context_sublevel-h)+": "+m);
                        var a_lines=a.split("\n");
                        var do_print=false;
                        for(var i=1;i<a_lines.length-1;i++)
                        {
                            if(a_lines[i].substr(0,5)=="FORM|")
                            {
                                do_print=true;
                                if(h!=0)
                                {
                                    a=(a_lines[i]+"||").split("|");
                                    a_lines[i]=a[0]+"|"+a[1]+"_"+h+"|"+a[2]+"|"+a[3]+"|"+a[4]+"|"+a[5]+"|"+m+"|PFORM";
                                }
                                else
                                {
                                    a=(a_lines[i]+"||").split("|");
                                    a_lines[i]=a[0]+"|"+a[1]+"|"+a[2]+"|"+a[3]+"|"+a[4]+"|"+a[5]+"|"+m+"|PFORM";
                                }
                            }
                            if(do_print)o=__elements_setup_main_simple_line(o,null,content_box,a_lines[i],false);
                            if(a_lines[i].substr(0,7)=="ENDFORM")do_print=false;
                        }
                    }
                }
                /*
                var parent_module=context_load("parent_module","");
                if(parent_module!="")
                {
                    var a=global_file_storage.load(baseurl+"content/"+lang+"/"+parent_module+"/show.txt");
                    var a_lines=a.split("\n");
                    var do_print=false;
                    for(var i=1;i<a_lines.length-1;i++)
                    {
                        if(a_lines[i].substr(0,5)=="FORM|")do_print=true;
                        if(do_print)o=__elements_setup_main_simple_line(o,null,content_box,a_lines[i],false);
                        if(a_lines[i].substr(0,7)=="ENDFORM")do_print=false;
                    }
                }
                */
        }
        //-----------------------------------
        //LIST
        //-----------------------------------
        else if(lines=="BEGIN_LIST")
        {
            nesting++;
            identation++;
        }
        else if(lines=="END_LIST")
        {
            nesting--;
            identation--;
            if(nesting==0)
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
        }
        //-----------------------------------
        //BOX
        //-----------------------------------
        else if(lines.substr(0,4)=="BOX|")
        {
            a=lines.split("|");
            o+="<div class=\""+a[1]+"\">";
            item_hcount=0;
            nesting++;
        }
        else if(lines.substr(0,6)=="ENDBOX")
        {
            o+="</div>";
            nesting--;
            if(nesting==0)
            {
                a=lines.split("|");
                dx=document.createElement("div");
                dx.innerHTML=o;
                if(a[1]=="TOP")
                {
                    object.title.insertBefore(dx,object.title.firstChild);
                }
                else
                {
                    content_box.appendChild(dx);
                }
                o="";
            }
        }
        //-----------------------------------
        //ANCHOR
        //-----------------------------------
        else if(lines.substr(0,7)=="WINDOW|")
        {
            //console.log("WINDOW");
            a=lines.split("|");
            o+="<div id=\"element_"+a[1]+"\" style=\"visibility:visible;font-size:18pt;\">"+lines+"</div>";
            elements_factory_create_later(a);
        }
        //-----------------------------------
        //HIDDEN
        //-----------------------------------
        else if(lines.substr(0,5)=="HIDE|")
        {
            a=lines.split("|");
            if(a[1]=="memdiv")o+="<div id=\""+a[1]+"\" style=\"visibility:hidden;\">";
            else o+="<div id=\""+a[1]+"\" style=\"visibility:hidden;height:3px;\">";
            nesting++;
        }
        else if(lines.substr(0,7)=="ENDHIDE")
        {
            a=lines.split("|");
            o+="</div>";
            if(a[1]!="none")o+="<div id=\""+a[1]+"\" style=\"visibility:visible;\">"+a[2]+"</div>";
            nesting--;
            if(nesting==0)
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
        }
        //-----------------------------------
        //FORM
        //-----------------------------------
        else if(lines.substr(0,5)=="FORM|")
        {
            //o+=lines+"<hr>";
            a=(lines+"|||").split("|");
            get_form_for_module_forms.push(a[1]);
            get_form_for_module_modules.push(a[6]);
            //console.log("PUSH: "+a[1]+" "+a[6]);
            if(a[7]=="PFORM")
            {
                //o+='<a href="JavaScript:toggel_pformbox(\''+a[6]+'\');" style="text-decoration:none;"><div style="padding-top:14px;background-image:linear-gradient(#CCCCCC,rgba(0,0,0,0));border-top:solid 1px #AAAAAA;text-decoration:none;"><nobr><span class="back_link_phantom">&lt;&lt;</span> <span class="tabnav_link">'+a[6]+'</span> <span class="tabnav_link">show</span> <span class="tabnav_link">edit</span> <span class="tabnav_link">delete</span></nobr></div></a><br>';

                var togglename=pformbox_toggle_get_name(a[6]);

                var disp="block";
                var timg="images/uad0i.png";
                if(context_load2(0,"pformbox_status_"+togglename,"")=="closed")
                {
                    disp="none";
                    timg="images/uau0i.png";
                }
                o+='<div style="padding-top:14px;background-image:linear-gradient(#CCCCCC,rgba(0,0,0,0));border-top:solid 1px #AAAAAA;text-decoration:none;"><nobr><a href="JavaScript:toggel_pformbox(\''+togglename+'\');" style="text-decoration:none;"><span class="back_link_phantom"><img id="toggle_img_'+togglename+'" src="'+timg+'"></span> <span class="tabnav_link_gray">'+a[6]+'</span></a> <a href="JavaScript:mods_run_data(\''+a[6]+'\',\'open_show\',\''+a[1]+'\')"><span class="tabnav_link_gray">open</span></a></nobr></div><br><div style="position:relative;top:-50px;text-align:right;"></div>';
                o+="<div id='pformbox_"+togglename+"' style='display:"+disp+";'>";
                close_form_with_div=true;
            }
            name_of_current_form=a[1];
            o+="<div id='"+a[1]+"_parentdiv' style='position:relative;overflow:auto;'><form";
            if(a[5]!="")o+=" enctype=\""+a[5]+"\"";
            o+=" id=\""+a[1]+"\" name=\""+a[1]+"\" method=\""+a[2]+"\" action=\"JavaScript:mods_"+a[4]+"_run('"+a[3]+"')\">";
            nesting++;
        }
        else if(lines.substr(0,7)=="ENDFORM")
        {
            o+="</form></div>";

            if(close_form_with_div)
            {
                close_form_with_div=false;
                o+="</div>";
            }

            nesting--;
            if(nesting==0)
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
        }
        //ACTIONS
        //DEL
        /*
        else if(lines.substr(0,9)=="LOADDATA|")
        {
            a=lines.split("|");
            e_mbox.loaddata(a[1]);
        }
        */
        //-----------------------------------
        //CONTENT
        //-----------------------------------
        //ITEM
        else if(lines.substr(0,5)=="ITEM|")
        {
            a=lines.split("|");
            o+="<div class='t01'><img src='ball3bbg.gif'> "+a[1]+"</div>";
        }
        //I
        else if(lines.substr(0,2)=="I|")
        {
            a=lines.split("|");
            o+="<div class='t01'><b>"+a[1]+":</b> "+a[2]+"</div>";
        }
        //FLD
        else if(lines.substr(0,4)=="FLD|")
        {
            a=(lines+"||||||").split("|");
            if(a[7].substr(0,1)=="#")
            {
                a[7]=main_handler.user_context.get(a[7].substr(1));
            }
            //Title
            if(a[2]!="")
            {
                if(a[1]=="left")o+=a[2];
                //else o+="<span id=\""+a[6]+"_title\" class=\""+a[1]+"\">"+a[2]+"</span><br>";
                else o+="<div id=\""+name_of_current_form+"_"+a[6]+"_title\" class=\""+a[1]+"\">"+a[2]+"</div>";
            }
            //Input
            if(a[3]=="INPUT")
            {
                if(a[4]=="file")
                {
                    o+="<input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\""+a[12]+"\">";
                }
                o+="<input type=\""+a[4]+"\" name=\""+a[6]+"\" value=\""+a[7]+"\" class=\""+a[5]+"\"";
                if(a[9]!="")o+=" "+a[9]+"=\"mods_"+a[10]+"_run2('"+a[11]+"','"+name_of_current_form+"')\"";
                if(a[8]!="")o+=" "+a[8];
                if(a[12].substr(0,1)=="A")
                {
                    o+=" onChange=\"e_mbox.check_inputs()\"";
                }
                o+=">";
            }
            //Select
            else if(a[3]=="SELECT")
            {
                o+="<select name=\""+a[6]+"\" class=\""+a[5]+"\"";
                if(a[9]!="")o+=" "+a[9]+"=\"mods_"+a[10]+"_run('"+a[11]+"')\"";
                if(a[8]!="")o+=" "+a[8];
                o+=">";
                var opt=a[7].split(",");
                for(var i=0;i<opt.length;i++)
                {
                    var extra="";
                    var opt_value;
                    var opt_text;
                    if(opt[i].substr(0,1)=="+")
                    {
                        extra+=" selected";
                        opt_value=opt[i].substr(1);
                    }
                    else if(opt[i].substr(0,1)=="~")
                    {
                        extra+=" disabled";
                        opt_value=opt[i].substr(1);
                    }
                    else if(opt[i].substr(0,1)=="-" && opt[i].substr(1,1)!="[")
                    {
                        opt_value=opt[i].substr(1);
                    }
                    else
                    {
                        opt_value=opt[i];
                    }
                    var pos=opt_value.search(/\[[a-z|0-9|=|'| |.|\-|_|Ö|Ä|Ü|ö|ä|ü]*\]/i);
                    if(pos!=-1)opt_option=opt_value.slice(pos+1,-1);
                    else opt_option="";

                    opt_value=opt_value.replace(/\[[a-z|0-9|=|'| |.|\-|_|Ö|Ä|Ü|ö|ä|ü]*\]/i,"");
                    opt_text=opt_value;
                    if(opt_option.substr(0,5)=="text=")opt_text=opt_option.slice(6,-1);
                    o+="<option value=\""+opt_value+"\""+extra+">"+opt_text+"</option>";
                }
                o+="</select>";
            }
            //Textarea
            else if(a[3]=="AREA")
            {
                //a[4]
                o+="<textarea name=\""+a[6]+"\" class=\""+a[5]+"\"";
                if(a[9]!="")o+=" "+a[9]+"=\"mods_"+a[10]+"_run('"+a[11]+"')\"";
                if(a[8]!="")o+=" "+a[8];
                o+=">"+a[7]+"</textarea>";
            }
        }
        //LINK
        else if(lines.substr(0,5)=="LINK|")
        {
            a=lines.split("|");
            if(item_hcount>0)o+="&nbsp;|&nbsp;";
            o+="<img src=\"images/"+a[2]+".png\"> <a class=\""+a[1]+"\" href=\"JavaScript:mods_"+a[5]+"_load('"+a[4]+"')\">"+a[3]+"</a>";
            item_hcount++;
        }
        //NL
        else if(lines.substr(0,2)=="NL")
        {
            o+="<br><br>";
            item_hcount=0;
        }
        //GALLERY
        else if(lines.substr(0,7)=="GALLERY")
        {
            a=lines.split("|");
            o+="<div id='"+a[1]+"' style='padding:2px;overflow:auto;'></div>";
        }
        //ERROR
        else if(lines.substr(0,5)=="ERROR")
        {
            o+="ERROR<br>";
        }
        //ANIMBOX
        else if(lines.substr(0,8)=="ANIMBOX|")
        {
            a=lines.split("|");
            var su="";if(a[2]!="")su="_"+a[2];
            if(a[1]=="W")o+="<div id='dcontent"+su+"' style='overflow:auto;'><div style='width:32px;padding:10px;background-color:#FFFFFF;border-radius:10px;box-shadow:3px 3px 2px 2px #CCCCCC;'><img src='images/load.gif'></div></div>";
            else if(a[1]=="H")o+="<div id='dcontent"+su+"' style='height:300px;overflow:auto;'><div style='float:left;padding:10px;background-color:#FFFFFF;border-radius:10px;box-shadow:3px 3px 2px 2px #CCCCCC;'><img src='images/load.gif' id=\"thumbnail\"></div></div>";
            else o+="ERROR<br>";
        }
        //FLAP
        else if(lines.substr(0,5)=="FLAP|")
        {
            if(o!="")
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
            a=lines.split("|");
            h=parseInt(a[2])+object.flapminh;
            if(a.length==7)
            {
                var t="<div style='height:"+(object.flapminh-2)+"px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div>";
                t+="<div class='flap_box_title_f1'>"+a[3]+"</div>";
                t+="<div class='flap_box_title_f2'>"+a[4]+"</div>";
                t+="<div class='flap_box_title_f3'>"+a[5]+"</div>";
                t+="<div class='flap_box_title_f4'>"+a[6]+"</div></div>";
                fbox=new flapbox(content_box,object.flapminh,h,t);
            }
            else
            {
                fbox=new flapbox(content_box,object.flapminh,h,"<div style='height:"+(object.flapminh-2)+"px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div></div>");
            }
            sfbox=null;
            ssfbox=null;
            sssfbox=null;
        }
        else if(lines.substr(0,8)=="SUBFLAP|")
        {
            if(o!="")
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
            a=lines.split("|");
            h=parseInt(a[2])+object.flapminh;
            sfbox=new flapbox(fbox.content,object.flapminh,h,"<div style='height:"+(object.flapminh-2)+"px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div></div>");
            sfbox.parent_flap=fbox;
            ssfbox=null;
            sssfbox=null;
        }
        else if(lines.substr(0,11)=="SUBSUBFLAP|")
        {
            if(o!="")
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
            a=lines.split("|");
            h=parseInt(a[2])+object.flapminh;
            ssfbox=new flapbox(sfbox.content,object.flapminh,h,"<div style='height:"+(object.flapminh-2)+"px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div></div>");
            ssfbox.parent_flap=sfbox;
            sssfbox=null;
        }
        else if(lines.substr(0,14)=="SUBSUBSUBFLAP|")
        {
            if(o!="")
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                content_box.appendChild(dx);
                o="";
            }
            a=lines.split("|");
            h=parseInt(a[2])+object.flapminh;
            sssfbox=new flapbox(ssfbox.content,object.flapminh,h,"<div style='height:"+(object.flapminh-2)+"px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div></div>");
            sssfbox.parent_flap=ssfbox;
        }
        else if(lines.substr(0,7)=="ENDFLAP")
        {
            fbox=null;
            sfbox=null;
            ssfbox=null;
            sssfbox=null;
        }
        //NORMAL PARAGRAPH
        else
        {
            if(identation==0)
            {
                o+=""+lines+"<br>";
            }
            else
            {
                o+="<div style='margin-left:"+(identation*16)+"px;margin-top:-10px;margin-bottom:-10px;'>"+lines+"</div><br>";
            }
            if(nesting==0)
            {
                dx=document.createElement("div");
                dx.innerHTML=o;
                if(sssfbox)sssfbox.content.appendChild(dx);
                else if(ssfbox)ssfbox.content.appendChild(dx);
                else if(sfbox)sfbox.content.appendChild(dx);
                else if(fbox)fbox.content.appendChild(dx);
                else content_box.appendChild(dx);
                o="";
            }
        }
    return o;
}
/*******************************************************************************
*                                                                              *
*  plain                                                                       *
*                                                                              *
*******************************************************************************/
//function elements_setup_main_plain(s,object)
function run_standard_setup_main_plain(content_str,element)
{
    var object=element.object;
    var s=content_str;

    var lines=s.split("\n");

    var o="";
    var item_hcount=0;
    var html_mode=false;

    for(var i=1;i<lines.length;i++)
    {
        if(lines[i]=="BEGIN_HTML")
        {
            html_mode=true;
            if(i<lines.length)i++;
        }
        else if(lines[i]=="END_HTML")
        {
            html_mode=false;
            if(i<lines.length)i++;
        }
        if(!html_mode)
        {
            //-----------------------------------
            //IBOX
            //-----------------------------------
            if(lines[i]=="BEGIN_IBOX")
            {
            }
            else if(lines[i]=="END_IBOX")
            {
            }
            //-----------------------------------
            //LIST
            //-----------------------------------
            else if(lines[i]=="BEGIN_LIST")
            {
                o+="<ul>";
            }
            else if(lines[i]=="END_LIST")
            {
                o+="</ul>";
            }
            //-----------------------------------
            //BOX
            //-----------------------------------
            else if(lines[i].substr(0,4)=="BOX|")
            {
                o+="<div>";
                item_hcount=0;
            }
            else if(lines[i].substr(0,6)=="ENDBOX")
            {
                o+="</div>";
            }
            //-----------------------------------
            //ANCHOR
            //-----------------------------------
            else if(lines[i].substr(0,7)=="WINDOW|")
            {
                a=lines[i].split("|");
                o+="<div id=\"element_"+a[1]+"\" style=\"visibility:visible;font-size:18pt;\">"+lines[i]+"</div>";
                elements_factory_create_later(a);
            }
            //-----------------------------------
            //HIDDEN
            //-----------------------------------
            else if(lines[i].substr(0,5)=="HIDE|")
            {
                a=lines[i].split("|");
                if(a[1]=="memdiv")o+="<div id=\""+a[1]+"\" style=\"visibility:hidden;\">";
                else o+="<div id=\""+a[1]+"\" style=\"visibility:hidden;height:3px;\">";
            }
            else if(lines[i].substr(0,7)=="ENDHIDE")
            {
                a=lines[i].split("|");
                o+="</div>";
                if(a[1]!="none")o+="<div id=\""+a[1]+"\" style=\"visibility:visible;\">"+a[2]+"</div>";
            }
            //-----------------------------------
            //FORM
            //-----------------------------------
            else if(lines[i].substr(0,5)=="FORM|")
            {
                a=lines[i].split("|");
                o+="<form";
                if(a[5]!="")o+=" enctype=\""+a[5]+"\"";
                o+=" id=\""+a[1]+"\" name=\""+a[1]+"\" method=\""+a[2]+"\" action=\"JavaScript:mods_"+a[4]+"_run('"+a[3]+"')\">";
            }
            else if(lines[i].substr(0,7)=="ENDFORM")
            {
                o+="</form>";
            }
            //-----------------------------------
            //CONTENT
            //-----------------------------------
            //ITEM
            else if(lines[i].substr(0,5)=="ITEM|")
            {
                a=lines[i].split("|");
                o+="<li>"+a[1]+"</li>";
            }
            //I
            else if(lines[i].substr(0,2)=="I|")
            {
                a=lines[i].split("|");
                o+="<li><b>"+a[1]+":</b> "+a[2]+"</li>";
            }
            //FLD
            else if(lines[i].substr(0,4)=="FLD|")
            {
                a=lines[i].split("|");
                if(a[7].substr(0,1)=="#")
                {
                    a[7]=main_handler.user_context.get(a[7].substr(1));
                }
                //Title
                if(a[2]!="")
                {
                    if(a[1]=="left")o+=a[2]+" ";
                    else o+="<span class=\""+a[1]+"\">"+a[2]+"</span><br>";
                }
                //Input
                if(a[3]=="INPUT")
                {
                    o+="<input type=\""+a[4]+"\" name=\""+a[6]+"\" value=\""+a[7]+"\"";
                    if(a[9]!="")o+=" "+a[9]+"=\"mods_"+a[10]+"_run('"+a[11]+"')\"";
                    if(a[8]!="")o+=" "+a[8];
                    o+=">";
                }
                //Select
                else if(a[3]=="SELECT")
                {
                    o+="<select name=\""+a[6]+"\"";
                    if(a[9]!="")o+=" "+a[9]+"=\"mods_"+a[10]+"_run('"+a[11]+"')\"";
                    if(a[8]!="")o+=" "+a[8];
                    o+=">";
                    var opt=a[7].split(",");
                    for(var k=0;k<opt.length;k++)
                    {
                        var extra="";
                        var opt_value;
                        var opt_text;
                        if(opt[k].substr(0,1)=="+")
                        {
                            extra+=" selected";
                            opt_value=opt[k].substr(1);
                        }
                        else if(opt[k].substr(0,1)=="~")
                        {
                            extra+=" disabled";
                            opt_value=opt[k].substr(1);
                        }
                        else if(opt[k].substr(0,1)=="-")
                        {
                            opt_value=opt[k].substr(1);
                        }
                        else
                        {
                            opt_value=opt[k];
                        }
                        var pos=opt_value.search(/\[[a-z|0-9|=|'| |.|\-|_]*\]/i);
                        if(pos!=-1)opt_option=opt_value.slice(pos+1,-1);
                        else opt_option="";
                        
                        opt_value=opt_value.replace(/\[[a-z|0-9|=|'| |.|\-|_]*\]/i,"");
                        opt_text=opt_value;
                        if(opt_option.substr(0,5)=="text=")opt_text=opt_option.slice(6,-1);
                        o+="<option value=\""+opt_value+"\""+extra+">"+opt_text+"</option>";
                    }
                    o+="</select>";
                }
                //Textarea
                else if(a[3]=="AREA")
                {
                    //a[4]
                    o+="<textarea name=\""+a[6]+"\"";
                    if(a[9]!="")o+=" "+a[9]+"=\"mods_"+a[10]+"_run('"+a[11]+"')\"";
                    if(a[8]!="")o+=" "+a[8];
                    o+=">"+a[7]+"</textarea>";
                }
            }
            //LINK
            else if(lines[i].substr(0,5)=="LINK|")
            {
                a=lines[i].split("|");
                if(item_hcount>0)o+="&nbsp;|&nbsp;";
                o+="<img src=\"images/"+a[2]+".png\"> <a href=\"JavaScript:mods_"+a[5]+"_load('"+a[4]+"')\">"+a[3]+"</a>";
                item_hcount++;
            }
            //NL
            else if(lines[i].substr(0,2)=="NL")
            {
                o+="<br><br>";
                item_hcount=0;
            }
            //ERROR
            else if(lines[i].substr(0,5)=="ERROR")
            {
                o+="ERROR<br>";
            }
            //ANIMBOX
            else if(lines[i].substr(0,8)=="ANIMBOX|")
            {
                a=lines[i].split("|");
                var su="";if(a[2]!="")su="_"+a[2];
                if(a[1]=="W")o+="<div id='dcontent"+su+"' style='overflow:auto;'><div style='width:32px;padding:10px;background-color:#FFFFFF;border-radius:10px;box-shadow:3px 3px 2px 2px #CCCCCC;'><img src='images/load.gif'></div></div>";
                else if(a[1]=="H")o+="<div id='dcontent"+su+"' style='height:300px;overflow:auto;'><div style='float:left;padding:10px;background-color:#FFFFFF;border-radius:10px;box-shadow:3px 3px 2px 2px #CCCCCC;'><img src='images/load.gif' id=\"thumbnail\"></div></div>";
                else o+="ERROR<br>";
            }
            //FLAP
            else if(lines[i].substr(0,5)=="FLAP|")
            {
                a=lines[i].split("|");
                o+="<div style='margin-left:50px;'>"+a[1]+"</div>";
            }
            else if(lines[i].substr(0,8)=="SUBFLAP|")
            {
                a=lines[i].split("|");
                o+="<div style='margin-left:100px;'>"+a[1]+"</div>";
            }
            else if(lines[i].substr(0,11)=="SUBSUBFLAP|")
            {
                a=lines[i].split("|");
                o+="<div style='margin-left:150px;'>"+a[1]+"</div>";
            }
            else if(lines[i].substr(0,14)=="SUBSUBSUBFLAP|")
            {
                a=lines[i].split("|");
                o+="<div style='margin-left:200px;'>"+a[1]+"</div>";
            }
            else if(lines[i].substr(0,7)=="ENDFLAP")
            {
            }
            //NORMAL PARAGRAPH
            else o+=""+lines[i]+"<br>";
        }
        else
        {
            o+=lines[i];
        }
    }
    o="<h1>"+lines[0]+"</h1>"+o+"";
    object.box.innerHTML=o;
    //
    //CHECK FOR DATA
    dataevent_store0();
    dataevent_run();
    //
    //POSTLOAD
    //...
    elements_factory_create_from_accumulator();
    return true;
}

main_loader.ready();
