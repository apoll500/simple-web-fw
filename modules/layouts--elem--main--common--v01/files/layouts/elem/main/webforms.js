/*******************************************************************************
*                                                                              *
*  Model                                                                       *
*                                                                              *
*******************************************************************************/
/*
Description of an element of a form as provided in text files.
0 ... FLD
1 ... css class of title
2 ... title
3 ... type of the element: INPUT|AREA|... --> corresponds to the name of the html tag.
4 ... type (or sub-type) of the html element --> f.e. input, hidden, button, password, ...
5 ... css class of the input element (mind the meaning of the last character)
6 ... name of the field (used for name or id)
7 ... default (preset) value
8 ... various options --> these are included in the html tag.
9 ... standard event, f.e. onclick.
10 .. module to handle the standard event.
11 .. token to run for the standard event.
12 .. additional parameters
*/
function form_element(model)
{
    this.name="";
    this.model=model;
    this.defval="";
    this.x=0;
    this.y=25;
    this.xx=25;
    this.yy=100;
    this.xt=0;
    this.yt=0;
    this.xxt=25;
    this.yyt=100;
    this.fonstsize=-1;
    this.type="INPUT";
    this.subtype="input";
    this.options="";
    this.title="";
    this.css_field="compact_input";
    this.css_title="compact_title";
    this.evt_name="";
    this.evt_module="";
    this.evt_token="";
    this.centerx=-1;
    this.centery=-1;
    this.insset=false;
    this.format="";
    //-------------------
    this.align="";
    this.utype="str";
    this.digits=0;
    this.neghl="";
    //-------------------
    this.data_error_mode="no_data_set";
    this.allow_empty=true;
    /*
    this.copy=function()
    {
        var e=new form_element(this.form);
        //...
    }
    */
    this.parse_line=function(line)
    {
        var a=(line+"|||||").split("|");
        this.css_title=a[1];
        this.title=a[2];
        this.type=a[3];
        this.subtype=a[4];
        this.css_field=a[5];
        this.name=a[6];
        this.defval=a[7];
        this.options=a[8];
        this.evt_name=a[9];
        this.evt_module=a[10];
        this.evt_token=a[11];
        this.format=a[12];
        if(this.format!="")
        {
            var aa=(this.format+"~~~~~").split("~");
            if(aa[0]=="A")
            {
                if(aa[1]=="number")
                {
                    this.utype="num";
                    this.align="right";
                    if(aa[2]!="")
                    {
                        this.digits=2;
                    }
                    if(aa[3]!="")
                    {
                        this.neghl=aa[3];
                    }
                }
            }
        }
    }
    this.pos_input=function(x,y,xx,yy)
    {
        this.x=x;
        this.y=y;
        this.xx=xx;
        this.yy=yy;
        //if(this.type=="INPUT")this.fonstsize=Math.floor(this.yy*0.8);
        this.insset=true;
    }
    this.pos_title=function(x,y,xx,yy)
    {
        this.xt=x;
        this.yt=y;
        this.xxt=xx;
        this.yyt=yy;
        //if(this.type=="INPUT")this.fonstsize=Math.floor(this.yy*0.8);
    }
    this.update=function(form,fs,vx,vy,vxx,vyy,psx,psy,sx,sy,cx,cy,mode)
    {
        if(!this.insset)return;
        if(this.fonstsize!=-1)fs=this.fonstsize;
        var px=this.x*psx;
        var py=this.y*psy;
        var pxx=this.xx*psx;
        var pyy=this.yy*psy;
        var tx=this.xt*psx;
        var ty=this.yt*psy;
        var txx=this.xxt*psx;
        var tyy=this.yyt*psy;
        //element coordinates to model coordinates
        //var px=this.x+vx;
        //var py=this.y+vy;
        //var pxx=this.xx;
        //var pyy=this.yy;
        if(this.centerx!=-1)cx=this.centerx+vx;
        if(this.centery!=-1)cy=this.centerx+vy;
        //model coordinates of 'clip' window to view coordinates
        var wx=vx*sx;
        var wy=vy*sy;
        var wxx=vxx*sx;
        var wyy=vyy*sy;
        //scale coordinates within the 'clip' window
        var px2=px;
        var py2=py;
        var pxx2=pxx;
        var pyy2=pyy;
        if(px>cx)px2=px+wxx-vxx;
        if(py>cy)py2=py+wyy-vyy;
        if(px2<0)px2=0;
        if(px2<0)px2=0;
        if(px+pxx>cx)pxx2=pxx+px+wxx-vxx-px2;
        if(py+pyy>cy)pyy2=pyy+py+wyy-vyy-py2;
        if(pxx2<10)pxx2=10;
        if(pyy2<10)pyy2=10;
        
        var tx2=tx;
        var ty2=ty;
        var txx2=txx;
        var tyy2=tyy;
        if(tx>cx)tx2=tx+wxx-vxx;
        if(ty>cy)ty2=ty+wyy-vyy;
        if(tx2<0)tx2=0;
        if(tx2<0)tx2=0;
        if(tx+txx>cx)txx2=txx+tx+wxx-vxx-tx2;
        if(ty+tyy>cy)tyy2=tyy+ty+wyy-vyy-ty2;
        if(txx2<10)txx2=10;
        if(tyy2<10)tyy2=10;
        
        //element coordinates to view coordinates
        px2+=wx;
        py2+=wy;
        tx2+=wx;
        ty2+=wy;
        
        this.moveto(form,fs,tx2,ty2,txx2,tyy2,px2,py2,pxx2,pyy2,mode);
    }
    this.moveto=function(form,fs,tx,ty,txx,tyy,px,py,pxx,pyy,mode)
    {
        var e=document.forms[form];
        if(e && e.elements.namedItem(this.name)!=null)
        {
            e=e.elements[this.name];
            
            if(!this.model.generator.get_data_loaded(this.model.module))
            {
                if(mode=="check_input")
                {
                    //console.log(this.model.module);
                    this.model.generator.set_data_loaded(this.model.module,true);
                }
            }
            if(this.model.generator.get_data_loaded(this.model.module))
            {
                if(mode=="check_input")
                {
                    if(this.check_input(e))
                    {
                        this.data_error_mode="update";
                    }
                }
                else
                {
                    this.check_input(e);
                }
                if(this.data_error_mode!="hold")
                {
                    this.update_input(e);
                }
            }
            
            format_form_element(this,e,fs,tx,ty,txx,tyy,px,py,pxx,pyy,mode,this.data_error_mode);
            
            if(this.align=="right")
            {
                e.style.textAlign="right";
            }
            if(this.neghl!="")
            {
                if(e.value.substr(0,1)=="-")
                    e.style.color=this.neghl;
                else
                    e.style.color="#000000";
            }
        }
        
        var t=document.getElementById(form+"_"+this.name+"_title");
        if(t)
        {
            format_form_element_title(this,t,fs,tx,ty,txx,tyy,px,py,pxx,pyy,mode,this.data_error_mode);
        }
    }
    this.check_input=function(e)
    {
        if(this.allow_empty)
        {
            if(e.value=="")
            {
                return true;
            }
            else
            {
                this.allow_empty=false;
            }
        }
        if(this.utype=="num")
        {
            translate_user_input2(e.value,this.format,true);
            if(translate_user_input_last_error_status!=0)
            {
                this.data_error_mode="hold";
                return false;
            }
        }
        return true;
    }
    this.update_input=function(e)
    {
        if(this.allow_empty && e.value=="")
        {
            return;
        }
        if(this.utype=="num")
        {
            if(this.data_error_mode=="update")
            {
                e.value=translate_user_input(e.value,this.format);
            }
        }
    }
}
function form_model(form,module,minwidth,generator)
{
    this.form=form;
    this.module=module;
    this.minwidth=minwidth;
    this.generator=generator;
    this.elements=[];
    this.centerx=10;
    this.centery=10;
    this.stectch="center";//unused
    this.winx=0;
    this.winy=0;
    this.winxx=100;
    this.winyy=100;
    this.pscalex=1;
    this.pscaley=1;
    this.fonstsize=-1;
    this.set_win=function(winx,winy,winxx,winyy,oxx,oyy)
    {
        this.winx=winx;
        this.winy=winy;
        this.winxx=winxx;
        this.winyy=winyy;
        this.pscalex=oxx/(winx+winxx);
        this.pscaley=oyy/(winy+winyy);
    }
    this.find_element_id=function(name)
    {
        for(var i=0;i<this.elements.length;i++)
        {
            if(this.elements[i].name==name)
            {
                return i;
            }
        }
        return -1;
    }
    this.update=function(form,width,fs,mode)
    {
        if(this.fonstsize!=-1)fs=this.fonstsize;
        var scalex=width/(this.winx+this.winxx)/this.pscalex;
        var scaley=1;//scalex;
        for(var i=0;i<this.elements.length;i++)
        {
            this.elements[i].update(form,fs,this.winx,this.winy,this.winxx,this.winyy,this.pscalex,this.pscaley,scalex,scaley,this.centerx,this.centery,mode);
        }
        var d=document.getElementById(form+"_parentdiv");
        if(d)d.style.height=this.winyy*this.pscaley*scaley+"px";
        if(d)d.style.fontSize="1pt";
    }
}
function form_generator()
{
    this.model=[];
    //this.model_count=0;
    this.fonstsize=12;
    //this.forms=["mform","sform1","mform_1","mform_2","mform_3"];
    this.dosubs=true;
    this.forms=[];
    this.modules=[];
    
    this.data_module=[];
    this.data_loaded=[];
    this.find_data_module=function(module)
    {
        for(var i=0;i<this.data_module.length;i++)
        {
            if(this.data_module[i]==module)
            {
                return i;
            }
        }
        return -1;
    }
    this.set_data_loaded=function(module,status)
    {
        //console.log("set_data_loaded "+module+" "+status);
        var i=this.find_data_module(module)
        if(i!=-1)this.data_loaded[i]=status;
        else
        {
            this.data_module.push(module);
            this.data_loaded.push(status);
        }
    }
    this.get_data_loaded=function(module)
    {
        var i=this.find_data_module(module)
        if(i!=-1)return this.data_loaded[i];
        return false;
    }
    /*
    this.onEvent=function()
    {
        switch(token)
        {
            case "resize":
                console.log("resize");
                break;
        }
    }
    this.resize=function(vx,vy,vxx,vyy)
    {
        //
    }
    */
    /*
    this.select_model2=function(form,width)
    {
        return -1;
        var modelid=-1;
        for(var i=0;i<this.model.length;i++)
        {
            if(this.model[i].form==form && this.model[i].module=="null")
            {
                if(width>this.model[i].minwidth)modelid=i;
                else break;
            }
        }
        return modelid;
    }
    */
    this.select_model=function(form,module,width)
    {
        if(module=="")
        {
            //console.log("Module not set for form '"+form+"'.");
            return -1;
        }
        
        var modelid=-1;
        for(var i=0;i<this.model.length;i++)
        {
            if(this.model[i].module==module && (this.model[i].form=="" || this.model[i].form==form))
            {
                if(width>this.model[i].minwidth)modelid=i;
                else break;
            }
        }
        
        return modelid;
    }
    this.get_module=function(form)
    {
        for(var i=0;i<this.forms.length;i++)
        {
            if(this.forms[i]==form)
            {
                return this.modules[i];
            }
        }
        return "";
    }
    this.update_form=function(form,width,mode,requested_module)
    {
        var module=this.get_module(form);
        
        if(requested_module!="" && requested_module!=module)
        {
            return;
        }
        //console.log("\n[UPDATE FORM LAYOUT] FORM = "+form+" -- MODULE = "+requested_module);
        
        var modelid=this.select_model(form,module,width);
        //console.log("Model ID = "+modelid+" ("+form+"/"+module+"/"+requested_module+")");
        //if(modelid==-1)modelid=this.select_model2(form,width);
        if(modelid!=-1)this.model[modelid].update(form,width,this.fonstsize,mode);
    }
    this.update=function(width)
    {
        this.update2(width,"")
    }
    this.update2=function(width,mode)
    {
        this.update3(width,mode,"")
    }
    this.update3=function(width,mode,requested_module)
    {
        //console.log("update");
        /*
        for(var i=0;i<this.forms.length;i++)
        {
            this.update_form(this.forms[i],width);
        }
        */
        for(var i=0;i<document.forms.length;i++)
        {
            //console.log(document.forms[i].attributes["name"].value);
            this.update_form(document.forms[i].attributes["name"].value,width,mode,requested_module);
        }
    }
    this.add_model=function(minwidth,form,module,x,y,xx,yy,oxx,oyy)
    {
        var m=new form_model(form,module,minwidth,this);
        m.set_win(x,y,xx,yy,oxx,oyy);
        this.model.push(m);
        return this.model.length-1;
    }
    /*
    this.feed_line(line,form)
    {
        var e=new form_element(form);
        e.parse_line(line);
        this.model[this.model_count-1].elements.push(e);
    }
    this.feed_line2(modelid,line,form)
    {
        var e=new form_element(form);
        e.parse_line(line);
        this.model[modelid].elements.push(e);
    }
    */
    this.feed_line_all_models=function(line,form,module)
    {
        //var e=new form_element(form);
        //e.parse_line(line);
        for(var i=0;i<this.model.length;i++)
        {
            if(this.model[i].module==module && (this.model[i].form=="" || this.model[i].form==form))
            {
                //console.log("WEBFORMS FEED: "+form+"/"+module+" LINE "+line);
                var e=new form_element(this.model[i]);
                e.parse_line(line);
                this.model[i].elements.push(e);
            }
        }
    }
    this.feed_content=function(content_str)
    {
        this.feed_content2(content_str,"");
    }
    this.feed_content2=function(content_str,form_suffix)
    {
        var form="";
        var module="";
        var lines=content_str.split("\n");
        for(var i=0;i<lines.length;i++)
        {
            if(lines[i].substr(0,5)=="FORM|")
            {
                var a=(lines[i]+"|||").split("|");
                form=a[1]+form_suffix;
                module=a[6];
                this.forms.push(form);
                this.modules.push(module);
                //console.log("WEBFORMS PUSH: "+form+"/"+module);
            }
            else if(lines[i].substr(0,7)=="ENDFORM")
            {
                form="";
                module="";
            }
            else if(this.dosubs && lines[i]=="INCLUDE_CALLER_SHOWFORM")
            {
                this.dosubs=false;
                for(var i=context_sublevel2;i>=0;i--)
                {
                    //console.log("sublevel webforms:"+(context_sublevel-i));
                    var m=context_load2(context_sublevel-i,"parent_module","");
                    //console.log("webforms -- load parent "+i+": "+m);
                    if(m!="")
                    {
                        var a=global_file_storage.load(baseurl+"content/"+lang+"/"+m+"/show.txt");
                        if(i!=0)this.feed_content2(a,"_"+i);
                        else this.feed_content2(a,"");
                    }
                }
            }
            else if(form!="" && lines[i].substr(0,4)=="FLD|")
            {
                this.feed_line_all_models(lines[i],form,module);
            }
        }
    }
    this.pos=function(modelid,name,xt,yt,xxt,yyt,x,y,xx,yy)
    {
        var element_id=this.model[modelid].find_element_id(name);
        if(element_id==-1)
        {
            //console.log("Error: Missing Form Element.");
            //console.log("       Element name="+name);
            //console.log("       Model Module name="+this.model[modelid].module);
            //console.log(this);
            return;
        }
        this.model[modelid].elements[element_id].pos_title(xt,yt,xxt,yyt);
        this.model[modelid].elements[element_id].pos_input(x,y,xx,yy);
        //this.model[modelid].elements[element_id].name=name;
    }
    this.cpo=function(modelid,x,y)
    {
        this.model[modelid].centerx=x;
        this.model[modelid].centery=y;
    }
}

main_loader.ready();
