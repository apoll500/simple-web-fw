//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function fmain_simple(pdiv,adiv)
{
    this.layout="left";
    this.rstyle="null";
    
    this.d0=document.createElement("div");
    this.d1=document.createElement("div");
    this.d2=document.createElement("div");
    this.d3=document.createElement("div");
    this.d4=document.createElement("div");
    this.title=document.createElement("div");
    this.content=document.createElement("div");
    this.d0.className="simple_box_d0";
    //this.d1.className="simple_box_d1_maxi";
    //this.d2.className="simple_box_d2_maxi";
    //this.d3.className="simple_box_d3_maxi";
    this.d4.align="left";
    this.title.className="simple_box_title";
    this.d0.appendChild(this.d1);
    this.d1.appendChild(this.d2);
    this.d2.appendChild(this.d3);
    this.d3.appendChild(this.d4);
    this.d4.appendChild(this.title);
    this.d4.appendChild(this.content);
    
    pdiv.appendChild(this.d0);
    main_elements_add(this);
    
//public:
    this.destroy=function()
    {
        main_elements_remove(this);
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
        switch(type)
        {
            case "resize":
                this.onResize();
                break;
        }
    }
    this.preset=function()
    {
        var o="\
        <div align='center'>\
            loading...\
        </div>";
        this.title.innerHTML=o;
        this.content.innerHTML="";
        this.onResize();
    }
    this.mbox=function()
    {
        return this.d4;
    }
    
//private:
    this.onResize=function()
    {
        //console.log(screenx);
        var w=parseInt(adiv.left_admin_box.anim_width);
        if(screenx<680+w)
        {
            this.rstyle="mini";
            this.d1.className="simple_box_d1_mini";
            this.d2.className="simple_box_d2_mini";
            this.d3.className="simple_box_d3_mini";
        }
        else
        {
            this.rstyle="maxi";
            this.d1.className="simple_box_d1_maxi";
            this.d2.className="simple_box_d2_maxi";
            this.d3.className="simple_box_d3_maxi";
        }
        this.d0.style.marginLeft=w+"px";
        this.d0.style.width=(screenx-w)+"px";
        this.d0.style.height=(screeny-32)+"px";
    }
    this.animate=function(p)
    {
        //this.onResize();
    }
    this.end_anim=function()
    {
        this.onResize();
    }
    this.update=function()
    {
    }
    this.setup=function(s)
    {
        this.onResize();
        
        var o="";
        var nesting=0;
        var lines=s.split("\n");
        var dx;
        var a;var h;
        var item_hcount=0;
        var fbox=null;
        var sfbox=null;
        var ssfbox=null;
        var sssfbox=null;
        
        this.title.innerHTML=lines[0]+"<hr>";
        
        for(var i=1;i<lines.length;i++)
        {
            //BEGIN-TAGS
            if(lines[i]=="BEGIN_IBOX")
            {
                o+="<div class='z02'>";
                nesting++;
            }
            else if(lines[i]=="BEGIN_LIST")
            {
                nesting++;
            }
            //END-TAGS
            else if(lines[i]=="END_IBOX")
            {
                o+="</div>\
                <div style='clear:left;height:10px;'></div>";//border-bottom:1px solid #AAAAAA;
                nesting--;
                if(nesting==0)
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
            }
            else if(lines[i]=="END_LIST")
            {
                nesting--;
                if(nesting==0)
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
            }
            //ACTIONS
            //DEL
            /*
            else if(lines[i].substr(0,9)=="LOADDATA|")
            {
                a=lines[i].split("|");
                e_mbox.loaddata(a[1]);
            }
            */
            //CONTENT
            else if(lines[i].substr(0,5)=="ITEM|")
            {
                a=lines[i].split("|");
                o+="<div class='t01'><img src='ball3bbg.gif'> "+a[1]+"</div>";
            }
            else if(lines[i].substr(0,2)=="I|")
            {
                a=lines[i].split("|");
                o+="<div class='t01'><b>"+a[1]+":</b> "+a[2]+"</div>";
            }
            //BOX
            else if(lines[i].substr(0,4)=="BOX|")
            {
                a=lines[i].split("|");
                o+="<div class=\""+a[1]+"\">";
                item_hcount=0;
                nesting++;
            }
            else if(lines[i].substr(0,6)=="ENDBOX")
            {
                o+="</div>";
                nesting--;
                if(nesting==0)
                {
                    a=lines[i].split("|");
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    if(a[1]=="TOP")
                    {
                        this.title.insertBefore(dx,this.title.firstChild);
                    }
                    else
                    {
                        this.content.appendChild(dx);
                    }
                    o="";
                }
            }
            //HIDDEN
            else if(lines[i].substr(0,5)=="HIDE|")
            {
                //a=lines[i].split("|");
                o+="<div id=\"memdiv\" style=\"visibility:hidden;\">";
                nesting++;
            }
            else if(lines[i].substr(0,7)=="ENDHIDE")
            {
                o+="</div><div id=\"prediv\" style=\"visibility:visible;\">loading...</div>";
                nesting--;
                if(nesting==0)
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
            }
            //FORM
            else if(lines[i].substr(0,5)=="FORM|")
            {
                a=lines[i].split("|");
                o+="<form name=\""+a[1]+"\" method=\""+a[2]+"\" action=\"JavaScript:mods_"+a[4]+"_run('"+a[3]+"')\">";
                nesting++;
            }
            else if(lines[i].substr(0,7)=="ENDFORM")
            {
                o+="</form>";
                nesting--;
                if(nesting==0)
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
            }
            //ELEMENTS
            else if(lines[i].substr(0,4)=="FLD|")
            {
                a=lines[i].split("|");
                //Title
                if(a[2]!="")
                {
                    if(a[1]=="left")o+=a[2];
                    else o+="<span class=\""+a[1]+"\">"+a[2]+"</span><br>";
                }
                //Input
                if(a[3]=="INPUT")
                {
                    o+="<input type=\""+a[4]+"\" name=\""+a[6]+"\" value=\""+a[7]+"\" class=\""+a[5]+"\"";
                    if(a[8]!="")o+=" "+a[8];
                    o+=">";
                }
            }
            else if(lines[i].substr(0,5)=="LINK|")
            {
                a=lines[i].split("|");
                if(item_hcount>0)o+="&nbsp;|&nbsp;";
                o+="<img src=\"images/"+a[2]+".png\"> <a class=\""+a[1]+"\" href=\"JavaScript:mods_"+a[5]+"_load('"+a[4]+"')\">"+a[3]+"</a>";
                item_hcount++;
            }
            else if(lines[i].substr(0,2)=="NL")
            {
                o+="<br><br>";
                item_hcount=0;
            }
            else if(lines[i].substr(0,5)=="FLAP|")
            {
                if(o!="")
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
                a=lines[i].split("|");
                h=parseInt(a[2]);
                if(a.length==7)
                {
                    var t="<div style='height:18px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div>";
                    t+="<div class='flap_box_title_f1'>"+a[3]+"</div>";
                    t+="<div class='flap_box_title_f2'>"+a[4]+"</div>";
                    t+="<div class='flap_box_title_f3'>"+a[5]+"</div>";
                    t+="<div class='flap_box_title_f4'>"+a[6]+"</div></div>";
                    fbox=new flapbox(this.content,20,h,t);
                }
                else
                {
                    fbox=new flapbox(this.content,20,h,"<div style='height:18px;float:clear;'><div class='flap_box_title_f0'>"+a[1]+"</div></div>");
                }
                sfbox=null;
                ssfbox=null;
                sssfbox=null;
            }
            else if(lines[i].substr(0,8)=="SUBFLAP|")
            {
                if(o!="")
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
                a=lines[i].split("|");
                h=parseInt(a[2]);
                sfbox=new flapbox(fbox.content,20,h,"<div style='height:18px;'>"+a[1]+"</div>");
                sfbox.parent_flap=fbox;
                ssfbox=null;
                sssfbox=null;
            }
            else if(lines[i].substr(0,11)=="SUBSUBFLAP|")
            {
                if(o!="")
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
                a=lines[i].split("|");
                h=parseInt(a[2]);
                ssfbox=new flapbox(sfbox.content,20,h,a[1]);
                ssfbox.parent_flap=sfbox;
                sssfbox=null;
            }
            else if(lines[i].substr(0,14)=="SUBSUBSUBFLAP|")
            {
                if(o!="")
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    this.content.appendChild(dx);
                    o="";
                }
                a=lines[i].split("|");
                h=parseInt(a[2]);
                sssfbox=new flapbox(ssfbox.content,20,h,a[1]);
                sssfbox.parent_flap=ssfbox;
            }
            else if(lines[i].substr(0,7)=="ENDFLAP")
            {
                fbox=null;
                sfbox=null;
                ssfbox=null;
                sssfbox=null;
            }
            else
            {
                o+=""+lines[i]+"<br>";
                if(nesting==0)
                {
                    dx=document.createElement("div");
                    dx.innerHTML=o;
                    if(sssfbox)sssfbox.content.appendChild(dx);
                    else if(ssfbox)ssfbox.content.appendChild(dx);
                    else if(sfbox)sfbox.content.appendChild(dx);
                    else if(fbox)fbox.content.appendChild(dx);
                    else this.content.innerHTML+=o;//appendChild(dx);
                    o="";
                }
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
            else this.content.innerHTML+=o;//appendChild(dx);
        }
        if(this.layout=="left")
        {
        }
        else
        {
            this.d2.align="center";
        }
        //
        //CHECK FOR DATA
        pagedata_loaded=pagedata_loaded | 1;
        //console.log(pagedata_loaded);
        if((pagedata_loaded & 3)==3)main_handler.onEvent(dataevt.type,dataevt.event);
        //
        //POSTLOAD
        //...
    }
}

main_loader.ready();
