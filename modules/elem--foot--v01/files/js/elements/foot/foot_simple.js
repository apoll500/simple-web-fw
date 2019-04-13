//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function foot_simple(pdiv)
{
    this.box=document.createElement("div");
    this.box.className="botbot";
    pdiv.appendChild(this.box);
    
//public:
    this.destroy=function()
    {
        pdiv.removeChild(this.box);
    }
    this.onEvent=function(type,evt)
    {
    }
    
//private:
    this.setup=function(s)
    {
        var o="";
        var lines=s.split("\n");
        for(var i=0;i<lines.length;i++)
        {
            if(lines[i]=="BEGIN_COLUMN")
            {
                o+="<div class='botcolumn'>";
            }
            else if(lines[i]=="END_COLUMN")
            {
                o+="</div>";
            }
            else if(lines[i]=="COPYINFO")
            {
                o+="<span class='copyinfo'><i>Copyright © 2017-2019<br>by Andreas Pollhammer</i></span><br>";
            }
            else
            {
                var a=lines[i].split("|");
                if(a.length==1)
                {
                    o+="<b>"+lines[i]+"</b><br>";
                }
                else
                {
                    o+="<a class=\"footlink\" href=\""+a[1]+"\">"+a[0]+"</a><br>";
                }
            }
        }
        this.box.innerHTML=o;
    }
}

main_loader.ready();
