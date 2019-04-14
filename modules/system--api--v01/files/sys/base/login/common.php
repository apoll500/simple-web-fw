<?php

/******************************
*                             *
*  login functions            *
*                             *
******************************/

include("db/mod_user.php");
include("db/mod_user/users.php");
include("db/mod_user/usersettings.php");

//Prüfen ob ein User eingeloggt ist. (Rueckgabewert: true/false)
function login_check($user,$userkey)
{
    //--------------------------------------------------------------------------
    // BACKDOOR !!!
    //--------------------------------------------------------------------------
    global $backdoor;
    if($backdoor=="open")return true;
    //--------------------------------------------------------------------------
    global $DB;
    $retval=false;
    $q0=new SendDB("
        SELECT
        ".$DB["mod_user.users.userpass"]." AS userpass,
        ".$DB["mod_user.users.keysalt"]." AS keysalt
        FROM
        ".$DB["mod_user.users"]."
        WHERE
        ".$DB["mod_user.users.userid"]."=?
        ","i",array($user));
    if($q0->yy>0)
    {
        $r=$q0->rowa();
        $retval=check_userkey($userkey,$r["userpass"],$r["keysalt"]);
    }
    $q0->close();
	return $retval;
}
//Prüfen ob ein User eingeloggt ist und seinen adminstatus zurueckgeben.
function login_check_user_status($user,$userkey)
{
    //--------------------------------------------------------------------------
    // BACKDOOR !!!
    //--------------------------------------------------------------------------
    global $backdoor;
    if($backdoor=="open")return "ADMIN";
    //--------------------------------------------------------------------------
    global $DB;
    $retval="NOBODY";
    $q0=new SendDB("
        SELECT
        ".$DB["mod_user.users.userpass"]." AS userpass,
        ".$DB["mod_user.users.keysalt"]." AS keysalt,
        ".$DB["mod_user.users.adminstatus"]." AS adminstatus
        FROM
        ".$DB["mod_user.users"]."
        WHERE
        ".$DB["mod_user.users.userid"]."=?
        ","i",array($user));
    if($q0->yy>0)
    {
        $r=$q0->rowa();
        if(check_userkey($userkey,$r["userpass"],$r["keysalt"]))
        {
            $retval=$r["adminstatus"];
        }
        else
        {
            $retval="NOUSER";
        }
    }
    $q0->close();
	return $retval;
}
function create_userkey($user,$up)
{
	return mycrypt($up,create_new_salt($user));
}
function check_userkey($userkey,$up,$salt)
{
	return ($userkey===mycrypt($up,$salt));
}
function mycrypt($password,$salt)
{
    $a="";//add some extra features here!
    return hash("sha256",$salt.$password.$a,false);
}
function create_new_salt($user)
{
    global $DB;
    $salt=base64_encode(openssl_random_pseudo_bytes(32));
	sendmysql("
        UPDATE
        ".$DB["mod_user.users"]."
        SET
        ".$DB["mod_user.users.keysalt"]."='$salt'
        WHERE
        ".$DB["mod_user.users.userid"]."='$user'");
	return $salt;
}
function create_session_id()
{
    return $_SERVER["REMOTE_ADDR"].uniqid("-");
}
function get_flogincount($user)
{
    global $DB;
    //Anzahl Fehlversuche abfragen
    $Result=sendmysql(
        "SELECT
        ".$DB["mod_user.usersettings.datastring"]." AS datastring
        FROM
        ".$DB["mod_user.usersettings"]."
        WHERE
        ".$DB["mod_user.usersettings.userid"]."='$user'
        AND
        ".$DB["mod_user.usersettings.bezeichnung"]."='flogin'");
    if(ryy($Result)>0)
    {      		
        $r=rrowa($Result);
		return $r["datastring"];
	}
    freemysql($Result);
	return 0;
}
function set_flogincount($user,$fcount)
{
    global $DB;
    //Anzahl Fehlversuche setzen
    sendmysql("
        DELETE FROM
        ".$DB["mod_user.usersettings"]."
        WHERE
        ".$DB["mod_user.usersettings.userid"]."='$user'
        AND
        ".$DB["mod_user.usersettings.bezeichnung"]."='flogin'");
	if($fcount!=0)
	{
		sendmysql("
            INSERT INTO
            ".$DB["mod_user.usersettings"]." (
            ".$DB["mod_user.usersettings.userid"].",
            ".$DB["mod_user.usersettings.bezeichnung"].",
            ".$DB["mod_user.usersettings.datastring"].")
            VALUES ('$user','flogin','$fcount')");
	}
}
function generate_password()
{
    @srand((double)microtime()*1000000);
    $a_small=array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
    $a_big=array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
    $a_num=array('0','1','2','3','4','5','6','7','8','9');
    $a_son=array('-','+','!','?','$','%','/','(',')','{','}','[',']','*','_','.',';');
    $n_big=@rand(1,3);
    $n_num=@rand(1,3);
    $n_small=8-$n_big-$n_num;
    $n_son=2;
    $pos=0;
    for($i=0;$i<$n_big;$i++)
    {
        $p[$pos]=$a_big[@rand(0,count($a_big)-1)];
        $pos++;
    }
    for($i=0;$i<$n_small;$i++)
    {
        $p[$pos]=$a_small[@rand(0,count($a_small)-1)];
        $pos++;
    }
    for($i=0;$i<$n_num;$i++)
    {
        $p[$pos]=$a_num[@rand(0,count($a_num)-1)];
        $pos++;
    }
    for($i=0;$i<$n_son;$i++)
    {
        $p[$pos]=$a_son[@rand(0,count($a_son)-1)];
        $pos++;
    }
    $password="";
    for($i=0;$i<10;$i++)
    {
        $k=@rand(0,9-$i);
        $password=$password.$p[$k];
        for($j=$k;$j<9;$j++)
        {
            $p[$j]=$p[$j+1];
        }
    }
    return $password;
}

?>