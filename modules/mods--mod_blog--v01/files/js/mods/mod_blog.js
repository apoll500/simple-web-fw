//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
main_loader.load("js/parser/webfw_varpars.js");
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function mods_blog_load(token)
{
    mods_load("blog",token);
}
function mods_blog_load2(token,data)
{
    mods_load_data("blog",token,data);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function mods_blog_load_clean(token,data)
{
    //console.log("mods_site_load_clean() -- "+token+" "+data);
    switch(token)
    {
        case "load":
            if(data[5]>='0' && data[5]<='9')
            {
                dataevent_reset_clean(4);
                //main_handler.onEvent("page",data);
                e_mbox.load2(data,"left");
                load_element_first("results_nav","simple",4);
                //main_handler.onClick0("memshow||blog","area=user&comm=user_logstat");
                main_handler.onClick0("load_comments||blog","area=public&comm=commentsUser_search2&blog_token="+btoa(data.substr(5)));
                //main_handler.onClick0("memshow||blog","area=user&comm=user_logstat");
                main_handler.loadText0("store_file","blog_list_nav");
                main_handler.loadText0("store_file","blog_list_item");
            }
            else
            {
                e_mbox.load2(data,"left");
            }
            break;
        case "new_comment":
            //dataevent_reset_clean(4);
            //console.log(data);
            e_mbox.load2("blog_new_comment","left");
            main_handler.onClick0("memshow|"+data+"|blog","area=user&comm=user_logstat");
            break;
        default:
            new sysmod_box("mods_blog_load_clean()<br>unknown token: "+token+"<br>Module: blog");
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function mods_blog_run(token)
{
    mods_blog_run2(token,"");
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function mods_blog_run2(token,data)
{
    //console.log("mods_site_run() -- "+token);
    switch(token)
    {
        case "user_submit":
            document.mform.startindex.value=0;
        case "do_list":
        case "do_search":
            dataevent_reset(3);
            load_element_first("results_nav","simple",4);
            main_handler.onClick0("load_comments||blog","area=public&comm=commentsUser_search2&token="+btoa(document.mform.token.value)+"&blog_token="+btoa(document.mform.blog_token.value)+"&startindex="+btoa(document.mform.startindex.value)+"&maxitems="+btoa(document.mform.maxitems.value));
            main_handler.loadText0("store_file","blog_list_nav");
            main_handler.loadText0("store_file","blog_list_item");
            break;
        default:
            new sysmod_box("mods_blog_run()<br>unknown token: "+token+"<br>Module: blog");
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function mods_blog_handle(handler,type,evt,context)
{
    //console.log("mods_site_handle() -- type="+type+" -- context="+context+" -- event="+evt);
    var part=evt.split("|");
    switch(type)
    {
        case "load_comments":
            handler_run_std(handler,"blog",evt,type,context,"mform,list",handler_handle_search_results_comments);
            break;
        case "memshow":
            handler_run_std(handler,"blog",evt,type,context,context,blog_memshow_info);
            break;
        default:
            return 1;
    }
    return 0;
}

function blog_memshow_info(handler,module,evt,type,context,data,part)
{
    handler_memshow(handler,module,evt,type,context,"",part);
    document.getElementById("posting_link").innerHTML="<a href='JavaScript:mods_blog_load2(\"load\",\""+context+"\")'>"+context.substr(5)+"</a>";
    document.mform.blog_token.value=context.substr(5);
}

main_loader.ready();
