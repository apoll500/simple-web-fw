
main_loader.load("layouts/elem/main/webforms.js");

/*******************************************************************************
*                                                                              *
*  individual setup                                                            *
*                                                                              *
*******************************************************************************/
function run_individual_setup_main(content_str,element,style)
{
    //console.log("run_individual_setup_main(\"...\",,"+style+") for "+element.content_token);
    switch(style)
    {
        case "standard":
            return run_individual_setup_main_content(content_str,element,style);
        case "simple":
            return run_individual_setup_main_content(content_str,element,style);
            //return false;
        case "plain":
            return false;
        default:
            return false;
    }
    return true;
}
/*******************************************************************************
*                                                                              *
*  content specific setup                                                      *
*                                                                              *
*******************************************************************************/
function run_individual_setup_main_content(content_str,element,style)
{
    //console.log("[LAYOUT:] "+element.content_token);
    var g=new form_generator();
    var i=0;
    
    var module_name=element.content_token.substr(0,element.content_token.indexOf("_"));
    var token=element.content_token.substr(element.content_token.indexOf("_")+1);
    
    if(typeof window["run_individual_setup_main_content_"+module_name+"_MODEL"] == 'function')
    {
        window["run_individual_setup_main_content_"+module_name+"_MODEL"](g,token,style)
    }
    g.feed_content(content_str);
    if(typeof window["run_individual_setup_main_content_"+module_name+"_ELEMENTS"] == 'function')
    {
        i=window["run_individual_setup_main_content_"+module_name+"_ELEMENTS"](i,g,token,style)
    }
    
    element.object.formatter=g;
    return false;
}
/*******************************************************************************
*                                                                              *
*  element formatter                                                           *
*                                                                              *
*******************************************************************************/
function format_form_element(o,e,fs,tx,ty,txx,tyy,px,py,pxx,pyy,mode,err)
{
    e.style.position="absolute";
    e.style.left=px+"px";
    e.style.top=py+"px";
    e.style.width=pxx+"px";
    e.style.height=pyy+"px";
    e.style.fontSize=fs+"pt";
    e.style.padding="0px";
    e.style.margin="0px";
    e.style.borderRadius="0px";
    e.style.border="solid 1px #999999";
    if(err=="hold")
    {
        e.style.borderColor="#FF7700";
        e.style.borderBottomWidth="5px";
    }
}
function format_form_element_title(o,t,fs,tx,ty,txx,tyy,px,py,pxx,pyy,mode,err)
{
    t.style.position="absolute";
    t.style.left=tx+"px";
    t.style.top=ty+"px";
    t.style.width=txx+"px";
    t.style.height=tyy+"px";
    t.style.fontSize=(fs*0.75)+"pt";
    t.style.color="#FFFFFF";
    t.style.padding="0px";
    t.style.margin="0px";
    t.style.border="solid 2px #DDDDDD";
    t.style.backgroundColor="#999999";
    t.style.borderRadius="5px 5px 0px 0px";
    t.style.padding="2px";
    t.style.marginLeft="-2px";
}
/*******************************************************************************
*                                                                              *
*  common elements setup                                                       *
*                                                                              *
*******************************************************************************/
function STD_search_model(g,module)
{
    var i=g.add_model(2,"sform1",module,0,0,640,85,640,85);
    return i;
}
function STD_search_model2(g,form,module)
{
    var i=g.add_model(2,form,module,0,0,640,85,640,85);
    return i;
}
function STD_search_elements(g,i)
{
    g.pos(i,"token",0,20,100,25,    0,40,220,23);
    g.pos(i,"b01",  0,20,100,14,    224,40,100,25);
    g.cpo(i,500,300);
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function common_STD_element_gr(g,i,name,x,y,xx,yy)
{
    common_STD_element(g,i,name,x*20,y*50+20,xx*20-1,yy*23)
}
function common_STD_element_gr2(g,i,name,x,y,xx,yy)
{
    common_STD_element(g,i,name,x*20,y*50+20,xx*20-1,yy*23+2)
}
function common_STD_element(g,i,name,x,y,xx,yy)
{
    g.pos(i,name,x,y-20,Math.min(100,xx-10),yy-9,    x,y,xx,yy);
}
main_loader.ready();
