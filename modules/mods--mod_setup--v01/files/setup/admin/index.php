<?php

$module=fetchglobal_pg("module","");
$mode=fetchglobal_pg("mode","");

require("../../sys/base/mysql/common.php");

$current_dbnme="";
$current_tabname="";
$current_table_created=false;
$current_table_keyisset=false;

//------------------------------------------------------------------------------
echo "<h2 style='padding:5px;color:#EEEEFF;font-family:arial;font-weight:bold;background-color:0077AA;'>Including Definitions</h2>";
echo "<div style='height:100px;overflow:scroll;'>";
foreach (glob("../../sys/db/*.php") as $filename)
{
    echo "<code>including $filename</code><br>";
    include($filename);
}
foreach (glob("../../sys/db/*",GLOB_ONLYDIR) as $dir)
{
    echo "<code>including $dir</code><br>";
    foreach (glob("$dir/*.php") as $filename)
    {
        echo "<code>---> including $filename</code><br>";
        include($filename);
    }
}
//------------------------------------------------------------------------------
foreach (glob("../../setup/mods/*",GLOB_ONLYDIR) as $dir)
{
    echo "<code>found module $dir</code><br>";
    $allmods[]=substr($dir,strlen("../../setup/mods/"));
}
echo "</div>";
//------------------------------------------------------------------------------
foreach($allmods as $mod)
{
    if($module==$mod)
    {
        run_infofile("../mods/$mod/dbsetup.info");
    }
}
//------------------------------------------------------------------------------
if(substr($module,0,5)=="show_")
{
    print_mod_links(substr($module,5));
}
else
{
    echo "<h2 style='padding:5px;color:#EEEEFF;font-family:arial;font-weight:bold;background-color:0077AA;'>Modules</h2>";
    foreach($allmods as $mod)
    {
        print_mod_show($mod);
    }
}
//------------------------------------------------------------------------------
echo "<hr>";
if($module!="")echo "<a href=\"index.php\">back to main page</a><br>";
//------------------------------------------------------------------------------
function print_mod_show($mod)
{
    echo "<a href=\"index.php?module=show_$mod\" style='color:#77AAFF;font-family:arial;font-weight:bold;'>mod_$mod</a><br>";
}

function print_mod_links($mod)
{
    echo "<h2 style='padding:5px;color:#EEEEFF;font-family:arial;font-weight:bold;background-color:0077AA;'>mod_$mod</h2>";
    
    echo "<div style='font-family:arial;'><b>1) Setup Script</b><br>../mods/$mod/dbsetup.info</div><br>";
    echo "<div style='margin-left:10px;padding-left:10px;background-color:#FFEEAA;border-left:solid 2px #3377AA;'>";
    $s=file("../mods/$mod/dbsetup.info");
    foreach($s as $line)echo "<code>$line</code><br>";
    echo "</div>";
    
    echo "<br>";
    echo "<div style='font-family:arial;'><b>2) Run Setup Script</b></div>";
    echo "<table><tr><td>";
    echo "<div style='margin:10px;padding:5px;width:200px;font-family:arial;border:solid 2px #00AA00;border-radius:5px;background-color:#AAFF00;'>Script ausführen (ohne löschen)<br>";
    echo "<a href=\"index.php?module=$mod\" style='color:#007700;font-family:arial;font-weight:bold;'>CREATE mod_$mod</a><br>";
    echo "</div>";
    echo "</td><td>";
    echo "<div style='margin:10px;padding:5px;width:200px;border:solid 2px #AA0000;border-radius:5px;background-color:#FFAA00;'><a href=\"index.php?module=$mod&mode=remove\" style='color:#AA0000;font-family:arial;font-weight:bold;'>REMOVE/CREATE mod_$mod (ALL DATA GETS LOST!)</a></div>";
    echo "</td></tr></table>";
}

function run_infofile($filename)
{
    echo "<h2 style='padding:5px;color:#EEEEFF;font-family:arial;font-weight:bold;background-color:0077AA;'>Running $filename</h2>";
    $d=file($filename);
    for($i=0;$i<count($d);$i++)
    {
        $line=substr($d[$i],0,strlen($d[$i])-1);
        run_infoline($line);
        flush();
    }
}

