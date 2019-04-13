<?php

$lines=file("../content/$lang/$page.txt");

echo "<h1>".$lines[0]."</h1>";

for($i=1;$i<count($lines);$i++)
{
    /*
    $lines[$i]=str_replace("JavaScript:load_page('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("')","&lang=$lang",$lines[$i]);
    */
    
    if($lines[$i]=="BEGIN_IBOX\n")
    {
    }
    elseif($lines[$i]=="END_IBOX\n" || $lines[$i]=="END_IBOX")
    {
    }
    elseif($lines[$i]=="BEGIN_LIST\n")
    {
        echo "<ul>";
    }
    elseif($lines[$i]=="END_LIST\n" || $lines[$i]=="END_LIST")
    {
        echo "</ul>";
    }
    elseif(substr($lines[$i],0,5)=="ITEM|")
    {
        $a=substr($lines[$i],5);
        echo "<li>$a</li>";
    }
    elseif(substr($lines[$i],0,2)=="I|")
    {
        $a=explode("|",$lines[$i]);
        echo "<li><b>".$a[1].":</b> ".$a[2]."</li>";
    }
    else
    {
        echo $lines[$i]."<br>";
    }
}

?>
