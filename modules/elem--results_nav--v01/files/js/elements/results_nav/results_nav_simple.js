//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");
//main_loader.load("js/common/setup/s_main_simple.js");

function results_nav_simple(pdiv,adiv,formular)
{
    this.formular=formular;
    
    pdiv.innerHTML="";
    this.content=document.createElement("div");
    this.content.className="results_nav_simple_text";
    pdiv.appendChild(this.content);
    main_elements_add(this);

//public:
    this.destroy=function()
    {
        main_elements_remove(this);
        pdiv.removeChild(this.content);
    }
    this.onEvent=function(type,evt)
    {
    }
    this.preset=function()
    {
        this.content.innerHTML="loading...";
    }
    this.mbox=function()
    {
        return this.content;
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
    this.setup_data=function(data,id)
    {
        var count=parseInt(data.load("count"));
        var startindex=parseInt(data.load("startindex"));
        var maxitems=parseInt(data.load("maxitems"));
        
        var full_list_mode=false;
        if(startindex==-1)
        {
            startindex=0;
            full_list_mode=true;
        }
        
        var prev_count=Math.ceil(startindex/maxitems);
        var next_count=Math.ceil((count-startindex-maxitems)/maxitems);
        var currentpos=Math.floor(startindex/maxitems);
        
        if(count>0)
        {
            var o="";
            
            //first and last page number of clickable page numbers, where counting starts with 0.
            var first_index=currentpos-Math.min(5,prev_count);
            var last_index=currentpos+1+Math.min(5,next_count);
            var last_page=Math.ceil((count-maxitems)/maxitems);
            
            //number of last existing page.
            
            //
            var show_goto_page=false;
            
            if(full_list_mode==false)
            {
                //goto first page
                if(first_index>0)
                {
                    o+="&nbsp;<span id='results_nav_gotofirst_"+id+"' style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><a href='JavaScript:results_nav_goto_item(0,\""+this.formular+"\")' style='text-decoration:none;color:#3377AA;' onMouseOver=\"results_nav_hover_element('results_nav_gotofirst_"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_gotofirst_"+id+"')\">&lt;&lt;</a></span>";
                    show_goto_page=true;
                }
                
                //goto prev. page
                if(currentpos>0)
                {
                    o+="&nbsp;<span id='results_nav_gotoprev_"+id+"' style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><a href='JavaScript:results_nav_goto_item("+(currentpos-1)*maxitems+",\""+this.formular+"\")' style='text-decoration:none;color:#3377AA;' onMouseOver=\"results_nav_hover_element('results_nav_gotoprev_"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_gotoprev_"+id+"')\">&lt;</a></span>";
                }
                
                for(var i=first_index;i<currentpos;i++)
                {
                    o+="&nbsp;&nbsp;&nbsp;<a href='JavaScript:results_nav_goto_item("+(i*maxitems)+",\""+this.formular+"\")'>"+(i+1)+"</a>";
                }
                o+="&nbsp;&nbsp;&nbsp;<b>"+(currentpos+1)+"</b>"
                for(var i=currentpos+1;i<last_index;i++)
                {
                    o+="&nbsp;&nbsp;&nbsp;<a href='JavaScript:results_nav_goto_item("+(i*maxitems)+",\""+this.formular+"\")'>"+(i+1)+"</a>";
                }
                
                o+="&nbsp;&nbsp;";
                
                //goto next page
                if(currentpos<last_page)
                {
                    o+="&nbsp;<span id='results_nav_gotonext_"+id+"' style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><a href='JavaScript:results_nav_goto_item("+(currentpos+1)*maxitems+",\""+this.formular+"\")' style='text-decoration:none;color:#3377AA;' onMouseOver=\"results_nav_hover_element('results_nav_gotonext_"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_gotonext_"+id+"')\">&gt;</a></span>";
                }
                
                //goto last page
                if(last_index<=last_page)
                {
                    o+="&nbsp;<span id='results_nav_gotolast_"+id+"' style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><a href='JavaScript:results_nav_goto_item("+(last_page*maxitems)+",\""+this.formular+"\")' style='text-decoration:none;color:#3377AA;' onMouseOver=\"results_nav_hover_element('results_nav_gotolast_"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_gotolast_"+id+"')\">&gt;&gt;</a></span>";
                    show_goto_page=true;
                }
                
                //goto input page
                if(show_goto_page)
                {
                    //o+="&nbsp;<span style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><input id='results_nav_page_input' type='text' name='page' style='width:32px;font-size:8pt;border:none;'><input type='button' value='&#x21B4;' name='bb' onClick='JavaScript:results_nav_goto_item(Math.max(0,Math.min("+last_page+",(parseInt(document.getElementById(\"results_nav_page_input\").value)-1)))*"+maxitems+",\""+this.formular+"\")' style='background-color:#CCCCCC;font-size:8pt;border:none;'></span>";
                    
                    o+="&nbsp;<nobr><input id='results_nav_page_input_"+id+"' type='text' name='page' style='padding:0px;width:32px;height:22px;font-size:12pt;border:solid 1px #AAAAAA;border-radius:5px 0px 0px 5px;'><input type='button' id='results_nav_page_input_button"+id+"' value='&#x21B4;' name='bb' onClick='JavaScript:results_nav_goto_item(Math.max(0,Math.min("+last_page+",(parseInt(document.getElementById(\"results_nav_page_input_"+id+"\").value)-1)))*"+maxitems+",\""+this.formular+"\")' style='position:relative;top:1px;left:-1px;padding:0px;color:#3377AA;background-color:#DDDDDD;font-size:14pt;border:solid 1px #AAAAAA;border-radius:0px 5px 5px 0px;' onMouseOver=\"results_nav_hover_element('results_nav_page_input_button"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_page_input_button"+id+"')\"></nobr>";
                }
            }
            else
            {
                o+="&nbsp;<span id='results_nav_pages_"+id+"' style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><a href='JavaScript:results_nav_goto_item(0,\""+this.formular+"\")' style='text-decoration:none;color:#3377AA;' onMouseOver=\"results_nav_hover_element('results_nav_pages_"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_pages_"+id+"')\">pages</a></span>";
            }
            
            //full list
            if(last_page>=1 && full_list_mode==false)
            {
                o+="&nbsp;<span id='results_nav_full_"+id+"' style='padding:3px;background-color:#DDDDDD;border-radius:5px;border:solid 1px #AAAAAA;'><a href='JavaScript:results_nav_goto_item(-1,\""+this.formular+"\")' style='text-decoration:none;color:#3377AA;' onMouseOver=\"results_nav_hover_element('results_nav_full_"+id+"')\" onMouseOut=\"results_nav_reset_element('results_nav_full_"+id+"')\">full</a></span>";
            }
            
            this.content.innerHTML="<span>"+data.load("$page")+" "+o+"</span>";
        }
        else
        {
            this.content.innerHTML="<span>- no data found -</span>";
        }
    }
}

main_loader.ready();
