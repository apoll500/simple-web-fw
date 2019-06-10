
main_loader.load("js/elements/treesel/treesel_simple.js");
main_loader.load("js/elements/treesel/treesel_plain.js");
main_loader.load("js/http/common.js");

function treeselfill_wrapper(pdiv,style,params)
{
    globalEventCallbacks=[];
    
    this.object;
    this.vars_context=new file_storage();
    
    this.root_id=params[3];
    this.fld_id=params[4];
    this.fld_pid=params[5];
    this.module=params[6];
    this.fld_name=params[7];
    this.fld_info=params[8];
    this.fld_target=params[9];
    this.comm_area=params[10];
    this.fld_style=params[11];
    //console.log(this.fld_style);
    
    this.the_tree=[];
    this.current_level=0;
    this.select_path=[this.root_id];
    
    this.MAX_DEPTH=20;
    
    switch(style)
    {
        case "simple":
            this.object=new treesel_simple(pdiv,this);
            break;
        default:
            this.object=new treesel_plain(pdiv,this);
    }
    this.object.preset();
    
//public:
    this.destroy=function()
    {
        delEventCallback(document.getElementById("mform").elements.namedItem(this.fld_target),"change");
        this.object.destroy();
    }
    // load events
    this.load=function(token)
    {
        this.load_clean(token,null);
    }
    this.load2=function(token,data)
    {
        this.load_clean(token,data);
    }
    this.load_clean=function(token,data)
    {
        switch(token)
        {
            case "initial":
                //This loads the full tree! --> not practical for large trees.
                httpSendPostMessage("sys/index.php","site="+site+"&lang="+lang+"&area="+this.comm_area+"&comm="+this.module+"_search&startindex=LTE=&maxitems&NQ==",receive_message,this,token);
                break;
        }
    }
    // user events
    this.run=function(token)
    {
    }
    this.run2=function(token,data)
    {
    }
    // data events
    this.handle=function(handler,type,evt,context)
    {
    }
    // callback -- handle receive_message
    this.onEvent=function(token,s)
    {
        //console.log("token="+token+", s="+s);
        //Error handling not that importent here because, the same error very likely occurs in main_handler first.
        var part=s.split("|");
        switch(part[0])
        {
            case "[OK]":
            case "[OK][OK]":
                break;
            default:
                console.log("[ERROR] "+s);
                return;
        }
        //dataevent not required here, because there is only one event and the element is available, it is this element.
        switch(token)
        {
            case "initial":
                //console.log("received initial tree");
                this.get_all_items(s);
                //console.log(this.the_tree);
                //console.log(this.object);
                //this.object.set_level(0,this.root_id);
                //this.object.reset(this.select_path);
                
                //this.run_select(0,this.root_id);
                //console.log(this.object);
                
                //var selected_item=this.root_id;
                var target_input=document.getElementById("mform").elements.namedItem(this.fld_target);
                if(target_input)
                {
                    //console.log("initial = "+target_input.value);
                    var THIS=this;
                    //target_input.addEventListener("change",function(e){THIS.run_change_event(e);});
                    setEventCallback(target_input,"change",function(e){THIS.run_change_event(e);});
                    this.run_change_event2(target_input);
                }
                else
                {
                    console.log("[ERROR] Missing input field: "+this.fld_target+".");
                }
                break;
        }
    }
    // callback -- handle receive_text
    this.setup=function(s)
    {
        this.object.setup(s);
    }
    this.create_select=function(level,parentid)
    {
        var sel=document.createElement("SELECT");
        sel.name="treesel_"+level;
        if(this.fld_style!="grayed")
        {
            var THIS=this;
            sel.addEventListener("change",function(e){THIS.run_select_event(e);});
        }
        else
        {
            sel.disabled=true;
        }
        for(var i=0;i<this.the_tree.length;i++)
        {
            var opt_name="";
            var opt_info="";
            var opt_id="";
            var opt=null;
            for(var j=0;j<this.the_tree[i].length;j++)
            {
                if(this.the_tree[i][j].name==this.fld_pid && this.the_tree[i][j].value==parentid)
                {
                    opt=document.createElement("OPTION");
                }
                else if(this.the_tree[i][j].name==this.fld_id)
                {
                    opt_id=this.the_tree[i][j].value;
                }
                else if(this.the_tree[i][j].name==this.fld_name)
                {
                    opt_name=this.the_tree[i][j].value;
                }
                else if(this.the_tree[i][j].name==this.fld_info)
                {
                    opt_info=this.the_tree[i][j].value;
                }
            }
            if(opt)
            {
                opt.value=opt_id;
                opt.text=opt_name;//+" -- "+opt_info;
                sel.options.add(opt);
            }
        }
        return sel;
    }
    this.find_record=function(id_value)
    {
        for(var i=0;i<this.the_tree.length;i++)
        {
            if(this.get_value(i,this.fld_id)==id_value)
            {
                return i;
            }
        }
        return -1;
    }
    this.get_value=function(record_id,name)
    {
        for(var j=0;j<this.the_tree[record_id].length;j++)
        {
            if(this.the_tree[record_id][j].name==name)
            {
                return this.the_tree[record_id][j].value;
            }
        }
        return "";
    }
    this.get_existing_value=function(record_id,name)
    {
        for(var j=0;j<this.the_tree[record_id].length;j++)
        {
            if(this.the_tree[record_id][j].name==name)
            {
                return this.the_tree[record_id][j].value;
            }
        }
        return null;
    }
    this.run_change_event=function(e)
    {
        //console.log("run_change_event("+e+")");
        if(e!=null)this.run_change_event2(e.currentTarget);
        else this.run_change_event2(document.getElementById("mform").elements.namedItem(this.fld_target));
    }
    this.run_change_event2=function(dom_input_element)
    {
        if(dom_input_element==null)return;
        
        var current_id=dom_input_element.value;
        if(current_id=="")
        {
            this.run_select(0,this.root_id);
            return;
        }
        
        //this.object.reset(this.select_path);
        var path=[];
        var c=0;
        while(c<this.MAX_DEPTH)
        {
            var r=this.find_record(current_id);
            if(r!=-1)
            {
                path.push(current_id);
                current_id=this.get_value(r,this.fld_pid);
                if(current_id==this.root_id)
                {
                    path.push(current_id);
                    break;
                }
            }
            c++;
        }
        
        //console.log("changed");
        //console.log(this.select_path);
        //this.select_path=[];
        this.select_path=path.reverse();
        //for(var i=path.length-1;i>=0;i--)
        //{
        //    this.select_path.push(path[i]);
        //}
        //console.log(this.select_path);
        this.object.reset(this.select_path);
        //console.log(this.select_path);
    }
    this.run_select_event=function(e)
    {
        var selected_id=e.currentTarget.value;
        var selected_select=e.currentTarget.name;
        var a=selected_select.split("_");
        var selected_level=parseInt(a[1])+1;
        this.run_select(selected_level,selected_id);
    }
    this.run_select=function(selected_level,selected_id)
    {
        this.select_path[selected_level]=selected_id;
        if(this.select_path.length-selected_level-1>0)
        {
            this.select_path.splice(selected_level+1,this.select_path.length-selected_level-1);
        }
        this.object.reset(this.select_path);
        //console.log(e.currentTarget);
        // (1) fill form
        var record_id=this.find_record(selected_id);
        if(record_id!=-1)
        {
            for(var i=0;i<document.getElementById("mform").elements.length;i++)
            {
                var form_input_name=document.getElementById("mform").elements[i].name;
                var fld_value=this.get_existing_value(record_id,form_input_name);
                if(fld_value!=null)//The empty string is considered to be equal to null, so '!=null' is required here.
                {
                    if(fld_value=="0000-00-00")
                    {
                        var t=new Date();
                        var y=t.getFullYear()
                        var d=t.getDate();//getDate() returns day 1-31
                        var m=t.getMonth()+1;//getMonth() returns months 0-11
                        if(d<10)d="0"+d;
                        if(m<10)m="0"+m;
                        fld_value=y+"-"+m+"-"+d;
                    }
                    else if(fld_value=="0.00")
                    {
                        fld_value="";
                    }
                    document.getElementById("mform").elements[i].value=fld_value;
                }
            }
        }
        // (2) fill hidden selector input
        var item=document.getElementById("mform").elements.namedItem(this.fld_target);
        if(item)item.value=this.select_path[this.select_path.length-1];
        //console.log(this.select_path);
        //console.log(this.the_tree);
    }
    this.get_all_items=function(s)
    {
        var parts=s.split("|");
        for(var i=1;i<parts.length;i++)
        {
            this.get_item(parts[i]);
        }
    }
    this.get_item=function(part)
    {
        if(part.substr(0,11)=="base64data:")
        {
            var f=part.substr(11).split(",");
            var item=[];
            for(var i=0;i<f.length;i++)
            {
                var name=get_name(f[i]);
                var value=get_value(f[i]);
                var prop={name:name,value:value};
                item.push(prop);
            }
            this.the_tree.push(item);
        }
        else if(part.substr(0,6)=="plain:")
        {
            var f=part.substr(6).split(",");
            var item=[];
            for(var i=0;i<f.length;i++)
            {
                var name=get_name(f[i]);
                var value=get_value_plain(f[i]);
                var prop={name:name,value:value};
                item.push(prop);
            }
            this.the_tree.push(item);
        }
        else
        {
            console.log(this.module+"::treeselfill::get_item() - unknown part: "+part);
        }
    }
}

main_loader.ready();
