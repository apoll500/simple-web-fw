<?php

//Language
if(isset($_POST["lang"]))$lang=$_POST["lang"];
elseif(isset($_GET["lang"]))$lang=$_GET["lang"];
else $lang="de-at";

$url=$_SERVER["SERVER_NAME"].substr($_SERVER["REQUEST_URI"],0,strrpos($_SERVER["REQUEST_URI"],"/"));

switch($lang)
{
    case "de-at":
        echo "<h1>JavaScript-Version:</h1><br>";
        echo "JavaScript is deaktiviert.<br>";
        echo "Die graphisch aufbereitete Version dieser Website benötigt JavaScript.<br>";
        echo "<h1>Text-Version:</h1><br>";
        echo "Zur einfacher lesbaren Textversion (ohne JavaScript) gelangen Sie unter <a href=\"text/?lang=$lang\">".$url."/text/</a>.";
        break;
    case "en-us":
        echo "<h1>JavaScript-Version:</h1><br>";
        echo "JavaScript is disabled.<br>";
        echo "<h1>Text-Version:</h1><br>";
        echo "The text-version of this website (without JavaScript) is available here: <a href=\"text/?lang=$lang\">".$url."/text/</a>.";
        break;
    default:
        echo "Unknown language. Please select a language below.<br>";
        echo "Unbekannte Spreche. Bitte wählen Sie unten eine Sprache.";
}

echo "<hr>";

echo "Browser:<br>
            <ul>
                <li>LYNX--The Text Web-Browser <a href=\"http://lynx.invisible-island.net/\">http://lynx.invisible-island.net/</a></li>
            </ul>";

echo "
            Languages/Sprachen:<br>
            <ul>
                <li><a href=\"index.php?lang=de-at\">Deutsch</a></li>
                <li><a href=\"index.php?lang=en-us\">Englisch</a></li>
            </ul>
";

?>
