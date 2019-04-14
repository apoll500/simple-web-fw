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
        switch(count($p))
        {
            case 0:
                break;
            case 1:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0]);
                break;
            case 2:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1]);
                break;
            case 3:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2]);
                break;
            case 4:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3]);
                break;
            case 5:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4]);
                break;
            case 6:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5]);
                break;
            case 7:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6]);
                break;
            case 8:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7]);
                break;
            case 9:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8]);
                break;
            case 10:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9]);
                break;
            case 11:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10]);
                break;
            case 12:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11]);
                break;
            case 13:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12]);
                break;
            case 14:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13]);
                break;
            case 15:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13],$p[14]);
                break;
            case 16:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13],$p[14],$p[15]);
                break;
            case 17:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13],$p[14],$p[15],$p[16]);
                break;
            case 18:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13],$p[14],$p[15],$p[16],$p[17]);
                break;
            case 19:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13],$p[14],$p[15],$p[16],$p[17],$p[18]);
                break;
            case 20:
                mysqli_stmt_bind_param($this->stmt,$types,$p[0],$p[1],$p[2],$p[3],$p[4],$p[5],$p[6],$p[7],$p[8],$p[9],$p[10],$p[11],$p[12],$p[13],$p[14],$p[15],$p[16],$p[17],$p[18],$p[19]);
                break;
            default:
                echo "Error SendDB maxParameter (".count($p).").\n";
        }
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