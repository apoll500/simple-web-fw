<?php

//------------------------------------------------------------------------------
// BACKDOOR !!!
//------------------------------------------------------------------------------
$backdoor="closed";//if set to "open", $backdoor_user will have logged in status.
$backdoor_user=56;
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// ENTRY POINT
//------------------------------------------------------------------------------
$glindex=true;
//------------------------------------------------------------------------------

//The ID of the Website
if(!isset($site))
if(isset($_POST["site"]))$site=$_POST["site"];
elseif(isset($_GET["site"]))$site=$_GET["site"];
else $site="0";

//Language
if(!isset($lang))
if(isset($_POST["lang"]))$lang=$_POST["lang"];
elseif(isset($_GET["lang"]))$lang=$_GET["lang"];
else $lang="de";

if(!isset($area))
if(isset($_POST["area"]))$area=$_POST["area"];
elseif(isset($_GET["area"]))$area=$_GET["area"];
else $area="udef";

if(!isset($comm))
if(isset($_POST["comm"]))$comm=$_POST["comm"];
elseif(isset($_GET["comm"]))$comm=$_GET["comm"];
else $comm="";

if(!isset($user))
if(isset($_POST["user"]))$user=$_POST["user"];
elseif(isset($_GET["user"]))$user=$_GET["user"];
elseif(isset($_COOKIE["user"]))$user=$_COOKIE["user"];
else $user="0";

if(!isset($ukey))
if(isset($_POST["ukey"]))$ukey=$_POST["ukey"];
elseif(isset($_GET["ukey"]))$ukey=$_GET["ukey"];
elseif(isset($_COOKIE["ukey"]))$ukey=$_COOKIE["ukey"];
else $ukey="";

if(!isset($akey))
if(isset($_POST["akey"]))$akey=$_POST["akey"];
elseif(isset($_GET["akey"]))$akey=$_GET["akey"];
else $akey="";

if(!isset($mode))
if(isset($_POST["mode"]))$mode=$_POST["mode"];
elseif(isset($_GET["mode"]))$mode=$_GET["mode"];
else $mode="std";

if(!isset($eout))
if(isset($_POST["eout"]))$eout=$_POST["eout"];
elseif(isset($_GET["eout"]))$eout=$_GET["eout"];
else $eout="std";

$echo_output="";

//------------------------------------------------------------------------------
// BACKDOOR !!!
//------------------------------------------------------------------------------
if($backdoor=="open"){$user=$backdoor_user;}
//------------------------------------------------------------------------------

if($area=="user")
{
    require("base/mysql/common.php");
    require("base/login/common.php");
    connectmysql();

    if(login_check($user,$ukey))
    {
        $module=stristr($comm,"_",true);
        if(!ismodule($module))return;
        include("mods/$module/run/$area.php");
    }
    else
    {
        sysout("[E105]|no login.\n");
    }

    closemysql();
}
elseif($area=="public")
{
    $module=stristr($comm,"_",true);
    if(!ismodule($module))return;
    include("mods/$module/run/$area.php");
}
elseif($area=="admin")
{
    require("base/mysql/common.php");
    require("base/login/common.php");
    connectmysql();

    $ls=login_check_user_status($user,$ukey);
    if($ls=="ADMIN" || $ls=="DEVELOPER")
    {
        $adminstatus="ADMIN";
        $module=stristr($comm,"_",true);
        if(!ismodule($module))return;
        include("mods/$module/run/$area.php");
    }
    else if($ls=="NOBODY")
    {
        sysout("[E105]|no login.\n");
    }
    else
    {
        sysout("[E106]|no admin.\n");
    }
    
    closemysql();
}
elseif($area=="devel")
{
    require("base/mysql/common.php");
    require("base/login/common.php");
    connectmysql();

    $ls=login_check_user_status($user,$ukey);
    if($ls=="DEVELOPER")
    {
        $adminstatus="DEVELOPER";
        $module=stristr($comm,"_",true);
        if(!ismodule($module))return;
        include("mods/$module/run/$area.php");
    }
    else if($ls=="NOBODY")
    {
        sysout("[E105]|no login.\n");
    }
    else
    {
        sysout("[E106]|no developer.$ls\n");
    }

    closemysql();
}
elseif($area=="test")
{
    switch($comm)
    {
        case "generate_password":
            include("base/login/tests/generate_password.php");
            break;
        default:
            sysout("[E104]|Unknown command.\n");
    }
}
else
{
    sysout("[E101]|unknown area.\n");
}

function ismodule($str)
{
    return simplestr($str);
}

function simplestr($str)
{
    $n=strlen($str);
    for($i=0;$i<$n;$i++)
    {
        if(
            ($str[$i]<'a' || $str[$i]>'z') 
            && ($str[$i]<'A' || $str[$i]>'Z') 
            //&& $str[$i]!='-' //we do not allow '-' in module names.
            )return false;
    }
    return true;
}

function sysout($txt)
{
    global $eout,$echo_output;
    if($eout=="std")
    {
        echo $txt;
    }
    else
    {
        $echo_output.=$txt;
    }
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
    $variable=strtr($variable," ","+");//--TODO--(?)
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

function fetchglobal_pg_base64_alldata()
{
    $data=[];
    $counter=0;
    While(true)
    {
        if(isset($_POST[$counter]))$variable=$_POST[$counter];
        elseif(isset($_GET[$counter]))$variable=$_GET[$counter];
        else break;
        $variable=strtr($variable," ","+");//--TODO--(?)
        $data[$counter]=base64_decode($variable);
        $counter++;
    }
    return $data;
}

?>