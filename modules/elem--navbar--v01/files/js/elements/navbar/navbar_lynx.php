<?php

//------------------------------------------------------------------------------
// This is a temporary solution.
// This file should be used for textmode only.
// 
// This file will be replaced by new textmode.
// 
//------------------------------------------------------------------------------

$lines=file("../text/content/$lang/navbar.txt");

for($i=0;$i<count($lines);$i++)
{
    $a=explode("|",$lines[$i]);
    echo "[<a href=\"index.php?lang=$lang&action=".$a[2]."\">".$a[0]."</a>]";
    if($i+1<count($lines))echo "&nbsp;|&nbsp;";
}

echo "<hr>";

?>
