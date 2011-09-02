<?php
$gabc=$_REQUEST['gabc'];
$format=$_REQUEST['fmt'];
$width=$_REQUEST['width'];
$height=$_REQUEST['height'];
$spacing=$_REQUEST['spacing'];
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
if($format==''){
  $format='png';
  $fmtmime='image/png';
} else {
  $fmtmime='application/pdf';
}
if($gabc!='') {
  $theader = substr($gabc,0,strpos($gabc,'%%'));
  $header = array();
  $pattern = '/(?:^|\\n)([\w-_]+):\s*([^;\\r\\n]+)(?:;|$)/i';
  $offset = 0;
  if(preg_match_all($pattern, $theader, $matches)>0){
    foreach($matches[1] as $key => $value){
      $header[$value] = $matches[2][$key];
    }
  }
  $odir = $header['office-part'];
  $ofilename = $header['name'];
  if($ofilename=='') {
    $ofilename='Untitled';
    $odir='sandbox';
  }
  if($odir == ''){
    $odir='sandbox';
  } else if(!is_dir("scores/square/$odir")){
    header("Content-type: text/plain");
    echo "The directory scores/square/$odir does not exist.  Please create it manually if this is the directory you intended.";
    return;
  }
  
  $tmpfname = "tmp/$ofilename";
  $namegabc = "$tmpfname.gabc";
  $namegtex = "$tmpfname.tex";
  $nametex = "$tmpfname.main.tex";
  $namedvi = "$tmpfname.main.dvi";
  $namepdf = "$tmpfname.main.pdf";
  $namelog="$tmpfname.main.log";
  $nameaux="$tmpfname.main.aux";
  $deletepdf = ($_REQUEST['deletepdf']!='' or $ofilename=='Untitled');
  $finalpdf = ($deletepdf?'tmp/tmp.':"scores/square/$odir/")."$ofilename.pdf";
  
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
  fwrite($handle, stripslashes($gabc));
  fclose($handle);
// Write out a template main.tex file that includes the score just outputted.
  $handle = fopen($nametex, 'w');
  fwrite($handle, <<<EOF
\\documentclass[10pt]{article}
$papercmd
%\\usepackage{fullpage}
\\usepackage{GaramondPremierPro}
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
  exec("/home/sacredmusic/bin/gregorio $namegabc 2>&1", $gregOutput, $gregRetVal);
// Run lamed on it.
  exec("export TEXMFCONFIG=/home/sacredmusic/texmf && export TEXMFHOME=/home/sacredmusic/texmf && export HOME=/home/sacredmusic && export TEXMFCNF=.: && lamed -output-directory=tmp -interaction=nonstopmode $nametex 2>&1", $lamedOutput, $lamedRetVal);
// Run dvipdfm on the .dvi
  exec("export TEXMFCONFIG=/home/sacredmusic/texmf && export TEXMFHOME=/home/sacredmusic/texmf && export HOME=/home/sacredmusic && dvipdfm -o $namepdf $namedvi 2>&1", $dvipdfmOutput, $dvipdfmRetVal);
  if($gregRetVal){
    header("Content-type: text/plain");
    echo implode("\n",$gregOutput);
    return;
  }
  if($lamedRetVal){
    header("Content-type: text/plain");
    echo implode("\n",$gregOutput);
    echo "\n\n";
    echo implode("\n",$lamedOutput);
    return;
  }
// Copy the pdf into another directory, or upload to an FTP site.
  if($croppdf) {
    exec("pdfcrop $namepdf $finalpdf");
  } else {
    rename($namepdf,$finalpdf);
  }
  header("Content-type: $fmtmime");
  if($format=='pdf'){
    $handle = fopen($finalpdf, 'r');
    fpassthru($handle);
    fclose($handle);
  } else {
    passthru("convert -density 480 $finalpdf +append -resize 25% $format:-");
  }
//  @unlink($namepdf);
//  @unlink($namedvi);
//  @unlink($nametex);
  @unlink($nameaux);
  @unlink($namelog);
//  @unlink($namegtex);
  if($deletepdf){
    @unlink($namegabc);
    @unlink($finalpdf);
    @unlink($namegabc);
  } else {
    rename($namegabc,"scores/square/$odir/$ofilename.gabc");
  }
} else {
  exec('/home/sacredmusic/bin/gregorio tmp/PopulusSion.gabc');
  exec('export TEXMFCONFIG=/home/sacredmusic/texmf && export TEXMFHOME=/home/sacredmusic/texmf && lamed -output-directory=tmp -interaction=batchmode tmp/main-lualatex.tex');
  exec('export TEXMFCONFIG=/home/sacredmusic/texmf && export TEXMFHOME=/home/sacredmusic/texmf && dvipdfm -o tmp/main-lualatex.pdf tmp/main-lualatex.dvi');
  //rename('tmp/main-lualatex.pdf','pdf/PopulusSion.pdf');
  header("Content-type: $fmtmime");
  if($format=='pdf') {
    $handle = fopen('pdf/PopulusSion.pdf', 'r');
    fpassthru($handle);
    fclose($handle);
  } else {
    passthru("convert pdf/PopulusSion.pdf -resize 90% $format:-");
  }
}
?>