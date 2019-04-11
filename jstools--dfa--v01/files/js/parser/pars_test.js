// -----------------------------------------------------------------------------
// Dfa parser example
// -----------------------------------------------------------------------------
// This is an example parser using Dfa (dfa.js).
// -----------------------------------------------------------------------------

//--------------------------------------------------------
// Handling von Dfa-events:
//--------------------------------------------------------
//Standard node-event function.
function node_func(s,context)
{
    document.write("<hr>node! "+s);
    return 0;
}

//Standard link-event function.
function link_func(jump_info,context)
{
    document.write("<hr>JUMP: "+jump_info.fromNode+" --["+jump_info.token+"]--> "+jump_info.toNode+" --- [Status: "+jump_info.status_desc+"]");
    return 0;
}

//Standard error function.
function err_func(info,context)
{
    document.write("<hr>FAIL: "+info.fromNode+" --["+info.token+"]-->     --- [Status: "+info.status_desc+"]");
    return 0;
}

//Standard event-handling function.
function info_func(a,b)
{
    document.write("<hr>"+a+" "+b+"<br>");
}

//--------------------------------------------------------
// Test:
//--------------------------------------------------------
function feed(dfa,token)
{
    dfa.feed(token);
}

function test()
{
    var dfa=new Dfa();
    dfa.setOwnerCallback(function(a,b){info_func(a,b);});
    dfa.setNewStartNode("Start");
    dfa.addNode("Step1",function(a,b){node_func(a,b);});
    dfa.addNode("Step2",function(a,b){node_func(a,b);});
    dfa.addNode("END_1",function(a,b){node_func(a,b);});
    dfa.addLink_ssif("Start","Step1",'A',function(a,b){link_func(a,b);});
    dfa.addLink_ssif("Step1","Start",'B',function(a,b){link_func(a,b);});
    dfa.addLink_ssif("Step1","Step2",'C',function(a,b){link_func(a,b);});
    dfa.addLink_ssif("Step2","END_1",'D',function(a,b){link_func(a,b);});
    dfa.reset();
    /*
      feed(dfa,'A');
      feed(dfa,'B');
      feed(dfa,'A');
      feed(dfa,'B');
      feed(dfa,'X');
      feed(dfa,'A');
      feed(dfa,'C');
      feed(dfa,'D');
      feed(dfa,'A');
      document.write("<hr>ready!");
    */
    dfa.reset();
    dfa.parseStr("ABABACDA");
    document.write("<hr>ready!");
}
