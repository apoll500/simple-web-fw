<?php

// Test-Beispiel für den parser.

//--------------------------------------------------------
// Handling von Dfa-Events:
//--------------------------------------------------------

include("dfa.php");
include("reader.php");

//Standard Node-Event Funktion.
function node_func($s,$context)
{
    echo("<hr>node! $s");
    return 0;
}

//Standard Link-Event Funktion.
function link_func($jump_info,$context)
{
    echo("<hr>JUMP: ".$jump_info["fromNode"]." --[".$jump_info["token"]."] --> ".$jump_info["toNode"]." --- [Status: ".$jump_info["status_desc"]."]");
    return 0;
}

//Standard Fehler Funktion.
function err_func($info,$context)
{
    echo("<hr>JUMP: ".$jump_info["fromNode"]." --[".$jump_info["token"]."] --> ".$jump_info["toNode"]." --- [Status: ".$jump_info["status_desc"]."]");
    return 0;
}

//Standard Event-Handling Funktion.
function info_func($a,$b)
{
    echo("<hr>$a $b<br>");
}

//--------------------------------------------------------
// Test:
//--------------------------------------------------------
function feed($dfa,$token)
{
    $dfa->feed($token);
}

function test()
{
    $dfa=new Dfa();
    $dfa->setOwnerCallback("info_func");
    $dfa->setErrorCallback("err_func");
    $dfa->setNewStartNode("Start");
    $dfa->addNode("Step1","node_func");
    $dfa->addNode("Step2","node_func");
    $dfa->addNode("END_1","node_func");
    $dfa->addLink_ssif("Start","Step1",'A',"link_func");
    $dfa->addLink_ssif("Step1","Start",'B',"link_func");
    $dfa->addLink_ssif("Step1","Step2",'C',"link_func");
    $dfa->addLink_ssif("Step2","END_1",'D',"link_func");
    $dfa->reset();
    /*
      feed($dfa,'A');
      feed($dfa,'B');
      feed($dfa,'A');
      feed($dfa,'B');
      feed($dfa,'X');
      feed($dfa,'A');
      feed($dfa,'C');
      feed($dfa,'D');
      feed($dfa,'A');
      echo("<hr>fertig!");
    */
    $dfa->reset();
    $dfa->parseStr("ABABACDA");
    echo("<hr>fertig!");
}

test();

?>