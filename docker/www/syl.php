<?phpheader('Content-type: text/javascript');$ch = curl_init("https://juiciobrennan.com/syllables/");$fp = tmpfile();curl_setopt($ch, CURLOPT_FILE, $fp);curl_setopt($ch, CURLOPT_HEADER, 0);curl_setopt($ch, CURLOPT_POST, TRUE);curl_setopt($ch, CURLOPT_POSTFIELDS, array("inputText"=>$_GET["txt"]));curl_exec($ch);curl_close($ch);fseek($fp,0);$len=0;$read=1;$txt="";while($read>0){  $txt .= fread($fp,1000);  $read = ftell($fp) - $len;  $len = ftell($fp);}$txt = stristr($txt,"<textarea");$txt = substr(stristr($txt,">"),1);$i = strpos($txt,"<");$txt = substr($txt,0,$i);echo 'Syl.addResult("'.$txt.'");';?>