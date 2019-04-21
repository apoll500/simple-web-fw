<?php

//------------------------------------------------------------------------------
// This is a temporary solution.
// This file should be used for textmode only.
// 
// This file will be replaced by new textmode.
// 
//------------------------------------------------------------------------------

$lines=file("../content/$lang/$page.txt");

$item_hcount=0;

echo "<h1>".$lines[0]."</h1>";

for($i=1;$i<count($lines);$i++)
{
    $lines[$i]=str_replace("JavaScript:load_page('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:mods_user_load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:mods_user_run('","index.php?action=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("')","&lang=$lang",$lines[$i]);
    
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
    elseif(mb_substr($lines[$i],0,5)=="ERROR")
    {
        echo "$action_out<br>";
    }
    elseif(mb_substr($lines[$i],0,4)=="BOX|")
    {
        echo "<div>";
        $item_hcount=0;
    }
    elseif(mb_substr($lines[$i],0,6)=="ENDBOX")
    {
        echo "</div>";
    }
    elseif(mb_substr($lines[$i],0,5)=="HIDE|")
    {
    }
    elseif(mb_substr($lines[$i],0,7)=="ENDHIDE")
    {
    }
    elseif(mb_substr($lines[$i],0,5)=="FORM|")
    {
        $a=explode("|",$lines[$i]);
        //echo "<form name=\"".$a[1]."\" method=\"".$a[2]."\" action=\"JavaScript:mods_".$a[4]."_run('".$a[3]."')\">";
        echo "<form name=\"".$a[1]."\" method=\"".$a[2]."\" action=\"index.php?action=".$a[4]."_".$a[3]."&lang=$lang\">";
        if($next!="")echo "<input type='hidden' name='page' value='$next'>";
    }
    elseif(mb_substr($lines[$i],0,7)=="ENDFORM")
    {
        echo "</form>";
    }
    elseif(mb_substr($lines[$i],0,4)=="FLD|")
    {
        $a=explode("|",$lines[$i]);
        if($a[2]!="")
        {
            if($a[1]=="left")echo $a[2];
            else echo "<span class=\"".$a[1]."\">".$a[2]."</span><br>";
        }
        if($a[3]=="INPUT")
        {
            if(isset($vars[$a[6]]))$a[7]=$vars[$a[6]];
            echo "<input type=\"".$a[4]."\" name=\"".$a[6]."\" value=\"".$a[7]."\" class=\"".$a[5]."\"";
            if($a[8]!="" && $a[8][0]==' ')echo $a[8];
            echo ">";
        }
    }
    elseif(mb_substr($lines[$i],0,5)=="LINK|")
    {
        $a=explode("|",$lines[$i]);
        if($item_hcount>0)echo "&nbsp;|&nbsp;";
        echo "<a href=\"index.php?action=".$a[5]."_".$a[4]."&lang=$lang\">".$a[3]."</a>";
        $item_hcount++;
    }
    elseif(mb_substr($lines[$i],0,2)=="NL")
    {
        echo "<br><br>";
        $item_hcount=0;
    }
    else
    {
        echo $lines[$i]."<br>";
    }
}

?>