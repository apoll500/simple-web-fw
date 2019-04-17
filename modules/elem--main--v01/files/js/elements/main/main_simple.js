//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");
//main_loader.load("js/common/setup/s_main_simple.js");

function main_simple(pdiv,wrap)
{
    this.layout="left";
    this.rstyle="null";
    this.wrap=wrap;
    
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
    
    this.flapminh=42;
    
//public:
    this.destroy=function()
    {
        main_elements_remove(this);
        pdiv.removeChild(this.d0);
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
        if(this.layout=="multicol")
        {
            if(screenx<680)
            {
                this.rstyle="mini";
                this.d1.className="simple_box_d1_mini";
                this.d2.className="simple_box_d2_mini";
                this.d3.className="simple_box_d3_mini";
            }
            else if(screenx<1360)
            {
                this.rstyle="maxi";
                this.d1.className="simple_box_d1_maxi";
                this.d2.className="simple_box_d2_maxi";
                this.d3.className="simple_box_d3_maxi";
            }
            else if(screenx<2040)
            {
                this.rstyle="2col";
                this.d1.className="simple_box_d1_2col";
                this.d2.className="simple_box_d2_2col";
                this.d3.className="simple_box_d3_2col";
            }
            else
            {
                this.rstyle="3col";
                this.d1.className="simple_box_d1_3col";
                this.d2.className="simple_box_d2_3col";
                this.d3.className="simple_box_d3_3col";
            }
        }
        else if(this.layout=="multicol2c")
        {
            if(screenx<680)
            {
                this.rstyle="mini";
                this.d1.className="simple_box_d1_mini";
                this.d2.className="simple_box_d2_mini";
                this.d3.className="simple_box_d3_mini";
            }
            else if(screenx<1360)
            {
                this.rstyle="maxi";
                this.d1.className="simple_box_d1_maxi_2c";
                this.d2.className="simple_box_d2_maxi_2c";
                this.d3.className="simple_box_d3_maxi_2c";
            }
            else if(screenx<2040)
            {
                this.rstyle="2col";
                this.d1.className="simple_box_d1_2col_2c";
                this.d2.className="simple_box_d2_2col_2c";
                this.d3.className="simple_box_d3_2col_2c";
            }
            else
            {
                this.rstyle="3col";
                this.d1.className="simple_box_d1_3col_2c";
                this.d2.className="simple_box_d2_3col_2c";
                this.d3.className="simple_box_d3_3col_2c";
            }
        }
        else
        {
            if(screenx<680)
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
    this.setup=function(s)
    {
        //elements_setup_main_simple(s,this);
        elements_setup(s,this.wrap,"simple");
    }
}

main_loader.ready();
