//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function memoryfile(name,data)
{
    this.filename=name;
    this.filedata=data;
}
function file_storage()
{
    this.container=new Array();
    this.store_file=function(filename,filedata)
    {
        if(filedata!="")
        {
            if(filename.substr(0,4)!="sys/")
            {
                //console.log("storing "+filename);
                this.container.push(new memoryfile(filename,filedata));
            }
        }
    }
    this.store=function(filename,filedata)
    {
        var index=this.indexof(filename);
        if(index!=-1)this.container[index].filedata=filedata;
        else this.container.push(new memoryfile(filename,filedata));
    }
    this.indexof=function(filename)
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename==filename)
            {
                return i;
            }
        }
        return -1;
    }
    this.exists=function(filename)
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename==filename)
            {
                return true;
            }
        }
        return false;
    }
    this.del=function(filename)
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename==filename)
            {
                this.container[i].filename="";
                this.container[i].filedata="";
                return true;
            }
        }
        return false;
    }
    this.load=function(filename)
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename==filename)
            {
                //console.log("recycling "+this.container[i].filename);
                return this.container[i].filedata;
            }
        }
        return "";
    }
    this.load2=function(filename,default_content)
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename==filename)
            {
                //console.log("recycling "+this.container[i].filename);
                return this.container[i].filedata;
            }
        }
        return default_content;
    }
    this.get=function(filename)
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename==filename)
            {
                //console.log("recycling "+this.container[i].filename);
                return this.container[i].filedata;
            }
        }
        return null;
    }
    this.load_text=function(name)
    {
        return this.load(baseurl+"content/"+lang+"/"+name+".txt");
    }
    this.reset=function()
    {
        this.container=new Array();
    }
    this.print=function()
    {
        for(var i=0;i<this.container.length;i++)
        {
            if(this.container[i].filename.substr(0,1)=="L")
            console.log(this.container[i].filename+"=\""+this.container[i].filedata+"\"");
        }
    }
}
var global_file_storage=new file_storage();

main_loader.ready();
