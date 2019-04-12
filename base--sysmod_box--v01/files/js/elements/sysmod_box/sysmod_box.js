//requires:
//  js/elements/base.js
//  js/elements/sysmod_box/sysmod_box.css

function sysmod_box(htmlText)
{
    if(single_capture!=null)return;
    
    this.bg=document.createElement("div");
    this.box=document.createElement("div");
    this.close_box=document.createElement("div");
    this.box_content=document.createElement("div");
    this.bg.className="sysmod_box_bg";
    this.box.className="sysmod_box_box";
    this.close_box.className="sysmod_box_closebox";
    this.box_content.className="sysmod_box_content";
    this.box_content.innerHTML=htmlText;
    this.close_box.innerHTML="&nbsp;X&nbsp;";
    this.box.appendChild(this.close_box);
    this.box.appendChild(this.box_content);
    this.box.style.marginLeft="50px";
    this.box.style.marginTop="50px";
    
    document.getElementById("MAIN").appendChild(this.bg);
    document.getElementById("MAIN").appendChild(this.box);
    
    //let the sysmod_box be on top of all pwins.
    this.bg.style.zIndex=1000;
    this.box.style.zIndex=1001;
    
    this.close_box_hover=false;
	single_capture=this;
    //not required because of single_capture
    //main_elements_add(this);
    document.getElementsByTagName("BODY")[0].scrollTop=0;
    document.getElementsByTagName("BODY")[0].scrollLeft=0;
    console.log("sysmod_box message:\n"+htmlText);
    
    this.time_of_creation=(new Date()).getTime();
    
//public:
    this.destroy=function()
    {
        //not required because of single_capture
        //main_elements_remove(this);
        document.getElementById("MAIN").removeChild(this.bg);
        document.getElementById("MAIN").removeChild(this.box);
		single_capture=null;
    }
    this.onEvent=function(type,evt)
    {
        switch(type)
        {
            case "mousemove":
                this.onMousemove();
                break;
            case "click":
                this.onClick();
                break;
            case "mousedown":
                this.onMousedown();
                break;
            case "mouseup":
                this.onMouseup();
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
    }
	this.box_status=0;
    this.onMousemove=function()
    {
        var hover=this.isin_close_box(doc_mousex,doc_mousey);
        if(!this.close_box_hover && hover)
        {
            this.close_box.className="sysmod_box_closebox_hover";
            this.close_box_hover=true;
        }
        else if(this.close_box_hover && !hover)
        {
            this.close_box.className="sysmod_box_closebox";
            this.close_box_hover=false;
        }
        if(this.box_status==1)
        {
            this.box.style.marginLeft=
                    parseInt(this.box.style.marginLeft,10)
                    +mousex-mousexs+"px";
            this.box.style.marginTop=
                    parseInt(this.box.style.marginTop,10)
                    +mousey-mouseys+"px";
        }
    }
    this.onClick=function()
    {
        //Clicking a link and clicking a button is handled differently with
        //respect to the order of execution.
        //If a user interaction results in the creation of this sysmod_box,
        //then the click event (associated with this user interaction) can be
        //fired either before or after the creation of this sysmod_box.
        //In cases where the click event is fired afterwards, we ignore this
        //click event here, by requiring a minimum waiting time before the
        //sysmod_box becomes sensitive for click events.
        var current_time=(new Date()).getTime();
        if(current_time<this.time_of_creation+500)return;
        
        if(this.isin_close_box(doc_mousex,doc_mousey) || !this.isin_box(doc_mousex,doc_mousey))
        {
            this.destroy();
        }
    }
    this.onMousedown=function()
    {
        if(this.box_status==0 && !this.isin_close_box(doc_mousex,doc_mousey) && this.isin_box(doc_mousex,doc_mousey))
        {
            this.box_status=1;
        }
    }
    this.onMouseup=function()
    {
        this.box_status=0;
    }
    this.isin_box=function(x,y)
    {
        var r=this.box.getBoundingClientRect();
        return (x>r.left && x<r.right && y>r.top && y<r.bottom)
    }
    this.isin_close_box=function(x,y)
    {
        var r=this.close_box.getBoundingClientRect();
        return (x>r.left-this.close_box_hover*3 &&
                x<r.right+this.close_box_hover*4 &&
                y>r.top-this.close_box_hover*4 &&
                y<r.bottom+this.close_box_hover*3)
    }
}

main_loader.ready();
