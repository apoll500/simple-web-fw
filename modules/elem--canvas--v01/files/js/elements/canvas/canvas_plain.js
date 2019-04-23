main_loader.load("js/animate/animate.js");

function canvas_plain(pdiv)
{
    this.box=document.createElement("div");
    //this.box.className="canvas_main";
    pdiv.appendChild(this.box);
    main_elements_add(this);

//public:
    this.destroy=function()
    {
        main_elements_remove(this);
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
    }
    this.preset=function()
    {
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
    }
}

main_loader.ready();
