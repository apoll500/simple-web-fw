<?php

$site=123;//the site id

$action_out="";
$next="";

//include modules
//include("user_action.php");

if($action_out=="")
{
    switch($action)
    {
        case "nothing":
            //nothing
            break;
        default:
            $action_out="unknown action\n";
    }
}

?>
