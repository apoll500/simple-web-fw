
//-----------------------------------------------------------------------------
//------------------------------------------------------------------------------
var pagedata_ecount=1;
var pagedata_loaded=0;
var dataevent=new Array(16);for(var i=1;i<16;i++){dataevent[i]=null;}
function dataevent_reset(n)
{
    //--TODO--
    if(startup)
    {
        console.log("startup loading out of order!");
        dataevent_reset_clean(n);
        return;
    }
    //console.log("reset");
    //
    pagecount++;
    pagedata_ecount=n;
    pagedata_loaded=0;
    //console.log("dataevent_reset "+n);
}
function dataevent_reset_clean(n)
{
    pagedata_ecount=n;
    pagedata_loaded=0;
}
function dataevent_store(bit,type,context,module,evt)
{
    return dataevent_store2(type,context,module,evt);
}
function dataevent_store2(type,context,module,evt)
{
    if(dataevent_checkbits(pagedata_loaded,pagedata_ecount))
    {
        //console.log("dataevent_store2 - TRUE");
        return true;
    }
    else
    {
        var bit=dataevent_nextnullbit(pagedata_loaded,pagedata_ecount);
        dataevent[bit]={"type":type+"|"+context+"|"+module,"event":evt};
        pagedata_loaded=pagedata_loaded | (1<<bit);
        //console.log("dataevent_store2 - bit "+bit+"");
        return false;
    }
}
function dataevent_store0()
{
    if(dataevent_checkbits(pagedata_loaded,pagedata_ecount))
    {
        //console.log("dataevent_store0 - TRUE");
        return false;
    }
    else
    {
        var bit=dataevent_nextnullbit(pagedata_loaded,0);
        pagedata_loaded=pagedata_loaded | (1<<bit);
        //console.log("dataevent_store0 - bit "+bit+"");
        return true;
    }
}
function dataevent_run()
{
    if(dataevent_checkbits(pagedata_loaded,pagedata_ecount))
    {
        for(var bit=pagedata_ecount;bit<32;bit++)
        {
            var h=(1<<bit);
            if((pagedata_loaded & h)==h)
            {
                pagedata_loaded=(pagedata_loaded & (~(1<<bit)));
                main_handler.onEvent(dataevent[bit].type,dataevent[bit].event);
            }
        }
    }
}
function dataevent_checkbits(data,bitcount)
{
    for(var bit=0;bit<bitcount;bit++)
    {
        if((data & (1<<bit))==0)return false;
    }
    return true;
}
function dataevent_nextnullbit(data,startbit)
{
    var bit;
    for(bit=startbit;bit<32;bit++)
    {
        if((data & (1<<bit))==0)return bit;
    }
    return bit;
}

main_loader.ready();
