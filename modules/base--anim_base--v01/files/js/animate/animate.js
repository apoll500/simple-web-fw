
//------------------------------------------------------------------------------
// This is the old (outdated) version using setInterval().
//------------------------------------------------------------------------------

//Animation Status
var anim_time=0;
var anim_duration=100;
var anim=null;

function start_animation(duration)
{
    if(anim==null)
    {
        anim_duration=duration;
        anim_time=0;
        anim=setInterval(animate,50);
    }
}

function stop_animation()
{
    clearTimeout(anim);
	
	//Elements
    for(var i=0;i<main_elements_counter;i++)
    {
        main_elements[i].update();
        main_elements[i].end_anim();
    }
	
    anim=null;
}

function animate()
{
    var p=animpos(anim_time);
	
	//Elements
    for(var i=0;i<main_elements_counter;i++)
    {
        main_elements[i].animate(p);
    }
    
	if(p==1)stop_animation();
    anim_time++;
}

function animpos(t)
{
    //linear
    var p=t/anim_duration;
    if(p>0.99)p=1;
    return p;
}

main_loader.ready();
