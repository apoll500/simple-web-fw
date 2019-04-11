<?php

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
include("inc/parser/dfa.php");
include("inc/parser/reader.php");
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
class dfa_varparse
{
    function __construct() 
    { 
        if(method_exists($this,$func='__construct'.func_num_args()))call_user_func_array(array($this,$func),func_get_args());
    } 
    function __construct1(func)
    {
        $this->dfa=$this->setupDfa();
        $this->get_value_function=func;
    }
    function setupDfa()
    {
        $sp=[' ',"\t"];
        $vm=['$'];
        $nu=['1','2','3','4','5','6','7','8','9','0'];
        $ch=['_','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        $dfa=new Dfa();
        $dfa.setContext($this);
        $dfa->setNewStartNode("q0");
        $dfa->addNode("q0");
        $dfa->addNode("q1");
        $dfa->addNode("q2");
        $dfa->addLink_ssf ("q0","q0",    "dfa_varparse_std_out");
        $dfa->addLink_ssaf("q0","q1",$vm,"dfa_varparse_var_start");
        $dfa->addLink_ssaf("q1","q2",$ch,"dfa_varparse_var_add");
        $dfa->addLink_ssf ("q1","q0",    "dfa_varparse_std_out");
        $dfa->addLink_ssaf("q2","q2",$ch,"dfa_varparse_var_add");
        $dfa->addLink_ssaf("q2","q2",$nu,"dfa_varparse_var_add");
        $dfa->addLink_ssf ("q2","q0",    "dfa_varparse_var_end");
        resetDfa($dfa);
        return $dfa;
    }
    function resetDfa()
    {
        $this->$dfa->reset();
    }
    function feed($token)
    {
        $this->$dfa->feed($token);
    }
    function parse($content)
    {
        $this->$dfa->parseStr($content+" ");
    }
    function var_start()
    {
        $this->varname="";
    }
    function var_add($ch)
    {
        $this->varname.=$ch;
    }
    function var_end($ch)
    {
        $f=$this->get_value_function;
        $v=$f($this->varname);
        $this->output.=$v;
        $this->varname="";
        out($ch);
    }
    function out($ch)
    {
        $this->output.=$ch;
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function dfa_varparse_std_out($jump_info,$context)
{
    $context->out($jump_info["token"]);
    return 0;
}
function dfa_varparse_var_start($jump_info,$context)
{
    $context->var_start($jump_info["token"]);
    return 0;
}
function dfa_varparse_var_add($jump_info,$context)
{
    $context->var_add($jump_info["token"]);
    return 0;
}
function dfa_varparse_var_end($jump_info,$context)
{
    $context->var_end($jump_info["token"]);
    return 0;
}

?>
