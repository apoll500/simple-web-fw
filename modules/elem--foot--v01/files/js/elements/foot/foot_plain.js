//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function foot_plain(pdiv)
{
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
    
//private:
    this.setup=function(s)
    {
        var o="<hr>";
        var lines=s.split("\n");
        for(var i=0;i<lines.length;i++)
        {
            if(lines[i]=="BEGIN_COLUMN")
            {
                o+="<br>";
            }
            else if(lines[i]=="END_COLUMN")
            {
            }
            else if(lines[i]=="COPYINFO")
            {
                o+="<i>Copyright © 2017-2019<br>by Andreas Pollhammer</i><br>";
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
                    o+="<a href=\""+a[1]+"\">"+a[0]+"</a><br>";
                }
            }
        }
        this.box.innerHTML=o;
        update();
    }
}

main_loader.ready();
