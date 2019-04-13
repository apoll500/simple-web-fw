

function loadstat(pdiv)
{
    this.bg=document.createElement("div");
    this.box=document.createElement("div");
    this.bar=document.createElement("div");
    this.info=document.createElement("div");
    
    this.bg.className="loadstat_bg";
    this.box.className="loadstat_box";
    this.bar.className="loadstat_bar";
    this.info.className="loadstat_info";
    
    this.box.appendChild(this.bar);
    pdiv.appendChild(this.bg);
    pdiv.appendChild(this.box);
    pdiv.appendChild(this.info);
    this.info.innerHTML="<a href='JavaScript:global_loadstat.destroy();new sysmod_box(\"Es ist ein Fehler aufgetreten:<br>Die Website wurde nur unvollständig geladen.<br>Laden Sie die Seite neu um Fehlfunktionen zu vermeiden.\");' style='color:#115577;text-decoration:none;'>&lt;abbrechen&gt;</a>&nbsp;&nbsp;&nbsp;<a href='JavaScript:main_loader.ready_callback();new sysmod_box(\"Es ist ein Fehler aufgetreten:<br>Die Website wurde möglicherweise nicht vollständig geladen.<br>Laden Sie die Seite neu um Fehlfunktionen zu vermeiden.\");' style='color:#115577;text-decoration:none;'>&lt;&uuml;berspringen&gt;</a>";
    
	single_capture=this;

//public:
    this.destroy=function()
    {
        pdiv.removeChild(this.bg);
        pdiv.removeChild(this.box);
        pdiv.removeChild(this.info);
		single_capture=null;
        
        main_loader.loaded_counter=main_loader.maxfiles;
        main_loader.ready_counter=main_loader.maxfiles;
    }
    this.onEvent=function(type,evt)
    {
        switch(type)
        {
            case "update":
                this.update(evt);
                break;
        }
    }
    
//private:
    this.update=function(p)
    {
        this.bar.innerHTML=Math.round(p*100)+"%";
        this.bar.style.width=(p*98)+"%";
    }
}
