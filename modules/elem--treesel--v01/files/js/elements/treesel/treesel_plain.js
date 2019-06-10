
function treesel_plain(pdiv,wrap)
{
    pdiv.innerHTML="";
    this.d0=document.createElement("div");
    pdiv.appendChild(this.d0);
    main_elements_add(this);
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
        <div align='center' style='background-color:#AACCFF;color:#3377AA;border-radius:5px;'>\
            <i>loading categories...</i>\
        </div>";
        this.d0.innerHTML=o;
        this.onResize();
    }
    this.mbox=function()
    {
        return this.d4;
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
    this.reset=function(path)
    {
        this.d0.innerHTML="";
        var i;
        for(i=0;i<path.length-1;i++)
        {
            this.reset_level(i,path[i],path[i+1]);
        }
        var sel=this.reset_level(i,path[i],"");
        while(sel && i<wrap.MAX_DEPTH)
        {
            i++;
            var pid=sel.value;
            wrap.select_path.push(pid);
            sel=this.reset_level(i,pid,"");
        }
    }
    this.reset_level=function(level,pid,selected_id)
    {
        var sel=wrap.create_select(level,pid);
        if(sel.length==0)return null;
        //sel.className="stdselect1";
        this.d0.appendChild(sel);
        if(selected_id!="")sel.value=selected_id;
        this.d0.appendChild(document.createElement("br"));
        return sel;
    }
}

main_loader.ready();
