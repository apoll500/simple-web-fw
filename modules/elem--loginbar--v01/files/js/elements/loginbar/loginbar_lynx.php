<?php

$d=file("$baseurl/sys/index.php?area=user&comm=logstat_name&user=$user&ukey=$ukey");

if(mb_substr($d[0],0,3)=="OK:")
{
    echo mb_substr($d[0],3);
    //echo " | <a href=\"index.php?action=user_edit_lnk&page=$page&lang=$lang\">Benutzerdaten</a>";
    //echo " | <a href=\"index.php?action=docs_docs&page=$page&lang=$lang\">Downloads</a>";
    echo " | <a href=\"index.php?action=user_logout&page=$page&lang=$lang\">logout</a>";
}
else
{
    echo "
    <form method=\"POST\" action=\"index.php?action=user_login&page=$page&lang=$lang\">
        username: <input name='username' type='text' value='' size='6'>
        password: <input name='userpass' type='password' size='6'>
        <input type='submit' value='login'>&nbsp;
    </form>";
}

echo "<hr>";

?>