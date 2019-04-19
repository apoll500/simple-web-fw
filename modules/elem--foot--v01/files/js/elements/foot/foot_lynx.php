<?php

//------------------------------------------------------------------------------
// This is a temporary solution.
// This file should be used for textmode only.
// 
// This file will be replaced by new textmode.
// 
//------------------------------------------------------------------------------

$lines=file("../text/content/$lang/foot.txt");

echo "<hr>";

for($i=0;$i<count($lines);$i++)
{
    if($lines[$i]=="BEGIN_COLUMN\n")
    {
        echo "<br>";
    }
    elseif($lines[$i]=="END_COLUMN\n" || $lines[$i]=="END_COLUMN")
    {
    }
    elseif($lines[$i]=="COPYINFO\n")
    {
        echo "<i>Copyright © 2017-2019<br>by Andreas Pollhammer</i><br>";
    }
    else
    {
        $a=explode("|",$lines[$i]);
        if(count($a)==1)
        {
            echo "<b>".$lines[$i]."</b><br>";
        }
        else
        {
            //echo "<b>".$lines[$i]."</b><hr>";
            //str_replace("JavaScript:setlang","",$a[1]);
            if(substr($a[1],0,11)=="JavaScript:")
            {
                sscanf($a[1],"JavaScript:%s",$jacall);
                $func=strstr($jacall,"(",true);
                $tmp=strstr($jacall,"(");
                $arg=substr($tmp,2,strlen($tmp)-5);
                if($func=="load_page")
                {
                    echo "<a href=\"index.php?page=$arg&lang=$lang\">".$a[0]."</a><br>";
                }
                elseif($func=="setlang")
                {
                    echo "<a href=\"index.php?page=$page&lang=$arg\">".$a[0]."</a><br>";
                }
                elseif($func=="setgstyle")
                {
                    echo "<a href=\"../index.php?page=$page&style=$arg&lang=$lang\">".$a[0]."</a><br>";
                }
                elseif($func=="mods_load")
                {
                    $p=explode(",",$arg);
                    $p[0]=substr($p[0],0,strlen($p[0])-1);
                    $p[1]=substr($p[1],1,strlen($p[0])-1);
                    echo "<a href=\"index.php?action=".$p[0]."_".$p[1]."&lang=$lang\">".$a[0]."</a><br>";
                }
                else
                {
                    echo $a[0]." (Error $func)<br>";
                }
            }
            else
            {
                echo "<a href=\"".$a[1]."\">".$a[0]."</a><br>";
            }
        }
    }
}

?>
