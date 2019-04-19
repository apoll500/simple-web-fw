/*******************************************************************************
*                                                                              *
*  standard setup                                                              *
*                                                                              *
*******************************************************************************/
function run_standard_setup_foot(content_str,element,style)
{
    //console.log("run_standard_setup_main(\"...\",,"+style+") for "+element.content_token);
    switch(style)
    {
        case "simple":
            return run_standard_setup_foot_simple(content_str,element);
        case "plain":
            return run_standard_setup_foot_plain(content_str,element);
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
function run_standard_setup_foot_simple(content_str,element)
{
    var o="";
    var lines=content_str.split("\n");
    for(var i=0;i<lines.length;i++)
    {
        if(lines[i]=="BEGIN_COLUMN")
        {
            o+="<div class='botcolumn'>";
        }
        else if(lines[i]=="END_COLUMN")
        {
            o+="</div>";
        }
        else if(lines[i]=="COPYINFO")
        {
            o+="<span class='copyinfo'><i>"+copyright_info+"</i></span><br>";
        }
        else
        {
            var a=lines[i].split("|");
            if(a.length==1)
            {
                o+="<b>"+lines[i]+"</b><br>";
            }
            else
            {
                o+="<a class=\"footlink\" href=\""+a[1]+"\">"+a[0]+"</a><br>";
            }
        }
    }
    element.object.box.innerHTML=o;

    return true;
}
/*******************************************************************************
*                                                                              *
*  plain                                                                       *
*                                                                              *
*******************************************************************************/
function run_standard_setup_foot_plain(content_str,element)
{
    var o="<hr>";
    var lines=content_str.split("\n");
    for(var i=0;i<lines.length;i++)
    {
        if(lines[i]=="BEGIN_COLUMN")
        {
            o+="<br>";
        }
        else if(lines[i]=="END_COLUMN")
        {
        }
        else if(lines[i]=="COPYINFO")
        {
            o+="<i>"+copyright_info+"</i><br>";
        }
        else
        {
            var a=lines[i].split("|");
            if(a.length==1)
            {
                o+="<b>"+lines[i]+"</b><br>";
            }
            else
            {
                o+="<a href=\""+a[1]+"\">"+a[0]+"</a><br>";
            }
        }
    }
    element.object.box.innerHTML=o;

    return true;
}

main_loader.ready();