function run_infoline($line)
{
    global $current_dbnme;
    global $current_tabname;
    global $current_table_created;
    global $current_table_keyisset;
    global $mode;
    
    //echo $line."<hr>";
    $p=strpos($line," ");
    if($p==false)
    {
        $command=$line;
    }
    else
    {
        $command=substr($line,0,$p);
    }
    switch($command)
    {
        case "DATABASE":
            $current_dbnme=substr($line,$p+1);
            create_database($current_dbnme);
            echo_skip();
            break;
        case "TABLE":
            $current_tabname=substr($line,$p+1);
            $current_table_created=false;
            $current_table_keyisset=false;
            if($mode=="remove")if(remove_table($current_dbnme,$current_tabname))echo_ok();else echo_err();
            break;
        case "FIELD":
            $rest=substr($line,$p+1);
            $p=strpos($rest," ");
            $field=substr($rest,0,$p);
            $rest=substr($rest,$p+1);
            if(!$current_table_created)
            {
                if(create_table($current_dbnme,$current_tabname,$field,$rest))echo_ok();else echo_err();
                $current_table_created=true;
            }
            else if(add_field($current_dbnme,$current_tabname,$field,$rest))echo_ok();else echo_err();
            break;
        case "MODIFY":
            $rest=substr($line,$p+1);
            $p=strpos($rest," ");
            $field=substr($rest,0,$p);
            $rest=substr($rest,$p+1);
            if(modify_field($current_dbnme,$current_tabname,$field,$rest))echo_ok();else echo_err();
            break;
        case "UNIQUE":
            $rest=substr($line,$p+1);
            if(set_field_unique($current_dbnme,$current_tabname,$rest))echo_ok();else echo_err();
            break;
        case "DROP_PRIMARY_KEY":
            if(drop_primary_key($current_dbnme,$current_tabname))echo_ok();else echo_err();
            break;
        case "PRIMARY_KEY":
            $rest=substr($line,$p+1);
            $fiefds=explode(',',$rest);
            if(add_primary_key_array($current_dbnme,$current_tabname,$fiefds,$current_table_keyisset))echo_ok();else echo_err();
            break;
        case "FOREIGN_KEY":
            $rest=substr($line,$p+1);
            $a=explode(',',$rest);
            if(add_foreign_key($current_dbnme,$current_tabname,$a[0],$a[1],$a[2]))echo_ok();else echo_err();
            break;
		//default:
		//	echo "ignoring command '$command'.<br>";
    }
}

function echo_ok()
{
    echo "...<span style='background-color:#AAFF77;'>OK</span><br>\n";
}
function echo_err()
{
    echo "...<span style='background-color:#FFAA77;'>ERR</span><br>\n";
}
function echo_skip()
{
    echo "...<span style='background-color:#FFFF77;'>SKIP</span><br>\n";
}

function create_database($dbname)
{
    global $DB;
    $dbname=$DB[$dbname];

    echo "CREATE DATABASE IF NOT EXISTS `$dbname` DEFAULT CHARACTER SET utf8";
    return true;
}

