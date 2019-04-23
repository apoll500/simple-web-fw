main_loader.load("js/animate/animate.js");

function canvas_simple(pdiv)
{
    this.box=document.createElement("div");
    //this.box.className="canvas_main";
    pdiv.appendChild(this.box);
    main_elements_add(this);
    this.webgdObject=null;
    
    this.width=1200;
    this.height=600;
//public:
    this.destroy=function()
    {
        main_elements_remove(this);
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
        if(typeof game_event == 'function')game_event(type,evt,this.webgdObject)
            
        switch(type)
        {
            case "resize":
                this.onResize();
                break;
            case "dblclk":
                //this.webgdObject.setup();
                break;
            case "click":
                //webgd_variables["$f"].bgcolor.setAnim4(255,100,50,3000);
                //webgd_variables["$r"].pos.setAnimX(400,2000);
                //this.webgdObject.animate();
                break;
        }
        
		for(var i=0;i<webgd_sensors_count;i++)
		{
			webgd_sensors[i].callback(type,evt,null);
		}
    }
    this.preset=function()
    {
        var o="\
        <div align='center'>\
            loading...\
        </div>";
        this.box.innerHTML=o;
    }
    this.mbox=function()
    {
        return this.box;
    }
    
//private:
    this.onResize=function()
    {
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
    this.setup=function(s)
    {
        this.box.innerHTML="<div align='center' style='margin:10px;'><canvas id='screen1' width='"+this.width+"' height='"+this.height+"' style='border:solid 1px green;'></canvas></div>";
		this.webgdObject=new webgd("screen1");
        this.webgdObject.load(s);
        this.webgdObject.setup(this.webgdObject);
    }
}

main_loader.ready();
