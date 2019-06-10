//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box_plain.css

main_loader.load("js/animate/animate.js");

function flapbox_plain(pdiv,titletext)
{
    this.box=document.createElement("div");
    this.title=document.createElement("div");
    this.content=document.createElement("div");
    this.box.className="flap_box_box_plain";
    this.title.className="flap_box_title_plain";
    this.content.className="flap_box_content_plain";

    this.title.innerHTML=titletext+"";
    this.box.appendChild(this.title);
    this.box.appendChild(this.content);
    pdiv.appendChild(this.box);
    
//public:
    this.destroy=function()
    {
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
    }
    /*
    this.mbox=function()
    {
        return this.box;
    }
    */
    
//private:
}

main_loader.ready();
