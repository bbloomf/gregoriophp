<?php
header("Content-type: text/javascript");
$dir = $_REQUEST['dir'];
if($dir == '') $dir = '.';
$entries = scandir($dir);
$dirWithSlashes = addslashes($dir);
echo "folderContents('$dirWithSlashes',[";
foreach($entries as $v) {
  if(preg_match('/^\.|^\.{1,2}$/',$v)) {
    continue;
  }
  if(is_dir("$dir/$v")) $v .= '/';
  $v = addslashes($v);
  echo("'$v',\n");
}
echo ']);';
?>