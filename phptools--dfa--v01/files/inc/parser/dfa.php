<?php

// -----------------------------------------------------------------------------
// Dfa
// -----------------------------------------------------------------------------
// A deterministic finite automaton.
// -----------------------------------------------------------------------------

class DfaNode
{
    function __construct() 
    { 
        if(method_exists($this,$func='__construct'.func_num_args()))call_user_func_array(array($this,$func),func_get_args());
    } 
    function __construct2($dfa,$name)
    {
        $this->dfa=$dfa;
        $this->name=$name;
        $this->func=null;
        $this->defaultLink=null;
        $this->endStatus=false;
        $this->links=array();
    }
    function addLink($tok,$node,$callback)
    {
        $this->links[]=new DfaLink($this->dfa,$tok,$node,$callback);
    }
    function addDefaultLink($node,$callback)
    {
        $this->defaultLink=new DfaLink($this->dfa,[],$node,$callback);
    }
    function feed($token)
    {
        $this->dfa->msg_info["fromNode"]=$this->name;
        $this->dfa->msg_info["toNode"]=null;
        $this->dfa->msg_info["token"]=$token;
        $this->dfa->msg_info["status_id"]="DFA_STATUSID_INV";
        $this->dfa->msg_info["status_desc"]="DFA_STATUS_INV";
        //walk through all links
        for($i=0;$i<count($this->links);$i++)
        {
            //walk through all tokens for each link
            for($j=0;$j<count($this->links[$i]->token);$j++)
            {
                //if the token matches, then jump
                if($this->links[$i]->token[$j]==$token)
                {
                    $this->links[$i]->jump($token);
                    return $this->dfa->msg_info["status_id"];
                }
            }
        }
        //jump default link if set
        if($this->defaultLink!=null)
        {
            $this->defaultLink->jump($token);
            return $this->dfa->msg_info["status_id"];
        }
        //call error function
        if($this->dfa->errfunc)
        {
            $f=$this->dfa->errfunc;
            $f($this->dfa->msg_info,$this->dfa->context);
        }
        //return status
        return $this->dfa->msg_info["status_id"];
    }
}

class DfaLink
{
    function __construct() 
    { 
        if(method_exists($this,$func='__construct'.func_num_args()))call_user_func_array(array($this,$func),func_get_args());
    } 
    function __construct4($dfa,$tok,$node,$callback)
    {
        $this->dfa=$dfa;
        $this->token=$tok;
        $this->toNode=$node;
        $this->func=$callback;
    }
    function jump($token)
    {
        $this->dfa->msg_info["fromNode"]=$this->dfa->currentNode->name;
        $this->dfa->msg_info["toNode"]=$this->toNode->name;
        $this->dfa->msg_info["token"]=$token;
        $this->dfa->msg_info["status_id"]="DFA_STATUSID_NOR";
        $this->dfa->msg_info["status_desc"]="DFA_STATUS_NOR";
        //jumping, setting the new current node
        $this->dfa->currentNode=$this->toNode;
        //if position reached with no outgoing links
        if(count($this->dfa->currentNode->links)==0 && $this->dfa->currentNode->defaultLink==null)
        {
            $dfa->msg_info["status_id"]="DFA_STATUSID_IPE";
            $dfa->msg_info["status_desc"]="DFA_STATUS_IPE";
        }
        //if node represents valid end status
        if($this->dfa->currentNode->endStatus)
        {
            $this->dfa->msg_info["status_id"]="DFA_STATUSID_END";
            $this->dfa->msg_info["status_desc"]="DFA_STATUS_END";
        }
        //executing link function
        if($this->func!=null)
        {
            $f=$this->func;
            $f($this->dfa->msg_info,$this->dfa->context);
        }
        //also executing node function of reached node
        if($this->dfa->currentNode->func!=null)
        {
            $f=$this->dfa->currentNode->func;
            $f($this->dfa->currentNode->name,$this->dfa->context);
        }
    }
}

