//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function fmain_plain(pdiv,adiv)
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
        var o="";
        var lines=s.split("\n");
        for(var i=1;i<lines.length;i++)
        {
            if(lines[i]=="BEGIN_IBOX")
            {
            }
            else if(lines[i]=="END_IBOX")
            {
            }
            else if(lines[i]=="BEGIN_LIST")
            {
                o+="<ul>";
            }
            else if(lines[i]=="END_LIST")
            {
                o+="</ul>";
            }
            else if(lines[i].substr(0,5)=="ITEM|")
            {
                a=lines[i].split("|");
                o+="<li>"+a[1]+"</li>";
            }
            else if(lines[i].substr(0,2)=="I|")
            {
                a=lines[i].split("|");
                o+="<li><b>"+a[1]+":</b> "+a[2]+"</li>";
            }
            else o+=""+lines[i]+"<br>";
        }
        o="<h1>"+lines[0]+"</h1>"+o+"";
        this.box.innerHTML=o;
        update();
    }
}

main_loader.ready();
