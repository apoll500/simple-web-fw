/*******************************************************************************
*                                                                              *
*  standard setup                                                              *
*                                                                              *
*******************************************************************************/
function run_standard_setup_navbar(content_str,element,style)
{
    //console.log("run_standard_setup_main(\"...\",,"+style+") for "+element.content_token);
    switch(style)
    {
        case "simple":
            return run_standard_setup_navbar_simple(content_str,element);
        case "plain":
            return run_standard_setup_navbar_plain(content_str,element);
        default:
            return false;
    }
    return true;
}
/*******************************************************************************
*                                                                              *
*  simple                                                                      *
*                                                                              *
*******************************************************************************/
function run_standard_setup_navbar_simple(content_str,element)
{
    if(content_str==element.object.content && element.object.cpage==currentpage)
    {
        return true;
    }
    element.object.content=content_str;
    element.object.cpage=currentpage;
    
    var o="";
    var lines=content_str.split("\n");
    for(var i=0;i<lines.length;i++)
    {
        var a=lines[i].split("|");
        if(a[2]==currentpage.substr(0,a[2].length))style="topnav2";else style="topnav";
        o+="<a href=\""+a[1]+"\" class=\""+style+"\">"+a[0]+"</a>";
        if(i+1<lines.length)o+="&nbsp;|&nbsp;";
    }
    o+="</nobr>";
        
    element.object.box_inner.innerHTML=o;

    return true;
}
/*******************************************************************************
*                                                                              *
*  plain                                                                       *
*                                                                              *
*******************************************************************************/
function run_standard_setup_navbar_plain(content_str,element)
{
    var o="";
    var lines=content_str.split("\n");
    for(var i=0;i<lines.length;i++)
    {
        var a=lines[i].split("|");
        o+="[<a href=\""+a[1]+"\">"+a[0]+"</a>]";
        if(i+1<lines.length)o+="&nbsp;|&nbsp;";
    }
        
    element.object.box_inner.innerHTML=o;

    return true;
}

main_loader.ready();
