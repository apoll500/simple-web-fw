<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv='Expires' content='0'>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <?php
            include("text/start_keywords.php");
            $r=rand(0,1234567);
        ?>
        <link rel="stylesheet" type="text/css" href="js/elements/loadstat/loadstat.css?r=<?php echo $r; ?>">
        <link rel="stylesheet" type="text/css" href="main.css?r=<?php echo $r; ?>">
        <script>
            <?php
                if(isset($_GET["page"]))echo "var currentpage=\"".$_GET["page"]."\";";
                else echo "var currentpage=\"home\";";
                if(isset($_GET["style"]))echo "var gstyle=\"".$_GET["style"]."\";";
                else echo "var gstyle=\"simple\";";
                if(isset($_GET["lang"]))echo "var lang=\"".$_GET["lang"]."\";";
                else echo "var lang=\"de-at\";";
                if(isset($_GET["data"]))echo "var currentdata=atob(\"".$_GET["data"]."\");\n";
                else echo "var currentdata=\"\";\n";
            ?>
            var startup=true;
            interpet_currentdata();
            window.onpopstate=function(event)
                    {
                        var loc=document.location+"";//cast to string
                        var new_page=loc_get_param(loc,"page","");
                        var new_style=loc_get_param(loc,"style","simple");
                        lang=loc_get_param(loc,"lang","de-at");
                        currentdata=loc_get_param(loc,"data","");
                        if(currentdata!="")currentdata=atob(currentdata);
                        interpet_currentdata();
                        load_page_clean(new_page);
                    };
            function interpet_currentdata()
            {
                if(currentdata.substr(0,8)=="#array#,")
                {
                    currentdata=currentdata.substr(8).split(",");
                }
            }
            function loc_get_param(loc,name,def)
            {
                var pos=loc.search(name+"=");
                if(pos==-1)return def;
                var pos2=loc.substr(pos+name.length+1).search("&");
                if(pos2==-1)return loc.substr(pos+name.length+1);
                return loc.substr(pos+name.length+1,pos2);
            }
        </script>
    </head>
    <body leftmargin='0' topmargin='0' style='margin:0px;color:#000000;background-color:#FFFFFF;'>
        <div id="MAIN"></div>
        <div id="fix_microloader_background" style="position:absolute;top:0px;width:100%;height:3px;background-color:#CCCCCC;"></div>
        <div id="fix_microloader_satus" style="position:absolute;top:0px;left:0px;width:10%;height:3px;background-color:#3377AA;"></div>
        <script src="js/elements/loadstat/loadstat.js?r=<?php echo $r; ?>"></script>
        <script src="js/elements/loader.js?r=<?php echo $r; ?>"></script>
        <script src="js/elements/base.js?r=<?php echo $r; ?>"></script>
        <script src="main.js?r=<?php echo $r; ?>"></script>
        <noscript>
            <?php
                include("text/start_content.php");
            ?>
        </noscript>
    </body>
</html>
