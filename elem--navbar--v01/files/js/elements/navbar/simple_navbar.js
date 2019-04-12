
function simple_navbar(pdiv)
{
    this.layout="standard";
    this.box=document.createElement("div");
    this.box_inner=document.createElement("div");
    this.box.className="topnavbar";
    this.box_inner.className="topnavbar_inner";
    this.box.appendChild(this.box_inner);
    pdiv.appendChild(this.box);

    this.content="";
    this.cpage=currentpage;
    
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
    
//private:
    this.setup=function(s)
    {
        if(s==this.content && this.cpage==currentpage)
        {
            return;
        }
        this.content=s;
        this.cpage=currentpage;
        
        var o="";//<div style='margin:0px;padding:0px;'><nobr>";
        var lines=s.split("\n");
        for(var i=0;i<lines.length;i++)
        {
            var a=lines[i].split("|");
            if(a[2]==currentpage.substr(0,a[2].length))style="topnav2";else style="topnav";
            o+="<a href=\""+a[1]+"\" class=\""+style+"\">"+a[0]+"</a>";
            if(i+1<lines.length)o+="&nbsp;|&nbsp;";
        }
        o+="</nobr>";//</div>";
        
        this.box_inner.innerHTML=o;
        
        this.onResize();
    }
    this.onResize=function()
    {
        if(this.layout=="logo_layout")
        {
            if(screenx<580)
            {
                var o="";//<div style='margin:0px;padding:0px;'><br><nobr>";
                var lines=this.content.split("\n");
                for(var i=0;i<lines.length;i++)
                {
                    var a=lines[i].split("|");
                    if(a[2]==currentpage.substr(0,a[2].length))style="topnav2";else style="topnav";
                    o+="<a href=\""+a[1]+"\" class=\""+style+"\">"+a[0]+"</a>";
                    if(i==0)o+="<br>";
                    if(i>0 && i+1<lines.length)o+="&nbsp;|&nbsp;";
                }
                o+="</nobr>";//</div>";
                this.box_inner.innerHTML=o;
            }
            else
            {
                var o="";//<div style='margin:0px;padding:0px;'><nobr>";
                var lines=this.content.split("\n");
                for(var i=0;i<lines.length;i++)
                {
                    var a=lines[i].split("|");
                    if(a[2]==currentpage.substr(0,a[2].length))style="topnav2";else style="topnav";
                    o+="<a href=\""+a[1]+"\" class=\""+style+"\">"+a[0]+"</a>";
                    if(i+1<lines.length)o+="&nbsp;|&nbsp;";
                }
                o+="</nobr>";//</div>";
                this.box_inner.innerHTML=o;
            }
        }
    }
    this.animate=function(p)
    {
    }
    this.end_anim=function()
    {
    }
    this.update=function()
    {
    }
}

main_loader.ready();
