<?php
$ly=$_REQUEST['ly'];
$oname=$_REQUEST['name'];
$format=$_REQUEST['fmt'];
$width=$_REQUEST['width'];
$height=$_REQUEST['height'];
$croppdf=true;
if($_REQUEST['croppdf']=='false'){
  $croppdf=false;
}
if($width==''){
  $width='5';
}
if($height==''){
  $height='11';
}
$width = 72 * $width;
$height = 72 * $height;
ini_set('magic_quotes_runtime', 0);
if($format==''){
  $format='png';
  $fmtmime='image/png';
} else {
  $fmtmime='application/pdf';
}
if($ly!='') {
  $ofilename = $oname;
  if($ofilename=='') {
    $ofilename='Untitled';
  }
  if($odir == ''){
    $odir='tmp';
  } else if(!is_dir("scores/modern/$odir")){
    header("Content-type: text/plain");
    echo "The directory scores/modern/$odir does not exist.  Please create it manually if this is the directory you intended.";
    return;
  }
  
  $tmpfname = "tmp/$ofilename";
  $namely = "$tmpfname.ly";
  $nameps = "$tmpfname.ps";
  $namepdf = "$tmpfname.pdf";
  $deletepdf = ($_REQUEST['deletepdf']!='' or $ofilename=='Untitled');
  $finalpdf = ($deletepdf?'tmp/tmp.':"scores/modern/$odir/")."$ofilename.pdf";
  
// write out ly file
  $handle = fopen($namely, 'w');
  fwrite($handle, $ly);
  fclose($handle);
  
// run lilypond
  exec("export HOME=/home/sacredmusic && /home/sacredmusic/bin/lilypond --ps -o\"{$tmpfname}\" \"$namely\" 2>&1", $lyOutput, $lyRetVal);
// Run gs on it.
  exec("export HOME=/home/sacredmusic && gs -q -dSAFER -dDEVICEWIDTHPOINTS=$width -dDEVICEHEIGHTPOINTS=$height -dCompatibilityLevel=1.4 -dNOPAUSE -dBATCH -r1200 -sDEVICE=pdfwrite -dEmbedAllFonts=true -dSubsetFonts=true -sOutputFile=\"{$namepdf}\" -c.setpdfwrite -f\"{$nameps}\" 2>&1", $gsOutput, $gsRetVal);
  if($lyRetVal){
    header("Content-type: text/plain");
    echo implode("\n",$lyOutput);
    return;
  }
  if($gsRetVal){
    header("Content-type: text/plain");
    echo implode("\n",$lyOutput);
    echo "\n\n";
    echo implode("\n",$gsOutput);
    return;
  }
// Copy the pdf into another directory, or upload to an FTP site.
  if($croppdf) {
    exec("pdfcrop \"$namepdf\" \"$finalpdf\"");
  } else {
    rename($namepdf,$finalpdf);
  }
  header("Content-type: $fmtmime");
  if($format=='none'){
  }else if($format=='pdf'){
    $handle = fopen($finalpdf, 'r');
    fpassthru($handle);
    fclose($handle);
  } else {
    passthru("convert -density 480 \"$finalpdf\" +append -resize 25% $format:-");
  }
//  @unlink($namepdf);
//  @unlink($namedvi);
//  @unlink($nametex);
//  @unlink($namegtex);
  if($deletepdf){
    //@unlink($namegabc);
    //@unlink($finalpdf);
    //@unlink($namely);
  } else {
//    rename($namegabc,"scores/square/$odir/$ofilename.gabc");
  }
} else {
  header("content-type:text/plain");
  echo "No ly input found.";
}
?>