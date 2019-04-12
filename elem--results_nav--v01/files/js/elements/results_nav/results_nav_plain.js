//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");
//main_loader.load("js/common/setup/s_main_plain.js");

function results_nav_plain(pdiv,adiv,formular)
{
    this.formular=formular;

    pdiv.innerHTML="";
    this.content=document.createElement("div");
    pdiv.appendChild(this.content);
    
//public:
    this.destroy=function()
    {
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
    this.setup=function(s)
    {
    }
    this.setup_data=function(data,id)
    {
        var count=parseInt(data.load("count"));
        var startindex=parseInt(data.load("startindex"));
        var maxitems=parseInt(data.load("maxitems"));
        
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
            
            //goto first page
            if(first_index>0)
            {
                o+="&nbsp;&nbsp;&nbsp;<a href='JavaScript:results_nav_goto_item(0,\""+this.formular+"\")'>&lt;&lt;</a>";
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
            
            //goto last page
            if(last_index<=last_page)
            {
                o+="&nbsp;&nbsp;&nbsp;<a href='JavaScript:results_nav_goto_item("+(last_page*maxitems)+",\""+this.formular+"\")'>&gt;&gt;</a>";
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
