


function plain_navbar(pdiv)
{
    this.box=document.createElement("div");
    pdiv.appendChild(this.box);

    this.content="";
    
//public:
    this.destroy=function()
    {
        pdiv.removeChild(this.box);
    }

//private:
    this.setup=function(s)
    {
        if(s==this.content)
        {
            return;
        }
        this.content=s;

        var o="";
        var lines=s.split("\n");
        for(var i=0;i<lines.length;i++)
        {
            var a=lines[i].split("|");
            o+="[<a href=\""+a[1]+"\">"+a[0]+"</a>]";
            if(i+1<lines.length)o+="&nbsp;|&nbsp;";
        }
        
        this.box.innerHTML=o;
        update();
    }
}

main_loader.ready();
