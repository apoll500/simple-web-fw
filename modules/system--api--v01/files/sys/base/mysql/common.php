<?php

//------------------------------------------------------------------------------
// global variables
//------------------------------------------------------------------------------
include("...");//include globals, see documentation
$sglobdbname="...";//name of the main database
$mysql_server=null;

//------------------------------------------------------------------------------
// MySQL
//------------------------------------------------------------------------------
function connectmysql()
{
    global $sglobdbusername,$sglobdbuserpass,$sglobdbname,$mysql_server;
    $mysql_server=@mysqli_connect("localhost",$sglobdbusername,$sglobdbuserpass,$sglobdbname);//,"3306");
    if(!$mysql_server)die("[E100]|System down.\n");
}
function closemysql()
{
    global $mysql_server;
    mysqli_close($mysql_server);
    $mysql_server=null;
}
function connectdb($db)
{
    global $sglobdbname,$mysql_server;
    if($db==$sglobdbname && $mysql_server)return $mysql_server;
    global $sglobdbusername,$sglobdbuserpass;
    $server=@mysqli_connect("localhost",$sglobdbusername,$sglobdbuserpass,$db);//,"3306");
    if(!$server)die("[E100]|System down.\n");
    return $server;
}
function closedb($server)
{
    global $mysql_server;
    if($server!=$mysql_server)mysqli_close($server);
}
function sendmysql($SQLString)
{
    global $mysql_server;
    $Ergebnis=mysqli_query($mysql_server,$SQLString);
    return $Ergebnis;
}
function freemysql($result)
{
    mysqli_free_result($result);
}
class SendDB
{
    public $yy=0;
    function __construct() 
    { 
        if(method_exists($this,$func='__construct'.func_num_args()))call_user_func_array(array($this,$func),func_get_args());
    } 
    function __construct4($server,$SQLString,$types,$p)
    {
        $this->ini($server,$SQLString,$types,$p);
    }
    function __construct3($SQLString,$types,$p)
    {
        global $mysql_server;
        $this->ini($mysql_server,$SQLString,$types,$p);
    }
    public function ini($server,$SQLString,$types,$p)
    {
        //echo $SQLString."<br>[".count($p)." Parameter]:";foreach($p as $a)echo " [".$a."]";
        $this->stmt=mysqli_prepare($server,$SQLString);
        if($this->stmt==false)
        {
            echo "Error in SQLString: <i>$SQLString</i><br>";
            for($h=0;$h<count($p);$h++)
            {
                echo "insertion parameter $h: ".$p[$h]."<br>";
            }
            die();
        }
        mysqli_stmt_bind_param($this->stmt,$types,...$p);
        $this->writelog($SQLString,$p);
        $this->success=mysqli_stmt_execute($this->stmt);
        $this->result=mysqli_stmt_get_result($this->stmt);
        if(is_bool($this->result))$this->yy=0;else $this->yy=mysqli_num_rows($this->result);
    }
    public function writelog($SQLString,$p)
    {
        //log database access
    }
    public function close()
    {
        mysqli_stmt_close($this->stmt);
    }
    public function check()
    {
        return $this->success;
    }
    public function rowa()
    {
        return mysqli_fetch_assoc($this->result);
    }
    public function rowan($n)
    {
        if($n>=$this->yy)return null;
        mysqli_data_seek($this->result,$n);
        return mysqli_fetch_assoc($this->result);
    }
    public function rowf()
    {
        return mysqli_fetch_row($this->result);
    }
    public function rowfn($n)
    {
        if($n>=$this->yy)return null;
        mysqli_data_seek($this->result,$n);
        return mysqli_fetch_row($this->result);
    }
}
function ryy($result)
{
    return mysqli_num_rows($result);
}
function rrowa($result)
{
    return mysqli_fetch_assoc($result);
}
function rrowan($result,$row)
{
    mysqli_data_seek($result,$row);
    return mysqli_fetch_assoc($result);
}
function rrowf($result)
{
    return mysqli_fetch_row($result);
}
function rrowfn($result,$row)
{
    mysqli_data_seek($result,$row);
    return mysqli_fetch_row($result);
}

?>