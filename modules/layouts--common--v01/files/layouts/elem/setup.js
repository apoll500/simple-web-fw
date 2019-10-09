/*******************************************************************************
*                                                                              *
*  common setup                                                                *
*                                                                              *
*******************************************************************************/
function elements_setup(content_str,element,style)
{
    //console.log("elements_setup(\"...\",,"+style+") for "+element.content_token);
    
    var success=false;
    
    //run individual setup
    if(typeof window["run_individual_setup_"+element.name] == 'function')
    {
        success=window["run_individual_setup_"+element.name](content_str,element,style);
    }
    
    if(!success)
    {
        //fallback
        success=run_standard_setup(content_str,element,style);
        if(!success)
        {
            //fallback2
            success=run_standard_setup(content_str,element,"plain");
            if(!success)
            {
                //fallback3
                success=run_universal_setup(content_str,element);
                if(!success)
                {
                    //fallback4
                    success=run_error_setup(content_str,element);
                }
            }
        }
    }
    
    element.object.onResize();
    
    //fill form
    if(typeof element.vars_context == 'object')
    {
        if(element.vars_context.load("$mode")=="fill")
        {
            // 1) fill inputs
            for(var i=0;i<document.forms.length;i++)
            {
                for(var j=0;j<document.forms[i].elements.length;j++)
                {
                    var value=element.vars_context.get("$"+document.forms[i].elements[j].name);
                    if(value)document.forms[i].elements[j].value=value;
                }
            }
            // 2) fill §placeholders
            if(element.object.box)
                for(var i=0;i<element.vars_context.container.length;i++)
                {
                    replace_in_tree("",element.object.box,element.vars_context.container[i].filename.substr(1),element.vars_context.container[i].filedata);
                }
            // 3) mark as done
            element.vars_context.store("$mode","null");
        }
    }
    
    return success;
}
function run_standard_setup(content_str,element,style)
{
    if(typeof window["run_standard_setup_"+element.name] == 'function')
    {
        return window["run_standard_setup_"+element.name](content_str,element,style);
    }
    return false;
}
function run_universal_setup(content_str,element)
{
    return false;
}
function run_error_setup(content_str,element)
{
    return true;
}

main_loader.ready();
