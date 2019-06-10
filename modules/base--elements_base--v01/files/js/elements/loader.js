
var DEBUG_LOADER_ON=true;

function script_loader(ready_callback,anim_callback,max_files)
{
    this.scripts_list=new Array();
    this.scripts_status=new Array();
    this.scripts_counter=0;
    this.loaded_counter=0;
    this.ready_counter=0;
    this.maxfiles=0;//max_files;
    this.est_maxfiles=max_files;
    this.ready_callback=ready_callback;
    this.anim_callback=anim_callback;

    this.is_loaded=function(url)
    {
        for(var i=0;i<this.scripts_list.length;i++)
        {
            if(this.scripts_list[i]==url && this.scripts_status[i]!=0)return true;
        }
        return false;
    }
    this.load=function(url)
    {
        if(this.is_loaded(url))return;
        
        this.maxfiles++;
        
        this.scripts_list[this.scripts_counter]=url;
        this.scripts_status[this.scripts_counter]=0;
        this.scripts_counter++;

        var doc=null;
        if(url.substr(url.length-3)==".js")
        {
            doc=this.load_js(url+"?r="+Math.random());
        }
        else if(url.substr(url.length-4)==".css")
        {
            doc=this.load_css(url+"?r="+Math.random());
        }
        
        if(doc)
        {
            doc.addEventListener("load",this.onLoad(url));
            document.getElementsByTagName('head')[0].appendChild(doc);
        }
    }
    this.load_js=function(url)
    {
        var doc=document.createElement('script');
        doc.type='text/javascript';
        doc.src=url;
        return doc;
    }
    this.load_css=function(url)
    {
        var doc=document.createElement("link");
        doc.setAttribute("rel","stylesheet");
        doc.setAttribute("type","text/css");
        doc.setAttribute("href",url);
        return doc;
    }
    this.onLoad=function(url)
    {
        for(var i=0;i<this.scripts_list.length;i++)
        {
            if(this.scripts_list[i]==url)
            {
                this.scripts_status[i]=1;
                this.loaded_counter++;
                if(this.anim_callback)this.anim_callback(this.loaded_counter/Math.max(this.est_maxfiles,this.maxfiles));
                if(url.substr(url.length-4)==".css")
                {
                    this.ready();
                }
                i=this.scripts_list.length;
                if(DEBUG_LOADER_ON)console.log("("+this.loaded_counter+") "+url);
            }
        }
    }
    this.allLoaded=function()
    {
        for(var i=0;i<this.scripts_list.length;i++)
        {
            if(this.scripts_status[i]==0)
            {
                return false;
            }
        }
        return true;
    }
    this.ready=function()
    {
        this.ready_counter++;
        if(this.loaded_counter==this.maxfiles && this.ready_counter==this.maxfiles && this.ready_callback && this.allLoaded())
        {
            this.ready_callback();
        }
    }
}
