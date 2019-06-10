//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function loginbar_plain(pdiv)
{
    this.box=document.createElement("div");
    pdiv.appendChild(this.box);
    
//public:
    this.destroy=function()
    {
        pdiv.removeChild(this.box);
    }
    this.preset=function()
    {
        //var o="loading...<hr>";
        //this.box.innerHTML=o;
    }
    
//private:
    this.setup=function(s)
    {
        if(s.substr(0,3)=="OK:")
        {
            var o="\
                    "+s.substr(3)+"\
                    <a href='JavaScript:fadmin_topbar_logout()'>logout</a>\
                    <hr>";
            this.box.innerHTML=o;
        }
        else
        {
            var o="\
                    <form name='fadmin_topbar_form' action='fadmin_topbar_login()'>\
                    username: <input type='text' name='username' value='' size='6'> password: <input type='password' name='userpass' size='6'> <input type='submit' value='login'>&nbsp;\
                    </form>\
                    <hr>";
            this.box.innerHTML=o;
        }
        update();
    }
}

main_loader.ready();
