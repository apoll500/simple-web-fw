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
