<?php

//hierarchical

/*
    this.root_id=params[3];
    this.fld_id=params[4];
    this.fld_pid=params[5];
    this.module=params[6];
    this.fld_name=params[7];
    this.fld_info=params[8];
    this.fld_target=params[9];
    this.comm_area=params[10];
    this.fld_style=params[11];
*/

elem_treesel_main($a);

function elem_treesel_main($a)
{
    global $action,$action_out;
    if($action=="crmTicket_create")// -- TODO --
    {
        $f["token"]="";
        $f["startindex"]="-1";
        $f["maxitems"]="5";
        //-----------------------------------------------------------------------
        // CALL SYS
        //-----------------------------------------------------------------------
        $part=callsys($a[6],$a[10],"search",$f);
    }
    else
    {
        echo "<br>- content missing -<br>";
    }

    if($part[0]=="[OK]")
    {
        $action_out="OK";
        //elem_treesel_debug_print_array($part);
        //echo "<br>";
        $data=[];
        for($i=2;$i<count($part);$i++)
        {
            $data[]=get_variables($part[$i]);
        }
        /*
        for($i=0;$i<count($data);$i++)
        {
            elem_treesel_debug_print_array_assoc($data[$i]);
        }
        */
        $leaves=elem_reesel_find_leaves($data,$a[4],$a[5]);
        $paths=elem_treesel_make_paths($data,$a[4],$a[5],$a[7],$leaves,$a[3]);
        elem_treesel_print_select($leaves,$paths,$a[9]);
        //echo "<br>";
    }
    else
    {
        echo "<br>- error requesting data -<br>";
    }
}

/*******************************************************************************
*                                                                              *
*  This implementation is only practicable for small trees.                    *
*                                                                              *
*******************************************************************************/

function elem_reesel_find_leaves($data,$id_name,$pid_name)
{
    $leaves=[];
    $nodes=[];
    for($i=0;$i<count($data);$i++)
    {
        $id=$data[$i][$id_name];
        $pid=$data[$i][$pid_name];
        $nodes[$pid]="0";//no leave
        if(!array_key_exists($id,$nodes))// $nodes[$id]=="")
        {
            $nodes[$id]="1";//potential leave
        }
    }
    //elem_treesel_debug_print_array_assoc($nodes);
    reset($nodes);
    for($i=0;$i<count($nodes);$i++)
    {
        $val=current($nodes);
        if($val=="1")
        {
            $leaves[]=key($nodes);
        }
        next($nodes);
    }
    //elem_treesel_debug_print_array_assoc($leaves);
    return $leaves;
}

function elem_treesel_make_paths($data,$id_name,$pid_name,$tit_name,$leaves,$root)
{
    $paths=[];
    foreach($leaves as $leave)
    {
        $paths[]=elem_treesel_make_path($data,$id_name,$pid_name,$tit_name,$leave,$root);
    }
    return $paths;
}

function elem_treesel_make_path($data,$id_name,$pid_name,$tit_name,$leave,$root)
{
    $path="";
    $curr_node=$leave;
    while($curr_node!=$root)
    {
        $item=elem_treesel_get_data_item($data,$id_name,$curr_node);
        if($item==[])break;
        $curr_node=$item[$pid_name];
        if($curr_node=="")break;
        if($path=="")$path=$item[$tit_name];
        else $path=$item[$tit_name]." -> ".$path;
    }
    return $path;
}

function elem_treesel_print_select($leaves,$paths,$select_name)
{
    echo "<select name='$select_name'>";
    for($i=0;$i<count($leaves);$i++)
    {
        echo "<option value='".$leaves[$i]."'>".$paths[$i]."</option>";
    }
    echo "</select>";
}

function elem_treesel_get_data_item($data,$id_name,$id_value)
{
    reset($data);
    for($i=0;$i<count($data);$i++)
    {
        $item=current($data);
        if($item[$id_name]==$id_value)
        {
            return $item;
        }
        next($data);
    }
    return [];
}

function elem_treesel_get_data_item_value($data,$id_name,$id_value,$item_name)
{
    return "";
}

function elem_treesel_debug_print_array($a)
{
    for($i=0;$i<count($a);$i++)
    {
        echo "$i: ".$a[$i]."<br>";
    }
}
function elem_treesel_debug_print_array_assoc($a)
{
    reset($a);
    echo "---------------------------------<br>";
    for($i=0;$i<count($a);$i++)
    {    
        $val=current($a);
        echo key($a).": ".$val."<br>";
        next($a);
    }
}

?>
