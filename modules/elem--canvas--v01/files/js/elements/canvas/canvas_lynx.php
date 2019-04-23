<?php

$lines=file("../content/$lang/$page.txt");

echo "<h1>".$lines[0]."</h1>";

for($i=1;$i<count($lines);$i++)
{
    echo $lines[$i]."<br>";
}

?>
