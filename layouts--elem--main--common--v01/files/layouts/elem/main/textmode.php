<?php

$lines=@file("../text/content/$lang/$page.txt",FILE_IGNORE_NEW_LINES);
if($lines=="")
{
    echo "ERROR:<br>
    The requested content is not available!<br>
    <i>Language: $lang</i><br>
    <i>Token: $page</i><br>";
    die("<br>File Not Found!<br>Script dies here!<br>");
}

$item_hcount=0;
$html_mode=false;

    $i=0;
    /*
    $lines[$i]=str_replace("JavaScript:load_page('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:mods_user_load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:mods_user_run('","index.php?action=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("')","&lang=$lang#textmode_main",$lines[$i]);
    $lines[$i]=str_replace("src=\"images/","src=\"../images/",$lines[$i]);
    //*/
echo "<a name='textmode_main'></a>";
echo "<h1>".$lines[0]."</h1>";

for($i=1;$i<count($lines);$i++)
{
    /*
    $lines[$i]=str_replace("JavaScript:load_page('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:mods_user_load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:mods_user_run('","index.php?action=",$lines[$i]);
    $lines[$i]=str_replace("JavaScript:load('","index.php?page=",$lines[$i]);
    $lines[$i]=str_replace("')","&lang=$lang#textmode_main",$lines[$i]);
    $lines[$i]=str_replace("src=\"images/","src=\"../images/",$lines[$i]);
    //*/
    if($lines[$i]=="BEGIN_HTML")
    {
        $html_mode=true;
        if($i<count($lines)-1)$i++;
    }
    else if($lines[$i]=="END_HTML")
    {
        $html_mode=false;
        if($i<count($lines)-1)$i++;
        else break;
    }
    if($html_mode)
    {
        echo $lines[$i];
    }
    else
    {
        //-----------------------------------
        //IBOX
        //-----------------------------------
        if($lines[$i]=="BEGIN_IBOX\n")
        {
        }
        elseif($lines[$i]=="END_IBOX\n" || $lines[$i]=="END_IBOX")
        {
        }
        //-----------------------------------
        //PHP Variables
        //-----------------------------------
        elseif($lines[$i]!="" && $lines[$i][0]=="\$")
        {
            if($lines[$i]=="\$info\n" && isset($info))
                echo "$info<br>";
        }
        //-----------------------------------
        //LIST
        //-----------------------------------
        elseif($lines[$i]=="BEGIN_LIST\n")
        {
            echo "<ul>";
        }
        elseif($lines[$i]=="END_LIST\n" || $lines[$i]=="END_LIST")
        {
            echo "</ul>";
        }
        //-----------------------------------
        //BOX
        //-----------------------------------
        elseif(mb_substr($lines[$i],0,4)=="BOX|")
        {
            echo "<div>";
            $item_hcount=0;
        }
        elseif(mb_substr($lines[$i],0,6)=="ENDBOX")
        {
            echo "</div>";
        }
        //-----------------------------------
        //HIDDEN
        //-----------------------------------
        elseif(mb_substr($lines[$i],0,5)=="HIDE|")
        {
        }
        elseif(mb_substr($lines[$i],0,7)=="ENDHIDE")
        {
        }
        //-----------------------------------
        //FORM
        //-----------------------------------
        elseif(mb_substr($lines[$i],0,5)=="FORM|")
        {
            $a=explode("|",$lines[$i]);
            //echo "<form name=\"".$a[1]."\" method=\"".$a[2]."\" action=\"JavaScript:mods_".$a[4]."_run('".$a[3]."')\">";
            echo "<form";
            if($a[5]!="")echo " enctype=\"".$a[5]."\"";
            echo " name=\"".$a[1]."\" method=\"".$a[2]."\" action=\"index.php?action=".$a[4]."_".$a[3]."&lang=$lang\">";
            if($next!="")echo "<input type='hidden' name='page' value='$next'>";
        }
        elseif(mb_substr($lines[$i],0,7)=="ENDFORM")
        {
            echo "</form>";
        }
        //-----------------------------------
        //CONTENT
        //-----------------------------------
        //ITEM
        elseif(substr($lines[$i],0,5)=="ITEM|")
        {
            $a=substr($lines[$i],5);
            echo "<li>$a</li>";
        }
        //I
        elseif(substr($lines[$i],0,2)=="I|")
        {
            $a=explode("|",$lines[$i]);
            echo "<li><b>".$a[1].":</b> ".$a[2]."</li>";
        }
        //FLD
        elseif(mb_substr($lines[$i],0,4)=="FLD|")
        {
            $a=explode("|",$lines[$i]."|||||||||");
            if(substr($a[8],0,8)=="disabled")
            {
                $a[8]=substr($a[8],8);
                //if(substr($a[5],-1)=="d")
                //{
                //}
            }
            if($a[7].substr(0,1)=="#")
            {
                //--TODO--
                //a[7]=main_handler.user_context.get(s[7].substr(1));
            }
            if($a[2]!="")
            {
                if($a[1]=="left")echo $a[2];
                else echo "<span class=\"".$a[1]."\">".$a[2]."</span><br>";
            }
            if($a[3]=="INPUT")
            {
                if(isset($vars[$a[6]]))$a[7]=$vars[$a[6]];
                if($a[4]=="hidden")
                {
                    if(substr($a[6],-9)=="_original")
                    {
                        $tmp=substr($a[6],0,strlen($a[6])-9);
                        if(isset($vars[$tmp]))$a[7]=$vars[$tmp];
                    }
                }
                if(isset($print_delform) && $print_delform==true)
                {
                    if($a[4]=="input")
                    {
                        echo "<input type=\"hidden\" name=\"".$a[6]."\" value=\"".$a[7]."\">";
                        $a[8]="disabled ".$a[8];
                        $a[6].="_copy";
                    }
                }
                echo "<input type=\"".$a[4]."\" name=\"".$a[6]."\" value=\"".$a[7]."\"";// class=\"".$a[5]."\"";
                //if($a[9]!="")echo " ".$a[9]."=\"mods_".$a[10]."_run('".$a[11]."')\"";
                if($a[8]!="")echo " ".$a[8];
                if($a[9]!="")
                {
                    echo " ".$a[9]."=\"{document.mform.action='index.php?action=".$a[10]."_".$a[11]."';document.mform.submit();}\"";
                }
                echo ">";
            }
            //Select
            elseif($a[3]=="SELECT")
            {
                $selected_option_is_loaded=false;
                if(isset($vars[$a[6]]))
                {
                    $selected_option=$vars[$a[6]];
                    $selected_option_is_loaded=true;
                }
                echo "<select name=\"".$a[6]."\"";
                //if($a[9]!="") echo " ".$a[9]."=\"mods_".$a[10]."_run('".$a[11]."')\"";
                if($a[8]!="")echo " ".$a[8];
                echo ">";
                $opt=explode(',',$a[7]);
                for($i_option=0;$i_option<count($opt);$i_option++)
                {
                    $extra="";
                    $opt_value="";
                    $opt_text="";
                    if($opt[$i_option][0]=="+")
                    {
                        if($selected_option_is_loaded==false)
                        {
                            $extra.=" selected";
                        }
                        $opt_value=substr($opt[$i_option],1);
                    }
                    else if($opt[$i_option][0]=="~")
                    {
                        $extra.=" disabled";
                        $opt_value=substr($opt[$i_option],1);
                    }
                    else if($opt[$i_option][0]=="-")
                    {
                        $opt_value=substr($opt[$i_option],1);
                    }
                    else
                    {
                        $opt_value=$opt[$i_option];
                    }
                    $opt_option=strstr($opt_value,"[");
                    $opt_value=strstr($opt_value,"[",true);
                    if($opt_option)
                    {
                        $opt_text=substr($opt_option,7,-2);
                    }
                    else
                    {
                        $opt_text=$opt_value;
                    }
                    if($selected_option_is_loaded && $opt_value==$selected_option)$extra=" selected";
                    echo "<option value=\"".$opt_value."\"".$extra.">".$opt_text."</option>";
                }
                echo "</select>";
            }
            //Textarea
            elseif($a[3]=="AREA")
            {
                if(isset($vars[$a[6]]))$a[7]=$vars[$a[6]];
                if(isset($print_delform) && $print_delform==true)
                {
                    echo "<input type=\"hidden\" name=\"".$a[6]."\" value=\"".$a[7]."\">";
                    $a[8]="disabled ".$a[8];
                    $a[6].="_copy";
                }
                echo "<textarea name=\"".$a[6]."\"";
                //if($a[9]!="")echo " ".$a[9]."=\"mods_".$a[10]."_run('".$a[11]."')\"";
                if($a[8]!="")echo " ".$a[8]; //TODO--PRUEFEN
                echo ">".$a[7]."</textarea>";
            }
        }
        //LINK
        elseif(mb_substr($lines[$i],0,5)=="LINK|")
        {
            $a=explode("|",$lines[$i]);
            if($item_hcount>0)echo "&nbsp;|&nbsp;";
            echo "<a href=\"index.php?action=".$a[5]."_".$a[4]."&lang=$lang\">".$a[3]."</a>";
            $item_hcount++;
        }
        //NL
        elseif(mb_substr($lines[$i],0,2)=="NL")
        {
            echo "<br><br>";
            $item_hcount=0;
        }
        //ERROR
        elseif(mb_substr($lines[$i],0,5)=="ERROR")
        {
            echo "$action_out<br>";
        }
        //ANIMBOX
        elseif(mb_substr($lines[$i],0,8)=="ANIMBOX|")
        {
            $a=explode("|",$lines[$i]);
            if($a[2]=="1" && isset($info1))
            {
                echo "$info1";
            }
            else if($a[2]=="2" && isset($info2))
            {
                echo "$info2";
            }
            else if($a[2]=="3" && isset($info3))
            {
                echo "$info3";
            }
            //echo $action_out;
        }
        //FLAP
        elseif(mb_substr($lines[$i],0,5)=="FLAP|")
        {
            $a=explode("|",$lines[$i]);
            echo "<div style='margin-left:50px;'>".$a[1]."</div>";
        }
        elseif(mb_substr($lines[$i],0,8)=="SUBFLAP|")
        {
            $a=explode("|",$lines[$i]);
            echo "<div style='margin-left:100px;'>".$a[1]."</div>";
        }
        elseif(mb_substr($lines[$i],0,11)=="SUBSUBFLAP|")
        {
            $a=explode("|",$lines[$i]);
            echo "<div style='margin-left:150px;'>".$a[1]."</div>";
        }
        elseif(mb_substr($lines[$i],0,14)=="SUBSUBSUBFLAP|")
        {
            $a=explode("|",$lines[$i]);
            echo "<div style='margin-left:200px;'>".$a[1]."</div>";
        }
        elseif(mb_substr($lines[$i],0,7)=="ENDFLAP")
        {
        }
        //NORMAL PARAGRAPH
        else
        {
            echo $lines[$i]."<br>";
        }
    }
}

?>