function remove_table($dbname,$tabname)
{
    global $DB;
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    
    $serv=connectdb($dbname);
    echo "DROP TABLE `$tabname`";
    $q0=new SendDB($serv,"DROP TABLE `$tabname`","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}

function create_table($dbname,$tabname,$fiefdname,$fieldsetup)
{
    global $DB,$current_table_keyisset;
    $fiefdname=$DB[$dbname.".".$tabname.".".$fiefdname];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    $fiefdname=substr(strstr($fiefdname,"."),1);
    
    if(strstr($fieldsetup,"AUTO_INCREMENT")!=false)
    {
        $k=",PRIMARY KEY (`$fiefdname`)";
        $current_table_keyisset=true;
    }
    else $k="";

    $serv=connectdb($dbname);
    echo "CREATE TABLE IF NOT EXISTS `$tabname` (`$fiefdname` $fieldsetup"."$k)";
    $q0=new SendDB($serv,"CREATE TABLE IF NOT EXISTS `$tabname` (`$fiefdname` $fieldsetup"."$k)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}

function add_field($dbname,$tabname,$fiefdname,$fieldsetup)
{
    global $DB;
    $fiefdname=$DB[$dbname.".".$tabname.".".$fiefdname];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    $fiefdname=substr(strstr($fiefdname,"."),1);

    $serv=connectdb($dbname);
    echo "ALTER TABLE `$tabname` ADD `$fiefdname` $fieldsetup";
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD `$fiefdname` $fieldsetup","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}

function modify_field($dbname,$tabname,$fiefdname,$fieldsetup)
{
    global $DB;
    $fiefdname=$DB[$dbname.".".$tabname.".".$fiefdname];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    $fiefdname=substr(strstr($fiefdname,"."),1);

    $serv=connectdb($dbname);
    echo "ALTER TABLE `$tabname` MODIFY `$fiefdname` $fieldsetup";
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` MODIFY `$fiefdname` $fieldsetup","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}

function set_field_unique($dbname,$tabname,$rest)
{
    global $DB;
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];

    $serv=connectdb($dbname);
    echo "ALTER TABLE `$tabname` ADD UNIQUE ($rest)";
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD UNIQUE ($rest)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}

function add_field_ex($dbname,$tabname,$fiefdname,$fieldtype,$fieldsize,$notnull,$stdvalue,$attribute,$extras,$comment)
{
    global $DB;
    $fiefdname=$DB[$dbname.".".$tabname.".".$fiefdname];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    $fiefdname=substr(strstr($fiefdname,"."),1);

    if($comment!="")$comment="COMMENT `$comment`";
    if($stdvalue!="")$stdvalue="DEFAULT $stdvalue";
    $serv=connectdb($dbname);
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD `$fiefdname` $fieldtype($fieldsize) $attribute $notnull $stdvalue $extras $comment","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}

function add_primary_key_array($dbname,$tabname,$fiefds,$drop)
{
    global $DB;
    $a="";
    for($i=0;$i<count($fiefds);$i++)
    {
        if($i>0)$a=$a.",";
        $a=$a."`".substr(strstr($DB[$dbname.".".$tabname.".".$fiefds[$i]],"."),1)."`";
    }
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    
    $serv=connectdb($dbname);
    if($drop)$d="DROP PRIMARY KEY,";else $d="";
    echo "ALTER TABLE `$tabname` $d"."ADD PRIMARY KEY ($a)";
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` $d"."ADD PRIMARY KEY ($a)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}
function add_foreign_key($dbname,$tabname,$field,$ftab,$ffld)
{
    global $DB;
    $a="";
    for($i=0;$i<count($fiefds);$i++)
    {
        if($i>0)$a=$a.",";
        $a=$a."`".substr(strstr($DB[$dbname.".".$tabname.".".$fiefds[$i]],"."),1)."`";
    }
    $field=substr(strstr($DB[$dbname.".".$tabname.".".$field],"."),1);
    $tabname=$DB[$dbname.".".$tabname];
    $ffld=substr(strstr($DB[$dbname.".".$ftab.".".$ffld],"."),1);
    $ftab=$DB[$dbname.".".$ftab];
    $dbname=$DB[$dbname];
    
    $serv=connectdb($dbname);
    echo "ALTER TABLE `$tabname` ADD FOREIGN KEY ($field) REFERENCES $ftab($ffld)";
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD FOREIGN KEY ($field) REFERENCES $ftab($ffld)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}
function drop_primary_key($dbname,$tabname)
{
    global $DB;
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    
    $serv=connectdb($dbname);
    echo "ALTER TABLE `$tabname` DROP PRIMARY KEY";
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` DROP PRIMARY KEY","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}
function add_primary_key($dbname,$tabname,$fiefdname)
{
    global $DB;
    $fiefdname=$DB[$dbname.".".$tabname.".".$fiefdname];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];
    $fiefdname=substr(strstr($fiefdname,"."),1);

    $serv=connectdb($dbname);
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD PRIMARY KEY (`$fiefdname`)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}
function add_primary_key2($dbname,$tabname,$fn1,$fn2)
{
    global $DB;
    $fn1=$DB[$dbname.".".$tabname.".".$fn1];
    $fn2=$DB[$dbname.".".$tabname.".".$fn2];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];

    $serv=connectdb($dbname);
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD PRIMARY KEY (`$fn1`,`$fn2`)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}
function add_primary_key3($dbname,$tabname,$fn1,$fn2,$fn3)
{
    global $DB;
    $fn1=$DB[$dbname.".".$tabname.".".$fn1];
    $fn2=$DB[$dbname.".".$tabname.".".$fn2];
    $fn3=$DB[$dbname.".".$tabname.".".$fn3];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];

    $serv=connectdb($dbname);
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD PRIMARY KEY (`$fn1`,`$fn2`,`$fn3`)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
}
function add_primary_key4($dbname,$tabname,$fn1,$fn2,$fn3,$fn4)
{
    global $DB;
    $fn1=$DB[$dbname.".".$tabname.".".$fn1];
    $fn2=$DB[$dbname.".".$tabname.".".$fn2];
    $fn3=$DB[$dbname.".".$tabname.".".$fn3];
    $fn4=$DB[$dbname.".".$tabname.".".$fn4];
    $tabname=$DB[$dbname.".".$tabname];
    $dbname=$DB[$dbname];

    $serv=connectdb($dbname);
    $q0=new SendDB($serv,"ALTER TABLE `$tabname` ADD PRIMARY KEY (`$fn1`,`$fn2`,`$fn3`,`$fn4`)","",array());
    if($q0->check())$retval=true;
    else $retval=false;
    $q0->close();
    closedb($serv);
    return $retval;
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
        if($str[$i]<'a' || $str[$i]>'z')return false;
    }
    return true;
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

?>