class Dfa
{
    function __construct() 
    { 
        if(method_exists($this,$func='__construct'.func_num_args()))call_user_func_array(array($this,$func),func_get_args());
    } 
    function __construct0()
    {
        $this->context=null;
        $this->startNode=null;
        $this->currentNode=null;
        $this->errfunc=null;
        $this->callOwner=null;
        $this->msg_info=array("fromNode"=>0,"toNode"=>0,"token"=>0,"status_id"=>0,"status_desc"=>0);
        $this->allNodes=array();
    }
    function setContext($c)
    {
        $this->context=$c;
    }
    function setOwnerCallback($callback)
    {
        $this->callOwner=$callback;
    }
    function setErrorCallback($callback)
    {
        $this->errfunc=$callback;
    }
    function feed($token)
    {
        if($this->currentNode!=null)
        {
            return $this->currentNode->feed($token);
        }
        return -1;
    }
    function reset()
    {
        $this->currentNode=$this->startNode;
    }
    function setPos_n($node)
    {
        $this->currentNode=$node;
    }
    function setPos_s($name)
    {
        if(isset($this->allNodes[$name]))
        {
            $this->currentNode=$this->allNodes[$name];
            return true;
        }
        else
        {
            return false;
        }
    }
    function setEndStatus($name,$status)
    {
        if(isset($this->allNodes[$name]))
        {
            $this->allNodes[$name]->endStatus=$status;
            return true;
        }
        else
        {
            return false;
        }
    }
    function setStartNode($node)
    {
        $this->startNode=$node;
    }
    function setNewStartNode($name)
    {
        $this->startNode=$this->addNode($name);
    }
    function addNode($name)
    {
        if(isset($this->allNodes[$name]))return $this->allNodes[$name];
        $node=new DfaNode($this,$name);
        $this->allNodes[$name]=$node;
        return $node;
    }
    function addLink_nnaf($fromNode,$toNode,$tok,$callback)
    {
        $fromNode->addLink($tok,$toNode,$callback);
    }
    function addLink_nnf($fromNode,$toNode,$callback)
    {
        $fromNode->addDefaultLink($toNode,$callback);
    }
    function addLink_ssaf($from,$to,$tok,$callback)
    {
        if(isset($this->allNodes[$from]))
        {
            $fromNode=$this->addNode($from);
        }
        else
        {
            $fromNode=$this->allNodes[$from];
        }
        if(isset($this->allNodes[$to]))
        {
            $toNode=$this->addNode($to);
        }
        else
        {
            $toNode=$this->allNodes[$to];
        }
        $this->addLink_nnaf($fromNode,$toNode,$tok,$callback);
        return true;
    }
    function addLink_ssif($from,$to,$tok,$callback)
    {
        return $this->addLink_ssaf($from,$to,[$tok],$callback);
    }
    function addLink_ssi($from,$to,$tok)
    {
        return $this->addLink_ssaf($from,$to,[$tok],null);
    }
    function addLink_ssa($from,$to,$tok)
    {
        return $this->addLink_ssaf($from,$to,$tok,null);
    }
    function addLink_ss($from,$to)
    {
        return $this->addLink_ssf($from,$to,null);
    }
    function addLink_ssf($from,$to,$callback)
    {
        $fromNode;
        $toNode;
        if(isset($this->allNodes[$from]))
        {
            $fromNode=$this->addNode($from);
        }
        else
        {
            $fromNode=$allNodes[$from];
        }
        if(isset($this->allNodes[$to]))
        {
            $toNode=$this->addNode($to);
        }
        else
        {
            $toNode=$allNodes[$to];
        }
        $this->addLink_nnf($fromNode,$toNode,$callback);
        return true;
    }
    function parseStr($a)
    {
        $r=new Reader($a,strlen($a));
        $ch=0;
        $status="DFA_STATUSID_NOR";
        while($status=="DFA_STATUSID_NOR" && $ch!=-1)
        {
            $ch=$r->get();
            if($ch!=-1)$status=$this->feed($ch);
        }
        return $status;
    }
}

?>
