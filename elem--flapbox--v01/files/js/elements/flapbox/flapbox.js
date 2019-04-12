//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function flapbox(pdiv,minh,maxh,titletext)
{
    this.box=document.createElement("div");
    this.title=document.createElement("div");
    this.content=document.createElement("div");
    this.box.className="flap_box_box";
    this.title.className="flap_box_title";
    this.content.className="flap_box_content";

    this.title.innerHTML=titletext+"";
    this.box.appendChild(this.title);
    this.box.appendChild(this.content);
    pdiv.appendChild(this.box);
    
    this.title_hover=false;
    main_elements_add(this);
    
    this.cy_title=minh;
    this.anim_height=minh;
    this.start_height=minh;
    this.target_height=minh;
    this.max_height=maxh;
    
    this.parent_flap=null;
    
//public:
    this.destroy=function()
    {
        main_elements_remove(this);
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
        var pf=this.parent_flap;
        while(pf!=null)
        {
            if(pf.anim_height==pf.cy_title)
            {
                return;
            }
            pf=pf.parent_flap;
        }
        switch(type)
        {
            case "mousemove":
                this.onMousemove();
                break;
            case "click":
                this.onClick();
                break;
            case "keydown":
                this.onKeydown(evt);
                break;
        }
    }
    this.mbox=function()
    {
        return this.box;
    }
    
//private:
    this.update=function()
    {
        this.box.style.height=this.anim_height+"px";
        this.content.style.height=(this.anim_height-this.cy_title-10)+"px";
    }
    this.onKeydown=function(e)
    {
        var c=e.which || e.keyCode;
        if(c==13 || c==32)
        {
            this.toggle(true);
        }
    }
    this.onMousemove=function()
    {
        var hover=this.isin_title(doc_mousex,doc_mousey);
        if(!this.title_hover && hover)
        {
            this.title.className="flap_box_title_hover";
            this.title_hover=true;
        }
        else if(this.title_hover && !hover)
        {
            this.title.className="flap_box_title";
            this.title_hover=false;
        }
    }
    this.onClick=function()
    {
        if(this.isin_title(doc_mousex,doc_mousey))
        {
            this.toggle(true);
        }
    }
    this.toggle=function(b)
    {
        this.start_height=this.target_height;
        if(this.anim_height==this.cy_title)
        {
            this.target_height=this.max_height;
            if(this.parent_flap!=null)
            {
                this.parent_flap.update_height(this.target_height-this.start_height);
            }
        }
        else
        {
            this.target_height=this.cy_title;
            if(this.parent_flap!=null)
            {
                this.parent_flap.update_height(this.target_height-this.start_height);
            }
        }
        if(b)start_animation(10);
    }
    this.update_height=function(hdif)
    {
        this.max_height=this.max_height+hdif;
        this.target_height=this.max_height;
        if(this.parent_flap!=null)
        {
            this.parent_flap.update_height(hdif);
        }
    }
    this.animate=function(p)
    {
        var new_height=this.start_height+p*(this.target_height-this.start_height);
        if(new_height!=this.anim_height)
        {
            this.anim_height=new_height;
            this.update();
        }
    }
    this.end_anim=function()
    {
        this.start_height=this.anim_height;
        this.target_height=this.anim_height;
    }
    this.isin_title=function(x,y)
    {
        var r=this.box.getBoundingClientRect();
        return (x>r.left &&
                x<r.right &&
                y>r.top &&
                y<r.top+this.cy_title)
    }
}

main_loader.ready();
