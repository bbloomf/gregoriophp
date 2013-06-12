<?php
$font=$_REQUEST['font'];
$size=$_REQUEST['fontsize'];
$gabc=$_REQUEST['gabc'];
$guid=$_REQUEST['guid'];
$filename=$_REQUEST['filename'];
$format=$_REQUEST['fmt'];
$width=$_REQUEST['width'];
$height=$_REQUEST['height'];
$spacing=$_REQUEST['spacing'];
$save=$_REQUEST['save'];
$croppdf=true;
if($size) {
  $sizeCmd = "\\fontsize{{$size}}{{$size}}\\selectfont";
} else {
  $sizeCmd = '\\large';
}
$initialFormat = '{\\fontsize{36}{36}\\selectfont #1}}';
if($font == 'palatino') {
  $sizeCmd = '';
} else if($font=='GaramondPremierPro'){
  $initialFormat = '{\\garamondInitial #1}}';
}
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
  if(is_array($gabc)) {
    $gabcs = $gabc;
  } else {
    $gabcs = Array($gabc);
  }
  
  $dir = 'tmp';
  $ofilename = uniqid('gregorio',true);
  $tmpfname = "tmp/$ofilename";
  if($guid) {
    $dir .= "/$guid";
    if(!is_dir($dir)) {
      mkdir($dir);
    }
    $ofilename = $filename;
  }
  $nametex = "$tmpfname.tex";
  $namedvi = "$tmpfname.dvi";
  $namepdf = str_replace('\'','',"$tmpfname.pdf");
  $namelog="$tmpfname.log";
  $nameaux="$tmpfname.aux";
  $tmpfnameS = str_replace('\'','\\\'',$tmpfname);
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
  
  $pwidth=$width+1;
  $papercmd="%\\usepackage{vmargin}
