<?php
$font=$_REQUEST['font'];
$gabc=$_REQUEST['gabc'];
$guid=$_REQUEST['guid'];
$filename=$_REQUEST['filename'];
$format=$_REQUEST['fmt'];
$width=$_REQUEST['width'];
$height=$_REQUEST['height'];
$spacing=$_REQUEST['spacing'];
$save=$_REQUEST['save'];
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
ini_set('magic_quotes_runtime', 0);
if($format=='' OR $format=='png'){
  $format='png';
  $fmtmime='image/png';
} else if($format=='eps') {
  $ftmmime='application/eps';
} else if($format=='json') {
  $ftmmime='application/json';
} else if($format=='zip') {
  $ftmmime='application/json';
} else {
  $format = 'pdf';
  $fmtmime='application/pdf';
}
if($gabc=='') {
  header("Content-type: application/json");
  if($guid) {
    $dir = "scores/square/sandbox/$guid";
    if(is_dir($dir)) {
      exec("zip -1j $dir $dir/*");
      $result = array("href" => "$dir.zip");
    } else {
      $result = array("error" => "Guid not found: $guid");
    }
  } else {
    $result = array("error" => "No directory given to ZIP");
  }
  echo json_encode($result);
} else {
  $theader = substr($gabc,0,strpos($gabc,'%%'));
  $header = array();
  $pattern = '/(?:^|\\n)([\w-_]+):\s*([^;\\r\\n]+)(?:;|$)/i';
  $offset = 0;
  if(preg_match_all($pattern, $theader, $matches)>0){
    foreach($matches[1] as $key => $value){
      $header[$value] = $matches[2][$key];
    }
  }
  $dir = 'scores/square/sandbox';
  $ofilename = uniqid('greogrio',true);
  $tmpfname = "tmp/$ofilename";
  if($guid) {
    $dir .= "/$guid";
    if(!is_dir($dir)) {
      mkdir($dir);
    }
    $ofilename = $filename;
  }
  
  $namegabc = "$tmpfname.gabc";
  $namegtex = "$tmpfname.tex";
  $nametex = "$tmpfname.main.tex";
  $namedvi = "$tmpfname.main.dvi";
  $namepdf = str_replace('\'','',"$tmpfname.main.pdf");
  $namelog="$tmpfname.main.log";
  $nameaux="$tmpfname.main.aux";
  
  $tmpfnameS = str_replace('\'','\\\'',$tmpfname);
  $namegabcS = str_replace('\'','\\\'',$namegabc);
  $namegtexS = str_replace('\'','\\\'',$namegtex);
  $nametexS = str_replace('\'','\\\'',$nametex);
  $namedviS = str_replace('\'','\\\'',$namedvi);
  $namepdfS = str_replace('\'','\\\'',$namepdf);
  $namelogS = str_replace('\'','\\\'',$namelog);
  $nameauxS = str_replace('\'','\\\'',$nameaux);
  
  if($format=='eps'){
    $finalpdf = "$dir/$ofilename.eps";
  } else {
    $finalpdf = "$dir/$ofilename.pdf";
  }
  $finalpdfS = str_replace('\'','\\\'',$finalpdf);
  
  $spacingcmd = '';
  if($spacing!=''){
    $spacingcmd = "\GreLoadSpaceConf{{$spacing}}";
  }
  $italicline = $header['commentary'];
  $commentcmd = '';
  $usernotesline = $header['user-notes'];
  if($usernotesline != '' or $italicline != ''){
    $commentcmd = "\\dualcomment{{$usernotesline}}{{$italicline}}";
  }
  $annotation = $header['annotation'];
  $titlecmd = $header['name'] == ''? '' : "\\begin{center}\\begin{huge}\\textsc{{$header['name']}}\\end{huge}\\end{center}";
  $annotcmd = '';
  $annotsuffix='';
  if($annotation != '') {
    if(preg_match('/[a-g]\d?\*?\s*$/',$annotation, $match)){
      $annotsuffix=$match[0];
      $annotation = substr($annotation,0,strlen($annotation) - strlen($annotsuffix));
    }
    $annotation = preg_replace_callback(
      '/\b[A-Z\d]+\b/',
      create_function(
        '$matches',
        'return strtolower($matches[0]);'
      ),
      $annotation
    );
    $annothelper = "\\fontsize{12}{12}\\selectfont{\\textsc{{$annotation}}$annotsuffix}";
    $annotcmd = "\\gresetfirstlineaboveinitial{{$annothelper}}{{$annothelper}}";
  }
  if($annotcmd != ''){
    $annotwidthcmd = <<<EOF
\\newlength{\\annotwidth}
\\settowidth{\\annotwidth}{{$annothelper}}
\\newlength{\\spacewidth}
%\\setlength{\\spacewidth}{0.6em plus 0em minus 0em}
\\setlength{\\spacewidth}{0.4\\annotwidth}
\\newlength{\\initwidth}
\\settowidth{\\initwidth}{\LARGE I}
\\addtolength{\\spacewidth}{-0.3\\initwidth}
\\setspaceafterinitial{\\spacewidth}
\\setspacebeforeinitial{\\spacewidth}
EOF;
  }
  $annotwidthcmd=<<<EOF
\\setspaceafterinitial{2.2mm plus 0em minus 0em}
\\setspacebeforeinitial{2.2mm plus 0em minus 0em}
EOF;
  $pwidth=$width+1;
  $papercmd=<<<EOF
%\\usepackage{vmargin}
%\\setpapersize{custom}{{$pwidth}in}{{$height}in}
%\\setmargnohfrb{0.5in}{0.5in}{0.5in}{0.5in}
\\usepackage[papersize={{$pwidth}in,{$height}in},margin=0.5in]{geometry}
\\special{ pdf: pagesize width {$pwidth}truein height {$height}truein}
EOF;
  
// write out gabc
  $handle = fopen($namegabc, 'w');
  if(!$handle){
    $result = array("error" => "Unable to create file $namegabc");
    header("Content-type: application/json");
    echo json_encode($result);
    return;
  }
  fwrite($handle, "\xEF\xBB\xBF$gabc");
  fclose($handle);
// Write out a template main.tex file that includes the score just outputted.
  $handle = fopen($nametex, 'w');
  fwrite($handle, <<<EOF
\\documentclass[10pt]{article}
$papercmd
%\\usepackage{fullpage}
\\usepackage{{$font}}
\\usepackage{color}
\\usepackage{gregoriotex}
\\usepackage[utf8]{luainputenc}
\\textwidth {$width}in
\\pagestyle{empty}
\\begin{document}
\\font\\versiculum=Versiculum-tlf-ly1 at 12pt
\\font\\garamondInitial=GaramondPremrPro-tlf-ly1 at 38pt
\\gresetstafflinefactor{13}
\\def\\greinitialformat#1{%
{\\garamondInitial #1}}
%{\\fontsize{38}{38}\\selectfont #1}}



\\def\\dualcomment#1#2{%
  \\setlength{\\parindent}{0pt}%
  \\vbox{\\textit{#1 \\hfill #2}}%
  \\vspace{0.25em}%
  \\relax%
}
\\def\\grestar{%
  *%
  \\relax%
}
\\def\\Abar{%
  {\\versiculum a}%
  \\relax%
}

\\def\\Rbar{%
  {\\versiculum r}%
  \\relax%
}

\\def\\Vbar{%
  {\\versiculum v}%
  \\relax%
}
\\def\\gretranslationformat#1{%
  \\fontsize{10}{10}\\selectfont\\it{#1}%
  \\relax %
}
\\def\\pdfliteral#1{%
  \\relax%
}
\\def\\UseAlternatePunctumCavum{%
\\gdef\\grepunctumcavumchar{\\gregoriofont\\char 75}%
\\gdef\\grelineapunctumcavumchar{\\gregoriofont\\char 76}%
\\gdef\\grepunctumcavumholechar{\\gregoriofont\\char 78}%
\\gdef\\grelineapunctumcavumholechar{\\gregoriofont\\char 80}%
\\relax %
}
$spacingcmd
$titlecmd
$annotcmd
$commentcmd
\\setgrefactor{17}
\\fontsize{10}{10}\\selectfont
$annotwidthcmd
\\gretranslationheight = 0.1904in
\\grespaceabovelines=0.1044in
\\large
\\UseAlternatePunctumCavum{\\includescore{{$namegtex}}}

\\end{document}
EOF
    );
// run gregorio
  exec("/home/sacredmusic/bin/gregorio $namegabcS 2>&1", $gregOutput, $gregRetVal);
// Run lamed on it.
  exec("export TEXMFCONFIG=/home/sacredmusic/texmf && export TEXMFHOME=/home/sacredmusic/texmf && export HOME=/home/sacredmusic && export TEXMFCNF=.: && lamed -output-directory=tmp -interaction=nonstopmode $nametexS 2>&1", $lamedOutput, $lamedRetVal);
// Run dvipdfm on the .dvi
  exec("export TEXMFCONFIG=/home/sacredmusic/texmf && export TEXMFHOME=/home/sacredmusic/texmf && export HOME=/home/sacredmusic && dvipdfm -o $namepdfS $namedviS 2>&1", $dvipdfmOutput, $dvipdfmRetVal);
  if($gregRetVal){
    $result = array("error" => implode("\n",$gregOutput));
    header("Content-type: application/json");
    echo json_encode($result);
    return;
  }
  if($lamedRetVal){
    $result = array("error" => implode("\n",$gregOutput) . "\n\n" . implode("\n",$lamedOutput));
    header("Content-type: application/json");
    echo json_encode($result);
    return;
  }
// Copy the pdf into another directory, or upload to an FTP site.
  if($croppdf) {
    exec("pdfcrop $namepdf $namepdf 2>&1", $croppdfOutput, $croppdfRetVal);
    if($croppdfRetVal){
      $result = array("error" => implode("\n",$croppdfOutput));
      header("Content-type: application/json");
      echo json_encode($result);
      return;
    }
  }
  $entries = scandir($dir);
  $cutoff = new DateTime;
  $cutoff->modify('-1 hour');
  $cutoff = $cutoff->getTimestamp();
  foreach($entries as $v) {
    $fn = "$dir/$v";
    if(is_dir($fn) OR preg_match('/^\.|^\.{1,2}$/',$v)) {
      continue;
    }
    $stat = stat($fn);
    if($stat['mtime'] < $cutoff) {
      unlink($fn);
    }
  }
  if($format=='eps'){
    exec("gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=epswrite -dCompatibilityLevel=1.3 -dEmbedAllFonts=true -dSubsetFonts=true -sOutputFile=$finalpdfS $namepdf");
  } else {
    rename($namepdf,$finalpdf);
    //Instead of just renaming it, let's subset the fonts:
    //exec("gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dCompatibilityLevel=1.3 -dEmbedAllFonts=true -dSubsetFonts=true -sOutputFile=$finalpdfS $namepdf");
  }
  if($format=='pdf' || $format=='eps'){
    //passthru("gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dCompatibilityLevel=1.3 -dEmbedAllFonts=true -dSubsetFonts=true -sOutputFile=- $finalpdfS");
    header('HTTP/1.1 301 Moved Permanently');
    header("Location: $finalpdf");
    exit();
  } else if($format=='png') {
    header("Content-type: $fmtmime");
    passthru("convert -density 480 $finalpdfS +append -resize 25% $format:-");
  } else if($format=='json') {
    $result = array("href" => $finalpdf);
    header("Content-type: application/json");
    echo json_encode($result);
  }
  @unlink($namepdf);
  @unlink($namedvi);
  @unlink($nametex);
  @unlink($nameaux);
  @unlink($namelog);
  if($ofilename != 'gabc') {
    @unlink($namegtex);
  }
  @unlink($namegabc);
  //@unlink($finalpdf);
  @unlink($namegabc);
}
?>