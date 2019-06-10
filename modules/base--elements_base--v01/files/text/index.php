<?php

    $r=rand();
    
    //The ID of the Website
    if(isset($_POST["site"]))$site=$_POST["site"];
    elseif(isset($_GET["site"]))$site=$_GET["site"];
    else $site="0";

    //Language
    if(isset($_POST["lang"]))$lang=$_POST["lang"];
    elseif(isset($_GET["lang"]))$lang=$_GET["lang"];
    else $lang="de-at";

    if(!isset($page))
    if(isset($_POST["page"]))$page=$_POST["page"];
    elseif(isset($_GET["page"]))$page=$_GET["page"];
    else $page="home";

    if(isset($_POST["area"]))$area=$_POST["area"];
    elseif(isset($_GET["area"]))$area=$_GET["area"];
    else $area="udef";

    if(isset($_POST["comm"]))$comm=$_POST["comm"];
    elseif(isset($_GET["comm"]))$comm=$_GET["comm"];
    else $comm="";

    if(isset($_POST["user"]))$user=$_POST["user"];
    elseif(isset($_GET["user"]))$user=$_GET["user"];
    elseif(isset($_COOKIE["user"]))$user=$_COOKIE["user"];
    else $user="0";

    if(isset($_POST["ukey"]))$ukey=$_POST["ukey"];
    elseif(isset($_GET["ukey"]))$ukey=$_GET["ukey"];
    elseif(isset($_COOKIE["ukey"]))$ukey=$_COOKIE["ukey"];
    else $ukey="";

    if(isset($_POST["akey"]))$akey=$_POST["akey"];
    elseif(isset($_GET["akey"]))$akey=$_GET["akey"];
    else $akey="";

    if(isset($_POST["mode"]))$mode=$_POST["mode"];
    elseif(isset($_GET["mode"]))$mode=$_GET["mode"];
    else $mode="std";
    
    if(isset($_POST["action"]))$action=$_POST["action"];
    elseif(isset($_GET["action"]))$action=$_GET["action"];
    else $action="nothing";
    
    //$site=checkval($site);
    $lang=checkval($lang);
    $page=checkval($page);
    //$area=checkval($area);
    //$comm=checkval($comm);
    //$user=checkval($user);
    //$ukey=checkval($ukey);
    //$akey=checkval($akey);
    //$mode=checkval($mode);
    $action=checkval($action);
    
    if($page=="home" && $action!="nothing")$page=$action;

    // --TODO-- CHECK THIS!
    if($action=="nothing")$action=$page;
    
    $module="";
    for($i=0;$i<strlen($action);$i++)
    {
        if($action[$i]=='_')break;
        $module.=$action[$i];
    }
    
    $baseurl="http://".$_SERVER["SERVER_NAME"].substr($_SERVER["REQUEST_URI"],0,strrpos($_SERVER["REQUEST_URI"],"/"));
    
    //(A)
    $baseurl=substr($baseurl,0,strlen($baseurl)-5);
    /*
    //(B)
    for($i=strlen($baseurl)-6;$i>0;$i--)
    {
        if($baseurl[$i]=='/')
        {
            $baseurl=substr($baseurl,0,$i);
            break;
        }
    }
    */
    
    include("action.php");
    
    function checkval($a)
    {
        for($i=0;$i<strlen($a);$i++)
        {
            if(!($a[$i]=='_' || $a[$i]=='|' || $a[$i]=='#' || $a[$i]=='-' || ($a[$i]>='0' && $a[$i]<='9') || ($a[$i]>='a' && $a[$i]<='z') || ($a[$i]>='A' && $a[$i]<='Z')))
            {
                $a="";
                die("<br>This page is not available!<br>");
            }
        }
        return $a;
    }
    
    function substring($str,$p,$n)
    {
        return mb_substr($str,$p,$n,"UTF-8");
    }
    
    function substring2($str,$p)
    {
        return mb_substr($str,$p,NULL,"UTF-8");
    }
    
    function get_variables($str)
    {
        $vars=array();
        if(substring($str,0,11)=="base64data:")
        {
            $f=explode(",",substring2($str,11));
            for($i=0;$i<count($f);$i++)
            {
                $pos=mb_strpos($f[$i],"=",0,"UTF-8");
                $name=mb_substr($f[$i],0,$pos,"UTF-8");
                $value=mb_substr($f[$i],$pos+1,NULL,"UTF-8");
                $value=strtr($value," ","+");
                $value=base64_decode($value);
                
                //echo "$name=$value<br>";
                $name2=$name;
                $name_index=0;
                while(isset($vars[$name2]))
                {
                    $name2=$name."[".($name_index++)."]";
                }
                $vars[$name2]=$value;
            }
        }
        else if(substring($str,0,6)=="plain:")
        {
            $f=explode(",",substring2($str,6));
            for($i=0;$i<count($f);$i++)
            {
                $pos=mb_strpos($f[$i],"=",0,"UTF-8");
                $name=mb_substr($f[$i],0,$pos,"UTF-8");
                $value=mb_substr($f[$i],$pos+1,NULL,"UTF-8");
                
                //echo "$name=$value<br>";
                $name2=$name;
                $name_index=0;
                while(isset($vars[$name2]))
                {
                    $name2=$name."[".($name_index++)."]";
                }
                $vars[$name2]=$value;
            }
        }
        return $vars;
    }
    
    function callsys_plain($module,$area,$comm,$formdata)
    {
        global $baseurl,$site,$user,$ukey;
        
        $data="";
        if($formdata!=0)
        {
            $keys=array_keys($formdata);
            for($i=0;$i<count($keys);$i++)
            {
                $name=$keys[$i];
                $value=$formdata[$name];
                $data.="&".$name."=".$value;
            }
        }
        
        //echo "calling $baseurl/sys/index.php?site=$site&area=$area&comm=$module"."_"."$comm&user=$user&ukey=$ukey".$data."<br>";
        
        $d=file("$baseurl/sys/index.php?site=$site&area=$area&comm=$module"."_"."$comm&user=$user&ukey=$ukey".$data);
        //echo $d[0]."<hr>";
        $part=explode("|",$d[0]);
        return $part;
    }

    function callsys($module,$area,$comm,$formdata)
    {
        global $baseurl,$site,$user,$ukey;
        
        $data="";
        if($formdata!=0)
        {
            $keys=array_keys($formdata);
            for($i=0;$i<count($keys);$i++)
            {
                $name=$keys[$i];
                $value=$formdata[$name];
                $data.="&".$name."=".base64_encode($value);
            }
        }
        
        //echo "calling $baseurl/sys/index.php?site=$site&area=$area&comm=$module"."_"."$comm&user=$user&ukey=$ukey".$data."<br>";
        
        $d=file("$baseurl/sys/index.php?site=$site&area=$area&comm=$module"."_"."$comm&user=$user&ukey=$ukey".$data);
        //echo $d[0]."<hr>";
        $part=explode("|",$d[0]);
        return $part;
    }

    function fetchglobal_pg($name,$default_value)
    {
        if(isset($_POST[$name]))$variable=$_POST[$name];
        elseif(isset($_GET[$name]))$variable=$_GET[$name];
        else $variable=$default_value;
        return $variable;
    }

    function fetchglobal_pg_base64($name,$default_value)
    {
        if(isset($_POST[$name]))$variable=$_POST[$name];
        elseif(isset($_GET[$name]))$variable=$_GET[$name];
        else return $default_value;
        return base64_decode($variable);
    }

    function fetchglobal_pgc($name,$default_value)
    {
        if(isset($_POST[$name]))$variable=$_POST[$name];
        elseif(isset($_GET[$name]))$variable=$_GET[$name];
        elseif(isset($_COOKIE[$name]))$variable=$_COOKIE[$name];
        else $variable=$default_value;
        return $variable;
    }

    function fetchglobal_c($name,$default_value)
    {
        if(isset($_COOKIE[$name]))$variable=$_COOKIE[$name];
        else $variable=$default_value;
        return $variable;
    }
    
    
    //
    function parse_vars($text)
    {
        $vars=[];
        $mode=0;
        $variable="";
        $value="";
        for($j=0;$j<count($text);$j++)
        {
            $a=$text[$j];
            for($i=0;$i<strlen($a);$i++)
            {
                if($mode==1)
                {
                    if($a[$i]=='_' || $a[$i]=='-' || ($a[$i]>='0' && $a[$i]<='9') || ($a[$i]>='a' && $a[$i]<='z') || ($a[$i]>='A' && $a[$i]<='Z'))
                    {
                        $variable.=$a[$i];
                    }
                    else
                    {
                        $mode=2;
                    }
                }
                if($mode==2)
                {
                    //echo "<hr>M-2 ".$a[$i]."<br>";
                    if($a[$i]=='=')
                    {
                        $mode=3;
                    }
                }
                else if($mode==3)
                {
                    //echo "<hr>M-3 ".$a[$i]." --> $variable<br>";
                    if($a[$i]=='"')
                    {
                        $mode=4;
                    }
                }
                else if($mode==4)
                {
                    if($a[$i]=='\\')
                    {
                        $mode=5;
                    }
                    else if($a[$i]=='"')
                    {
                        //echo "<hr>M-4 ".$a[$i]." --> $value<br>";
                        $vars[$variable]=$value;
                        $variable="";
                        $value="";
                        $mode=0;
                    }
                    else
                    {
                        $value.=$a[$i];
                    }
                }
                else if($mode==5)
                {
                    $value.=$a[$i];
                    $mode=4;
                }
                else
                {
                    //echo "<hr>CH ".$a[$i]."<br>";
                    if($a[$i]=='$')
                    {
                        $mode=1;
                        //echo "<hr>M1<br>";
                    }
                    else
                    {
                        //...
                    }
                }
            }
        }
        return $vars;
    }
    function parse_insert($a,$vars,$data)
    {
        $out="";
        $mode=0;
        $variable="";
        //for($j=0;$j<count($text);$j++)
        //{
            //$a=$text[$j];
            for($i=0;$i<strlen($a);$i++)
            {
                if($mode==1)
                {
                    if($a[$i]=='_' || $a[$i]=='-' || ($a[$i]>='0' && $a[$i]<='9') || ($a[$i]>='a' && $a[$i]<='z') || ($a[$i]>='A' && $a[$i]<='Z'))
                    {
                        $variable.=$a[$i];
                    }
                    else
                    {
                        $out.=$vars[$variable];
                        $variable="";
                        $mode=0;
                    }
                }
                else if($mode==2)
                {
                    if($a[$i]=='_' || $a[$i]=='-' || ($a[$i]>='0' && $a[$i]<='9') || ($a[$i]>='a' && $a[$i]<='z') || ($a[$i]>='A' && $a[$i]<='Z'))
                    {
                        $variable.=$a[$i];
                    }
                    else
                    {
                        if(isset($data[$variable]))$out.=$data[$variable];
                        else $out.="<b>UNDEFINED FIELD</b>";
                        $out.=$a[$i];
                        $variable="";
                        $mode=0;
                    }
                }
                else
                {
                    if($a[$i]=='$')
                    {
                        $mode=1;
                    }
                    else if($a[$i]=='@')
                    {
                        $mode=2;
                    }
                    else
                    {
                        $out.=$a[$i];
                    }
                }
            }
        //}
        return $out;
    }
    //--------------------------------------------------------------------------
    // PAGE NAVIGATION
    //--------------------------------------------------------------------------
    function items_nav($vars,$search_vars,$flowtask_name)
    {
        global $module;
        //var_dump($vars);
        //var_dump($search_vars);
        $cnt=$search_vars["count"];
        
        $maxitems=$search_vars["maxitems"];
        $startindex=$search_vars["startindex"];
        
        $prev_count=ceil($search_vars["startindex"]/$search_vars["maxitems"]);
        $next_count=ceil(($search_vars["count"]-$search_vars["startindex"]-$search_vars["maxitems"])/$search_vars["maxitems"]);
        $currentpos=floor($search_vars["startindex"]/$search_vars["maxitems"]);
        $o="";
        if($search_vars["count"]>0)
        {
            for($i=$currentpos-min(5,$prev_count);$i<$currentpos;$i++)
            {
                //$o.="&nbsp;&nbsp;&nbsp;<a href='JavaScript:results_nav_goto_item(".($i*$maxitems).",\"this.formular\")'>".($i+1)."</a>";
                $o.="&nbsp;&nbsp;&nbsp;<a href='index.php?action=".$module."_do_".$flowtask_name."_list&startindex=".($i*$maxitems)."&maxitems=$maxitems'>".($i+1)."</a>";
            }
            $o.="&nbsp;&nbsp;&nbsp;<b>".($currentpos+1)."</b>";
            for($i=$currentpos+1;$i<$currentpos+1+min(5,$next_count);$i++)
            {
                //$o.="&nbsp;&nbsp;&nbsp;<a href='JavaScript:results_nav_goto_item(".($i*$maxitems).",\"this.formular\")'>".($i+1)."</a>";
                $o.="&nbsp;&nbsp;&nbsp;<a href='index.php?action=".$module."_do_".$flowtask_name."_list&startindex=".($i*$maxitems)."&maxitems=$maxitems'>".($i+1)."</a>";
            }
            $o=$vars["page"]." $o";
        }
        return $o;
    }
    //--------------------------------------------------------------------------
    // GLOBAL CONTEXT
    //--------------------------------------------------------------------------
    $global_context=[];
    function context_store($name,$value)
    {
        global $global_context;
        $global_context["$name"]=$value;
    }
    function context_store_db()
    {
        global $global_context,$module_name;
        callsys($module_name,"user","search_context_store",$global_context);
    }
    function context_load_db()
    {
        global $global_context,$module_name;
        $part=callsys($module_name,"user","search_context_load",0);
        if($part[0]=="[OK]")
        {
            $part_index=2;
            while($part_index<count($part))
            {
                $vars=get_variables($part[$part_index]);
                $name=$vars["bezeichnung"];
                $value=$vars["datastring"];
                $global_context["$name"]=$value;
                //echo "laded context variable: $name=$value<br>";
                $part_index++;
            }
            //echo "end of context<br>";
        }
        else
        {
            echo "context loading error<br>";
        }
    }
    function context_load($name,$default_value)
    {
        global $global_context;
        //echo "-- $name -- = ".$global_context["$name"]."<br>";
        if(isset($global_context["$name"]))return $global_context["$name"];
        return $default_value;
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv='Expires' content='0'>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <?php
            include("keywords.php");
        ?>
    </head>
    <body leftmargin='10' topmargin='10'>
        <?php
            include("content.php");
        ?>
    </body>
</html>