%\\setpapersize{custom}{{$pwidth}in}{{$height}in}
%\\setmargnohfrb{0.5in}{0.5in}{0.5in}{0.5in}
\\usepackage[papersize={{$pwidth}in,{$height}in},margin=0.5in]{geometry}
\\special{ pdf: pagesize width {$pwidth}truein height {$height}truein}";
  $includeScores = '';
  foreach($gabcs as $i => $gabc) {
    $theader = substr($gabc,0,strpos($gabc,'%%'));
    if(preg_match('/%%(?:\s*(?:\([^)]*\))*)+(\S)/',$gabc, $match)){
      $initial=$match[1];
    }
    $header = array();
    $pattern = '/(?:^|\\n)([\w-_]+):\s*([^;\\r\\n]+)(?:;|$)/i';
    $offset = 0;
    if(preg_match_all($pattern, $theader, $matches)>0){
      foreach($matches[1] as $key => $value){
        if(!$header[$value]) {
          $header[$value] = $matches[2][$key];
        } else {
          if(!$header[$value . 'Array']) {
            $header[$value . 'Array'] = array();
            $header[$value . 'Array'][] = $header[$value];
          }
          $header[$value . 'Array'][] = $matches[2][$key];
        }
      }
    }

    $namegabc = "$tmpfname.$i.gabc";
    $namegtex = "$tmpfname.$i.tex";
    $namegabcS = str_replace('\'','\\\'',$namegabc);
    $namegtexS = str_replace('\'','\\\'',$namegtex);

    $spacingcmd = '';
    if($spacing!=''){
      //$spacingcmd = "\GreLoadSpaceConf{{$spacing}}";
      $spacingcmd = "\\greremovetranslationspace\\greremovespaceabove\\input gsp-$spacing.tex\\greadaptconfvalues\\gresetverticalspaces\\global\\divide\\greadditionallineswidth by \\grefactor%";
    }
    $italicline = $header['commentary'];
    $commentcmd = '';
    $usernotesline = $header['user-notes'];
    if($usernotesline != '' or $italicline != ''){
      $commentcmd = "\\dualcomment{{$usernotesline}}{{$italicline}}";
    }
    $annotation = $header['annotation'];
    $annotationTwo = $header['annotationArray'][1];
    if($annotationTwo == $annotation) {
      $annotationTwo = '';
    }
    $titlecmd = $header['name'] == ''? '' : "\\begin{center}\\begin{huge}\\textsc{{$header['name']}}\\end{huge}\\end{center}\\vspace{-8pt}";
    $annotcmd = '';
    if($annotation) {
      $annotsuffix='';
      if(preg_match('/[^a-z]+([a-g]\d?\*?\s*)$/',$annotation, $match)){
        $annotsuffix=$match[1];
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
      if($font == 'Georgia') {
        $upperAnnot = strtoupper($annotation);
        $annothelper = "\\fontsize{8}{8}\\selectfont{{$upperAnnot}$annotsuffix}";
      } else {
        $annothelper = "\\fontsize{10}{10}\\selectfont{\\textsc{{$annotation}}$annotsuffix}";
      }
      $annotcmd = "\\def\\annot{{$annothelper}}";
    } else {
      $annotcmd = "\\def\\annot{}";
    }
    if($annotationTwo) {
      $annotsuffix='';
      if(preg_match('/[^a-z]+([a-g]\d?\*?\s*)$/',$annotation, $match)){
        $annotsuffix=$match[1];
        $annotationTwo = substr($annotationTwo,0,strlen($annotationTwo) - strlen($annotsuffix));
      }
      $annotationTwo = preg_replace_callback(
        '/\b[A-Z\d]+\b/',
        create_function(
          '$matches',
          'return strtolower($matches[0]);'
        ),
        $annotationTwo
      );
      if($font == 'Georgia') {
        $upperAnnot = strtoupper($annotationTwo);
        $annothelperTwo = "\\fontsize{8}{8}\\selectfont{{$upperAnnot}$annotsuffix}";
      } else {
        $annothelperTwo = "\\fontsize{10}{10}\\selectfont{\\textsc{{$annotationTwo}}$annotsuffix}";
      }
      //$annotcmd .= "\\gresetsecondlineaboveinitial{{$annothelperTwo}}{{$annothelperTwo}}";
      $annotcmd .= "\\def\\annottwo{{$annothelperTwo}}";
    } else {
      $annotcmd .= "\\def\\annottwo{}";
    }
    if($annotcmd != ''){
      if($initial) {
        $annotcmd .= "\\setinitialspacing{{$initial}}";
      } else {
        $annotcmd .= "\\setinitialspacing{?}";
      }
    }

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
    
    
    $includeScores .= "$titlecmd
$commentcmd
\\setgrefactor{17}
$spacingcmd
$annotcmd
\\gretranslationheight = 0.1904in
\\grespaceabovelines=0.1044in
$sizeCmd
\\UseAlternatePunctumCavum{\\includescore{{$namegtex}}}

";
    // run gregorio
    exec("/home/sacredmusic/bin/gregorio $namegabcS 2>&1", $gregOutput, $gregRetVal);

    if($gregRetVal){
      $result = array("error" => implode("\n",$gregOutput));
      header("Content-type: application/json");
      echo json_encode($result);
      return;
    }
  }
  
/////////////////////////////////////////////////////////////////////////////
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
$initialFormat


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
\\gdef\\grelowchoralsignstyle#1{{\\fontsize{8}{8}\\selectfont #1}}
\\gdef\\grehighchoralsignstyle#1{{\\fontsize{8}{8}\\selectfont #1}}
\\def\\greabovelinestextstyle#1{\\hspace*{-5pt}\\small\\textit{#1}}
% greinitialformat must be set before calling!
\\newlength{\\annotwidth}
\\newlength{\\annottwowidth}
\\newlength{\\spacewidth}
\\newlength{\\initwidth}
\\newcommand{\\setinitialspacing}[1]{%
% 1 - initial, e.g., I
\\settowidth{\\annotwidth}{\\annot\\hspace{0.5pc}}
\\ifx\\annottwo\\undefined\\else%
\\settowidth{\\annottwowidth}{\\annottwo\\hspace{0.5pc}}
\\ifdim\\annottwowidth>\\annotwidth%
\\setlength{\\annotwidth}{\\annottwowidth}
\\fi
\\fi
\\settowidth{\\initwidth}{\\greinitialformat{#1}}
\\settowidth{\\spacewidth}{\\greinitialformat{#1}\\hspace{1pc}}
\\ifdim\\spacewidth<\\annotwidth%
\\setlength{\\spacewidth}{\\annotwidth}
\\fi
\\addtolength{\\spacewidth}{-\\initwidth}
\\setlength{\\spacewidth}{0.5\\spacewidth}
%
\\GreSetSpaceBeforeInitial{\\spacewidth}
\\GreSetSpaceAfterInitial{\\spacewidth}
%
\\gresetfirstannotation{\\annot}
\\ifx\\annottwo\\undefined\\else%
\\gresetsecondannotation{\\annottwo}
\\fi
}
$includeScores
\\end{document}
EOF
);
/////////////////////////////////////////////////////////////////////////

// Run lualatex on it.
  exec("export HOME=/home/sacredmusic && export TEXMFCNF=.: && /home/sacredmusic/bin/lualatex -output-directory=tmp -interaction=batchmode $nametexS 2>&1", $lualatexOutput, $lualatexRetVal);
  if($lualatexRetVal){
    $result = array("file" => $nametex,
      "error" => implode("\n",$gregOutput) . "\n\n" . implode("\n",$lualatexOutput));
    header("Content-type: application/json");
    echo json_encode($result);
    return;
  }
// Copy the pdf into another directory, or upload to an FTP site.
  if($croppdf) {
    exec("pdfcrop '$namepdf' '$namepdf' 2>&1", $croppdfOutput, $croppdfRetVal);
    if($croppdfRetVal){
      $result = array("error" => implode("\n",$croppdfOutput));
      header("Content-type: application/json");
      echo json_encode($result);
      return;
    }
  }
function deleteOlderFilesIn($dir,$cutoff,$delIfEmpty) {
  $entries = scandir($dir);
  $count = 2;
  foreach($entries as $v) {
    $fn = "$dir/$v";
    if(is_dir($fn)) {
      if(preg_match('/^\./',$v)) {
        continue;
      }
      deleteOlderFilesIn("$dir/$v",$cutoff,true);
      $count = 0;
      continue;
    }
    $stat = stat($fn);
    if($stat['mtime'] < $cutoff) {
      unlink($fn);
      ++$count;
    }
  }
  if($delIfEmpty && $count == count($entries)) {
    rmdir($dir);
  }
}
  $cutoff = new DateTime;
  $cutoff->modify('-1 hour');
  $cutoff = $cutoff->getTimestamp();
  deleteOlderFilesIn($dir,$cutoff,false);
  deleteOlderFilesIn('tmp/',$cutoff,false);
  
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
}
?>