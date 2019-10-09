//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
main_loader.load("js/parser/dfa.js");
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function varparser()
{
    this.data=null;
    this.dfa=null;
    this.setup=function()
    {
        //--TODO-- allow additional symbols only in case of a ~ parsed before
        var namesym=     ['~','.','(',')',',','_','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0'];
        var numsym=      ['1','2','3','4','5','6','7','8','9','0'];
        var varsym=      ['$'];
        var marker=      ['@'];
        var equalsi=     ['='];
        var whitespace=  [' ','\t','\n'];
        var seperator=   [';'];
        var strmark=     ['\"'];
        var escmark=     ['\\'];
        var decsym=      ['.'];
        
        var THIS=this;
        this.dfa=new Dfa();
        //this.dfa.setOwnerCallback(function(a,b){info_func(a,b);});
        this.dfa.setErrorCallback(function(a,b){THIS.err_func(a,b);});
        this.dfa.setNewStartNode("a0");
        this.dfa.addNode("a1");
        this.dfa.addNode("a2");
        this.dfa.addNode("a3");
        this.dfa.addNode("a4");
        this.dfa.addNode("a5");
        this.dfa.addNode("a6");
        this.dfa.addNode("a7");
        this.dfa.addNode("a8");
        this.dfa.addNode("a9");
        this.dfa.addNode("e0");
        this.dfa.addNode("e1");
        this.dfa.addNode("e2");
        //variable
        this.dfa.addLink_ssaf("a0","a0",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a0","a1",varsym,    function(a,b){THIS.add_name(a,b);});
        this.dfa.addLink_ssaf("a1","a1",namesym,   function(a,b){THIS.add_name(a,b);});
        this.dfa.addLink_ssaf("a1","a2",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a1","a3",equalsi,   function(a,b){THIS.set_variable_name(a,b);});
        this.dfa.addLink_ssaf("a2","a2",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a2","a3",equalsi,   function(a,b){THIS.set_variable_name(a,b);});
        this.dfa.addLink_ssaf("a3","a3",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssf("a3","e2",            function(a,b){THIS.add_value(a,b);});
        //numeric values
        this.dfa.addLink_ssaf("a3","a4",numsym,    function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssaf("a3","a5",decsym,    function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssaf("a3","a7",strmark,   function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a4","a4",numsym,    function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssaf("a4","a5",decsym,    function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssaf("a4","a6",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a4","a0",seperator, function(a,b){THIS.store_variable(a,b);});
        this.dfa.addLink_ssaf("a4","a1",varsym,    function(a,b){THIS.store_variable(a,b);});
        this.dfa.addLink_ssaf("a5","a5",numsym,    function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssaf("a5","a6",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a5","a0",seperator, function(a,b){THIS.store_variable(a,b);});
        this.dfa.addLink_ssaf("a5","a1",varsym,    function(a,b){THIS.store_variable(a,b);});
        this.dfa.addLink_ssaf("a6","a6",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a6","a0",seperator, function(a,b){THIS.store_variable(a,b);});
        this.dfa.addLink_ssaf("a6","a1",varsym,    function(a,b){THIS.store_variable(a,b);});
        //strings
        this.dfa.addLink_ssaf("a7","e0",escmark,   function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("a7","a8",varsym,    function(a,b){THIS.add_name(a,b);});
        this.dfa.addLink_ssaf("a7","a9",marker,    function(a,b){THIS.add_name(a,b);});
        this.dfa.addLink_ssaf("a7","e1",strmark,   function(a,b){THIS.store_variable(a,b);});
        this.dfa.addLink_ssf("a7","a7",            function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssf("e0","a7",            function(a,b){THIS.add_value(a,b);});
        
        this.dfa.addLink_ssaf("a8","a8",namesym,   function(a,b){THIS.add_name(a,b);});
        this.dfa.addLink_ssaf("a8","e1",strmark,   function(a,b){THIS.insert_variable(a,b);THIS.store_variable(a,b);});
        this.dfa.addLink_ssf("a8","a7",            function(a,b){THIS.insert_variable(a,b);THIS.add_value(a,b);});
        
        this.dfa.addLink_ssaf("a9","a9",namesym,   function(a,b){THIS.add_name(a,b);});
        this.dfa.addLink_ssaf("a9","e1",strmark,   function(a,b){THIS.insert_field(a,b);THIS.store_variable(a,b);});
        this.dfa.addLink_ssf("a9","a7",            function(a,b){THIS.insert_field(a,b);THIS.add_value(a,b);});
        
        this.dfa.addLink_ssaf("e1","e1",whitespace,function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("e1","a0",seperator, function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssaf("e1","a1",varsym,    function(a,b){THIS.link_func(a,b);});
        this.dfa.addLink_ssf("a0","a7",            function(a,b){THIS.add_value(a,b);});//......TO a7(?)
        //constant
        this.dfa.addLink_ssf("e2","e2",            function(a,b){THIS.add_value(a,b);});
        this.dfa.addLink_ssaf("e2","a0",seperator, function(a,b){THIS.store_variable(a,b);});
    }
    this.parse=function(str)
    {
        this.data=new file_storage();
        this.dfa.reset();
        this.dfa.parseStr(str);
    }
    this.parse2=function(str,fields)
    {
        this.data=fields;
        this.dfa.reset();
        this.dfa.parseStr(str);
    }
    this.err_func=function(jump_info,context)
    {
        console.log("DFA PARSING ERROR: "+jump_info.fromNode+" --["+jump_info.token+"]--> "+jump_info.toNode+" --- [Status: "+jump_info.status_desc+"]");
    }
    this.name_accu="";
    this.value_accu="";
    this.variable_name;
    this.add_name=function(jump_info,context)
    {
        this.name_accu+=jump_info.token;
    }
    this.add_value=function(jump_info,context)
    {
        this.value_accu+=jump_info.token;
    }
    this.set_variable_name=function(jump_info,context)
    {
        this.variable_name=this.name_accu;
        this.name_accu="";
    }
    this.insert_variable=function(jump_info,context)
    {
        this.value_accu+=this.data.load(this.name_accu);
        this.name_accu="";
    }
    this.insert_field=function(jump_info,context)
    {
        var a=this.name_accu.split("~");
        if(a.length>1)
        {
            var name=a[0].substr(1);
            var valu=this.data.load(name);
            //valu=translate_user_input(valu,this.name_accu.substr(a[0].length+1));
            if(a[2]=="number")
            {
                if(a[4]!="")
                {
                    if(valu.substr(0,1)=="-")
                    {
                        valu="<span style='color:"+a[4]+";'>"+valu+"</span>";
                    }
                }
                valu="<div style='text-align:right;'>"+valu+"</div>";
            }
            else if(a[2]=="thumbnail")
            {
                var size=Math.max(a[3],a[4]);
                var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[5]+"&comm="+a[6]+"_thumbnail&size="+size+"&"+name+"="+valu;
                var urld=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[5]+"&comm="+a[6]+"_download&"+name+"="+valu;
                valu='<div style="margin:3px;width:'+size+'px;height:'+size+'px;"><table><tr><td style="width:'+size+'px;height:'+size+'px;vertical-align:middle;text-align:center;"><a href="'+urld+'" target="_blank"><img src="'+url+'" style="margin-top:-3px;margin-left:-3px;max-width:'+size+'px;max-height:'+size+'px;box-shadow:2px 2px 3px 0px rgb(100,100,100);"></a></td></tr></table></div>';
            }
            else if(a[2]=="gallery" && valu!="")
            {
                var size=Math.max(a[3],a[4]);
                var url=baseurl+"sys/index.php?site="+site+"&lang="+lang+"&area="+a[5]+"&comm="+a[6]+"_thumbnail&size="+size+"&"+"picid"+"="+valu.split(",")[0];
                valu='<div style="margin:3px;width:'+size+'px;height:'+size+'px;"><table><tr><td style="width:'+size+'px;height:'+size+'px;vertical-align:middle;text-align:center;"><img src="'+url+'" style="margin-top:-3px;margin-left:-3px;max-width:'+size+'px;max-height:'+size+'px;box-shadow:2px 2px 3px 0px rgb(100,100,100);"></td></tr></table></div>';
            }
            this.value_accu+=valu;
        }
        else
        {
            this.value_accu+=this.data.load(this.name_accu.substr(1));
        }
        this.name_accu="";
    }
    this.store_variable=function(jump_info,context)
    {
        this.data.store(this.variable_name,this.value_accu);
        this.value_accu="";
    }
    this.link_func=function(jump_info,context)
    {
        //ignoring symbol
        //console.log("JUMP: "+jump_info.fromNode+" --["+jump_info.token+"]--> "+jump_info.toNode+" --- [Status: "+jump_info.status_desc+"]");
    }
}

main_loader.ready();
