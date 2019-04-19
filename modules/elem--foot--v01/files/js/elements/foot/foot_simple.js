//FILE: js/elements/foot/foot_simple.js
/*******************************************************************************
*                                                                              *
*  This file has been generated by bmc.                                        *
*  Customizations should be done in bmc/elem/elements/<element_name>/elem.def. *
*                                                                              *
*******************************************************************************/



//class:
function foot_simple(pdiv,wrap)
{
//constructor:
    this.wrap=wrap;
    
    this.box=document.createElement("div");
    this.box.className="elem_foot_box";
    pdiv.appendChild(this.box);

    
    
//public:
    this.destroy=function()
    {
        
        pdiv.removeChild(this.box);
    }
    
    this.preset=function()
    {
        var o="\
                <div align='center'>\
                    loading...\
                </div>";
        this.box.innerHTML=o;

    }
    /*
    this.mbox=function()
    {
        return this.d4;
    }
    */
    
//private:
    
    
    this.setup=function(s)
    {
        elements_setup(s,this.wrap,"simple");
    }
}

main_loader.ready();

