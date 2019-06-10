//requires:
//  js/elements/base.js
//  js/elements/flap_box/flap_box.css

main_loader.load("js/animate/animate.js");

function loginbar_simple(pdiv)
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
        var o="\
        <div class='toptop' align='right'>\
            <div class='toptopi'>\
                loading...\
            </div>\
        </div>";
        this.box.innerHTML=o;
    }
    
//private:
    this.setup=function(s)
    {
        if(s.substr(0,3)=="OK:")
        {
            var o="\
            <div class='toptop' align='right'>\
                <div class='toptopi'>\
                    "+s.substr(3)+"\
                    <a class='fadmin_topbar_link' href='JavaScript:fadmin_topbar_logout()'>logout</a>\
                </div>\
            </div>";
            this.box.innerHTML=o;
        }
        else
        {
            var o="\
            <div class='toptop' align='right'>\
                <div class='toptopi'>\
                    <form name='fadmin_topbar_form' method='POST' action='JavaScript:fadmin_topbar_login()'>\
                    username: <input type='text' name='username' value='' size='6'> password: <input type='password' name='userpass' size='6'> <input type='submit' value='login'>&nbsp;\
                    </form>\
                </div>\
            </div>";
            this.box.innerHTML=o;
        }
    }
}

main_loader.ready();
