﻿//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");
main_loader.load("js/common/setup/s_main_plain.js");

function main_plain(pdiv)
{
    this.layout="left";

    this.box=document.createElement("div");
    pdiv.appendChild(this.box);
    
//public:
    this.destroy=function()
    {
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
    }
    this.preset=function()
    {
        var o="\
        <div align='center'>\
            loading...\
        </div>";
        this.box.innerHTML=o;
    }
    
//private:
    this.setup=function(s)
    {
        elements_setup_main_plain(s,this);
        update();
    }
}

main_loader.ready();