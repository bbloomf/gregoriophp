﻿String.prototype.repeat = function(num){return new Array(num+1).join(this);};
gabcSettings={trimStaff:true};
// lower-staff ext: 0xe1, upper: 0xe2
var _indicesChar = {
  flat:    [0xE0F1,0xe340,0xE0F2,0xe341,0xE0F3,0xe342,0xE0F4,0xe343,0xE0F5,0xe344,0xE0F6,0xe345,0xE0F7],
  natural: [0xE0F9,0xe346,0xE0FA,0xe347,0xE0FB,0xe348,0xE0FC,0xe349,0xE0FD,0xe34A,0xE0FE,0xe34B,0xE0FF],
  flat_line: 0xe340,  // these only exist for lines (bdfhjl)
  natural_line: 0xe346,
  punctum: 0xE103,
  diamond: 0xE113,
  virga: 0xE123,
  v: 0xE123,
  leftVirga: 0xE133,
  quilisma: 0xE143,
  w: 0xE143,
  bottomPartPodatus: 0xE154,
  topPartPodatus: 0xE163,
  podatus: [
    null,
    0xE173,
    0xE183,
    0xE194,
    0xe1a3
  ],
  o: 0xe1b3,
  O: 0xe1c3,
  diamond_tilde: 0xe1d3,
  ">": 0xe1e3,
  "<": 0xe1f3,
  upper_tilde: 0xe203,
  lower_tilde: 0xe213,
  porrectus: [
    null,
    0xe223,
    0xe233,
    0xe243,
    0xe253
  ],
  r: 0xe273,
  s: 0xe283,
  custos: 0xe2a3,
  '+': 0xe2a3,
  dot: 0xe2b3,
  apos: 0xe2c2, //ichtus
  ictus: 0xe2c2,
  ictus_above:0xe2c5,
  ictus_below:0xe2c2,
  underscore: 0xe2d2,
  episema: 0xe2d2,
  episema_below:0xe2d2,
  episema_above:0xe2d5,
  underscore_longer: 0xe2e2,
  episema_longer: 0xe2e2,
  clivis: [
    null,
    0xe303,
    0xe313,
    0xe323,
    0xe333
  ],
  accent_above_staff: 0xe34c, // four different heights
  connecting_line: [
    undefined,
    undefined,
    0xe703,
    0xe713,
    0xe723,
    0xe733
  ],
  decorative_line: [
    undefined,
    0xe743,
    0xe753,
    0xe763,
    0xe773,
    0xe783
  ]
};
var _indicesLig = {
  flat: 'b', // these only exist for spaces (acegikm)
  natural: 'a', // ditto
  punctum: 'p',
  diamond: 'n',
  virga: 'v',
  v: 'v',
  leftVirga: 'c',
  quilisma: 'q',
  w: 'q',
  podatus: 'P',
  bottomPartPodatus: 0xE154,
  topPartPodatus: 'P',
  o: 'o',
  O: 'O',
  diamond_tilde: 'N',
  ">": 'L',
  "<": 'k',
  upper_tilde: 'K',
  lower_tilde: 'l',
  porrectus: 'R',
  r: 'w',
  s: 's',
  custos: 'u',
  '+': 'u',
  dot: '.',
  apos: 'I', //ichtus
  ictus: 'I',
  ictus_above: 'I',
  ictus_below: 'i',
  underscore: 'H',
  episema: 'H',
  episema_above: 'H',
  episema_below: 'h',
  underscore_longer: 0xe2e2,
  episema_longer: 0xe2e2,
  clivis: 'C',
  accent_above_staff: '~', // four different heights
  connecting_line: 'x',
  decorative_line: 'X'
};
var _neumeLig=function(a,b){
  if(arguments.length<2)return"";
  if(typeof(a)!=="string") {
    if(arguments.length==2 && typeof(a)=="number"){
      return _neumeChar(a,b);
    }
    return"";
  }
  var result='';
  var i=1;
  while(i<arguments.length){
    result += _ci[arguments[i++]];
  }
  return result + a;
}
var _neumeChar=function(a,b){
  if(arguments.length<2)return"";
  var base=a;
  var a,b;
  a=parseInt(b);
  b=0;
  if(typeof(base)=='object'){
    if(arguments.length>2)b=parseInt(arguments[2]);
    base=base[Math.abs(b-a)];
    if(arguments.length==2)a=0;
  }
  return String.fromCharCode(base + a);
}

var _clefSpanLig=function(tone){
  var line = parseInt(tone.clef.slice(-1),10);
  var num=line*2-1;
  var extra="";
  if(tone.clef.length==3) {
    extra += neume(indices.flat,num+1) + "-";
  }
  return make('tspan',String(num) + (tone.index==2? "d" : "f") + "-" + extra);
}
var _clefSpanChar=function(tone,minDy){
  var result,
      line = parseInt(tone.clef.slice(-1),10),
      dy = 0,
      curChar;
  if(tone.index == 2) {
    curChar = "d-";
    dy = 2 - line;
  } else {
    curChar = "f-";
    dy = 3 - line;
  }
  if(tone.clef.length==3) {
    curChar += neume(indices.flat,4) + "-";
  }
  dy *= spaceheight;
  minDy[0] = Math.min(minDy[0],dy);
  result=make('tspan',curChar);
  result.setAttribute('dy', dy);
  return result;
}

var _ci=['B','A','0','1','2','3','4','5','6','7','8','9','Z'];
var staffheight = 48;
var spaceheight = staffheight / 4;
var notewidth = staffheight / 6;
var spaceBetweenNeumes = notewidth;
var verticalSpace = staffheight/4;
var fontsize = spaceheight*3/2;
var spaceWidth = spaceheight * 3/4;
var staffoffset = Math.ceil(staffheight - spaceheight/2);
var svgns = "http://www.w3.org/2000/svg";
var xlinkns="http://www.w3.org/1999/xlink";
var staffInFont = false;
var fontExt='ttf';
var fontExtS='svg#webfont';
var fontFormat="truetype";
var fontFormatS="svg";
var filenameCaeciliae = "Caeciliae-" + (staffInFont? "Regular." : "Staffless.")+fontExt;
var filenameCaeciliaeS = "Caeciliae-" + (staffInFont? "Regular." : "Staffless.")+fontExtS;
var filenameCaeciliaePrint = "Caeciliae-" + (staffInFont? "Regular" : "Staffless")+"-Print."+fontExt;
var localCaeciliae = "Caeciliae" + (staffInFont? "" : " Staffless");
var familyCaeciliae = "Caeciliae" + (staffInFont? "" : " Staffless");
var styleCaeciliae = "font-family: '"+familyCaeciliae+"'; font-size:" + staffheight + "px;";
var styleCaeciliaeSvg="font-family: '"+familyCaeciliae+" SVG'; font-size:" + staffheight + "px;";
var styleGoudy = "font-family: 'OFL Sorts Mill Goudy TT';" + " font-size: " + fontsize + "px;";

var styleFont="@font-face {font-family: '"+familyCaeciliae+"'; font-weight: normal; font-style: normal;src: local('"+localCaeciliae+"'); src: url('"+filenameCaeciliae+"') format('"+fontFormat+"')}"
        + "@font-face {font-family: '"+familyCaeciliae+" SVG'; font-weight: normal; font-style: normal;src: url('"+filenameCaeciliaeS+"') format('"+fontFormatS+"')}"
        + "@font-face {font-family: '"+familyCaeciliae+" Print'; font-weight: normal; font-style: normal;src: url('"+filenameCaeciliaePrint+"') format('"+fontFormat+"')}"
        + "@font-face {font-family: 'OFL Sorts Mill Goudy TT'; font-style: italic; font-weight: normal; src: local('OFL Sorts Mill Goudy Italic TT'), local('OFLGoudyStMTT-Italic'), url('OFLGoudyStMTT-Italic.ttf') format('truetype');}"
        + "@font-face {font-family: 'OFL Sorts Mill Goudy TT'; font-style: normal; font-weight: normal; src: local('OFL Sorts Mill Goudy TT'), local('OFLGoudyStMTT'), url('OFLGoudyStMTT.ttf') format('truetype');}"

var svgWidth;
var svg;
var textElem;
var codea = 'a'.charCodeAt(0);
var codem = codea + 12;
var codeA = 'A'.charCodeAt(0);
var codeM = codeA + 12;
var regexTranslate=/translate\((-?\d+(?:\.\d+)?)(?:[,\s]\s*(-?\d+(?:.\d+)?))?\)/;
var regexTranslateG=/translate\((-?\d+(?:\.\d+)?)(?:[,\s]\s*(-?\d+(?:.\d+)?))?\)/g;
var regexHeaderEnd=/(?:^|\n)%%\n/;
var regexOuter = /((([^\(\r\n]+)($|\())|\()([^\)]*)($|\))(?:(\s+)|(?=(?:\([^\)]*\))+(\s*))|)/g;
var regexTag = /<(\/)?(b|i|sc)>/i;
var regexSqBrackets = /\[([^\]]*)(?:\]|$)/;
var regexTags= /(<(b|i|sc)>)(.*?)(?:(<\/\1>)|$)/i;
var regexTagsSp = /<sp>([^<]*)<\/sp>/gi;
var spSubstitutions = {
  "'ae": 'ǽ',
  "'æ": 'ǽ',
  "ae": 'æ',
  "oe": 'œ',
  "'œ": 'œ',
  "'oe": 'œ',
  "AE": 'Æ',
  "OE": 'Œ',
  "Ae": 'Æ',
  "Oe": 'Œ',
  "V/": 'V',
  "R/": 'R',
  "A/": 'A'
};
String.prototype.replaceSpTags = function(){
  return this.replace(regexTagsSp,function(s){
    var tmp = s.slice(4,-5);
    return spSubstitutions[tmp]||tmp;
  });
}
var regexInner = /(?:[!\/ ,;:`]+|[^\)!\/ ,;:`\[]+)(?:\[[^\]]*(?:$|\]))?/g;
var rog = {
  syl:3,
  gabc:5,
  whitespace:7
}
var linkSelector="";
var linkDownloadSelector="";
var setPdfLinkSelector=function(sel){
  linkSelector=sel;
};
var onDragStart=function(e){
  console.info(e);
  e.originalEvent.dataTransfer.setData("DownloadURL",this.getAttribute("data-downloadurl"));
};
var setGabcLinkSelector=function(sel){
  linkDownloadSelector=sel;
  $(sel).bind("dragstart",onDragStart);
};
var regexToneModifiers = /(')|(\.{1,2})|(_{1,4}0?)/g
var regexTones = new RegExp("([/ ,;:`]+)|((?:[fF]|[cC][bB]?)[1-4])|(?:(-)?(([A-M])|([a-m]))(([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|(o)|(O)|((x)|(y))|(q)|((R)|(r0)|(r(?![1-5])))|(r[1-5])|(\\+))?((?:" + String(regexToneModifiers).replace(/^\/|\/\w*$/g,"").replace(/\((?!\?:)/g,"(?:") + ")*)|(z0))|\\[([^\\]]*)(?:\\]|$)","g");
//                          /([\/ ,;:`]+)|([cfCF][1-4])|(?:(-)?(([A-M])|([a-m]))(([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|(o)|(O)|((x)|(y))|(q)|((R)|(r0)|(r(?![1-5])))|(r[1-5]))?((?:(?:')|(?:\.{1,2})|(?:(?:_0?){1,4}))*)|(z0))|\[([^\]]*)(?:\]|$)                                )*)|(z0))|\[([^\]]*)(?:\]|$)
//                          /([\/ ,;:`]+)|([cfCF][1-4])|(?:(-)?(([A-M])|([a-m]))(([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|(o)|(O)|((x)|(y))|(q)|((R)|(r0)|(r(?![1-5])))|(r[1-5]))?((?:(?:')|(?:\.{1,2})|(?:(?:_0?){1,4}))*)|(z0))|\[([^\]]*)(?:\]|$)
var regexTonesSpliceIndex=27;
var regexToneModifiersCount = 4;
var rtg = {
  whitespace: 1,
  clef: 2,
  initioDebilis: 3,
  tone: 4,
  toneUpper: 5, // diamond
  toneLower: 6,
  noteType: 7,      // (([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|([oO])|([xy])|(q)]|(R|r0|r(?![1-5]))|(r[1-5])|(\+))
  virga: 8,        // [Vv]{1,3}
  stropha: 9,      // s{1,3}
  liquescentia: 10,      // [<>~]
  ascendingLiquescentia: 11,  // <
  descendingLiquescentia: 12,  // >
  diminutiveLiquescentia: 13,  // ~
  quilisma: 14,      // w
  oriscus: 15,      // o
  oriscusReverse: 16,    // O
  accidental: 17,      // [xy]
  flat: 18,        // x
  natural: 19,      // y
  q: 20,        // q
  lineaPunctum: 22,      // R
  lineaPunctumCavum: 23,    // r0
  punctumCavum: 24,      // r
  rNumber: 25,      // r[1-5]
  custos: 26,       // \+
  ictus: 27,        // (')
  dot: 28,          // (\.{1,2})
  episema: 29,      // ((?:_0?)){1,4})
  custos: 30,        // z0
  bracketed: 31      // [text]
};


//var regexVowel = /(?:[cgq]u(?=[aeiouyáéëíóúýæœ])|[iy])?([aá]u|[ao][eé]?|[aeiouyáéëíóúýæœ])/i;
//var regexVowel = /(?:[cgq]u(?=[aeiouyáéëíóúýæœ])|[iy])?([aá]u|[ao][eé]?|[aeiouyáéëíóúýæœ])/i;
var regexVowel = /(?:[cgq]u|[iy])?([aeiouyáéëíóúýǽæœ]+)/i;
var transforms = [['/',' ',',',';',':','`',''],
      ["'",'_','+',';','|',',',''],
      [/\//g,/ /g,/,/g,/;/g,/:/g,/`/g,/!/g]];
var abcs = {};
var _defs = null;
var defText = null;
var _defText = null;
var defChant = null;
var masks = [];
var selectedPunctum=-1;
var selectedNeume=-1;
var selectedPunctumTag=null;
var selectedNeumeTag=null;
var _timeoutGabcUpdate = null;
var _minUpdateInterval = 1700;
var _heightCorrection = 0;
var _clefs=[];
var _accidentals=[];
var _tones=[];

var utf8_bom=String.fromCharCode(0xEF)+String.fromCharCode(0xBB)+String.fromCharCode(0xBF);
function encode_utf8( s )
{
  return utf8_bom+unescape( encodeURIComponent( s ) );
}
function decode_utf8( s )
{
  return decodeURIComponent( escape( s ) );
}

function Header(text){
  this.comments=[];
  this.original='';
  var match=text.match(regexHeaderEnd);
  if(match){
    var txtHeader = this.original = text.slice(0,match.index+match[0].length);
    var lines = txtHeader.split(/\r?\n/g);
    for(i in lines){
      var line=lines[i],
          match = regexHeaderLine.exec(line);
      if(match){
        this[match[1]]=match[2];
      } else if((match = regexHeaderComment.exec(line))){
        if(line!='%%')this.comments[i]=line;
      }
    }
  }
}
Header.prototype.toString = function(){
  var result=[];
  for(key in this){
    if(key.length==0||key=='length' || key=='original' || key=='comments' || (typeof this[key])=="function")continue;
    result .push(key + ': ' + this[key] + ';');
  }
  for(i in this.comments){
    try{
      result.splice(i,0,this.comments[i]);
    } catch(e){}
  }
  return result.join('\n') + '\n%%\n';
};
function getHeaderLen(text){
  var match=text.match(regexHeaderEnd);
  if(match){
    return match.index+match[0].length;
  } else {
    return 0;
  }
}
var regexHeaderLine = /^([\w-_]+):\s*([^;\r\n]+)(?:;|$)/i;
var regexHeaderComment = /^%.*/;
function getHeader(text){
  return new Header(text);
}
function updateLinks(text){
  var header=getHeader(text);
  if(header){
    text = text.slice(header.original.length);
  } else {
    header = '%%\n';
  }
  if(linkSelector){
    $(linkSelector).attr("href","http://gregorio.gabrielmass.com/cgi/process.pl?gregtext="
      + window.escape(header+text) + "&gregfontselect=17&gregtextfontselect=12&greginitialselect=43&gregspaceselect=7mm&gregredselect=N&greglinethickselect=10&gregpaperselect=letterpaper&gregfaceselect=libertine&gregcropselect=N");
  }
  try {
    if(linkDownloadSelector){
      var utf8=encode_utf8(header+text);
      var url="data:text/plain;charset=utf8;base64,"+btoa(utf8);
      var filename = header.name||"Untitled";
      if(!filename.match(/\.gabc$/))name += ".gabc";
      $(linkDownloadSelector).attr("charset","UTF-8")
        .attr("href",url)
        .attr("data-downloadurl","text/plain:"+filename+":"+url);
    }
  } catch(e) {
  }
  return [header,text];
}
var gabcProcessTime = 0;
var _nextUpdate = new Date().getTime();
function updateChant(text, svg, dontDelay) {
  if(!text)return;
  var gtext=updateLinks(text);
  if(_timeoutGabcUpdate) clearTimeout(_timeoutGabcUpdate);
  if(!dontDelay) {
    var delay = gabcProcessTime+100;
    _timeoutGabcUpdate = setTimeout(function() {updateChant(text,svg,true);},delay);
    return;
  }
  _nextUpdate = new Date().getTime() + 100 + gabcProcessTime;
  var startTime=new Date();
  text=gtext;
  _timeoutGabcUpdate = null;
  var old = $(svg).find(">g")[0];
  if(!old) return;
  var top=[0];
  var newElem = getChant(text,svg,old,top);
  //svg.replaceChild(newElem,old);
  svg.setAttribute('height',newElem.getBBox().height + top[0] + _heightCorrection - _defText.getExtentOfChar("q").height);
  if(svg.parentNode.tagName.match(/span/i)){
    $(svg).css('width',newElem.getBBox().width);
  }
  gabcProcessTime = new Date() - startTime;
  console.info("Update chant time: " + gabcProcessTime);// + "; height: " + _ht + "; correction: "+_heightCorrection);
  if(gabcProcessTime > 3000) gabcProcessTime=3000;
}

function make(tag,innerText) {
  var result=document.createElementNS(svgns,tag);
  if(innerText)result.appendChild(document.createTextNode(innerText));
  return result;
}

var _txtWidths={};

//returns the width of txt.
// txt can be a string, array of TagInfo objects, or a TSpan tag object.
// if txt is not a string, clas and special can be an index and length to get the width of a substring.
function textWidth(txt,clas,special) {
  var i=0;
  var len=undefined;
  if(txt.length===0)return 0;
  if(typeof(clas)=="number" && typeof(special)=="number"){
    i=clas;
    len=special;
    clas=special=undefined;
    if(len===0)return 0;
  }
  var dt=special?_defText:defText;
  if($.isArray(txt)){
    var tw;
    var key;
    if(txt.length==1 && txt[0].tags.length==0) {
      txt = txt[0].text;
      if(clas==undefined || clas=="goudy")clas="";
      if(i==0 && !len && (key=clas+","+txt) && (tw=_txtWidths[key])) return tw;
    } else {
      if(i==0 && !len && (key=JSON.stringify(txt)) && (tw=_txtWidths[key])) return tw;
      $(dt).empty();
      var wid=0;
      var idx=0;
      txt.forEach(function(e){
        var tmp=e.span();
        dt.appendChild(tmp);
        var sIndex=Math.max(i,idx);
        var tlen=Math.min(idx+e.text.length,i+(len||1000000))-sIndex;
        sIndex-=idx;
        idx+=e.text.length;
        try {
          if(tlen>0&&sIndex>=0)wid+=tmp.getSubStringLength(sIndex,tlen);
        } catch(exception){
          console.warn(exception);
        }
      });
      if(key)_txtWidths[key]=wid||dt.getComputedTextLength();
      return wid;
    }
  } else if(typeof(txt)=="object") {
    if(txt.childNodes.length==1) {
      var temp=txt.firstChild;
      var key=$(temp).attr("class").replace(/(?:^|\s)goudy(?:\s|$)|\s+$/g,'') + "," + temp.textContent;
      var tw=_txtWidths[key];
      if(tw)return tw;
    }
    //txt is a span object hopefully
    $(dt).empty().append($(txt).clone());
    var wid=dt.getComputedTextLength();
    if(key)_txtWidths[key]=wid;
    return wid;
  }
  if(clas)dt.setAttribute("class", clas);
  $(dt).text(txt.replace(/ /g,'\u00a0'));
  var wid=dt.getSubStringLength(i, len||txt.length);
  if(key)_txtWidths[key]=wid;
    return wid;
  return wid;
}

function useWidth(use,idx,len) {
  if(use.tagName.match(/^use$/i))use = document.getElementById(use.getAttribute('href').slice(1));
  if(typeof(idx)=="undefined"){
    return getChantWidth(use.textContent);
  } else {
    // Go through the tspan elements until we get to idx.
    var id=0;
    var tmp='';
    var mostRecent='';
    var result=[];
    for(var i = 0; i < use.childNodes.length; ++i){
      var cNode = use.childNodes[i];
      if(id>=idx ){
        if(result.length==0 && getChantWidth(cNode.textContent)<=2){
          tmp = tmp.slice(0,0-mostRecent.length);
        } else mostRecent='';
        result.push(getChantWidth(tmp));
        if(result.length==2)return result;
        tmp=mostRecent;
        idx += len;
      }
      tmp += cNode.textContent;
      mostRecent=cNode.textContent;
      id+=1;
    }
    result.push(getChantWidth(tmp));
    return result;
  }
}

function getChantWidth(text) {
  defChant.textContent=text;
  return defChant.getComputedTextLength();
}

function selectGabc(start,len){
  var e=$("#editor");
  start+=getHeaderLen(e.val());
  if(e.is(':visible')){
    e=e[0];
  } else {
    e = $("#hymngabc")[0];
    var i=0,j;
    for(j in _hymnGabcMap){
      if(j>start)break;
      i=_hymnGabcMap[j] + start - j;
    }
    start = i;
  }
  e.select(start,len);
  e.selectionStart=start;
  e.selectionEnd=start+len;
}

function getTagsFrom(txt){
  var tm,r=[];
  while(tm = regexTag.exec(txt)) {
    r.push(tm[2]);
    var lastIndex = tm.index + tm[0].length;
    if(tm.index == 0)
      txt = txt.slice(tm[0].length);
    else txt = txt.slice(0,tm.index) + txt.slice(lastIndex);
  }
  return r;
}

function tagsForText(txtArray,activeTags){
  if(typeof(txtArray)=="string")txtArray=[txtArray];
  var result=[];
  var txt=txtArray[0];
  if(!activeTags)activeTags=[];
  var tm;
  while(tm = regexTag.exec(txt)) {
    var temp=txt.slice(0,tm.index);
    if(temp.length>0)result.push(new TagInfo(temp,activeTags));
    if(tm[1] != "/") {
      if(activeTags.indexOf(tm[2]) < 0) {
        activeTags.push(tm[2]);
      }
    }
    else {
      var idx = activeTags.indexOf(tm[2]);
      if(idx>=0)activeTags.splice(idx,1);
    }
    var lastIndex = tm.index + tm[0].length;
    txt = txt.slice(lastIndex);
  }
  txtArray[0]=txt;
  return result;
}

function TagInfo(txt,tags) {
  this.tags = $.merge([],tags||[]);
  this.text = txt.replace(/ /g,'\u00a0');
};
TagInfo.prototype.span = function(){
  var result=make('tspan',this.text);
  result.setAttribute("class","goudy " + this.tags.join(" "));
  return result;
};

//This function will update the height and y offset of the staff once there is no more chant to be put on it, based on htone and ltone
var finishStaff=function(curStaff){
  var result=curStaff.parentNode;
  var line = parseInt(curStaff.id.match(/\d+$/)[0]);
  var staffInfo=curStaff.info;
  var ltone=staffInfo.ltone;
  var htone=staffInfo.htone;
  ltone = (3 - ltone);
  ltone = (ltone <= 0)? 0 : ((ltone * spaceheight)/2);
  htone = (htone - 9);
  htone = (htone <= 0)? 0 : ((htone * spaceheight)/2);
  var y = Math.ceil(0.1*staffheight + fontsize + ltone + htone);
  staffInfo.vOffset = staffInfo.y;
  if(staffInfo.txtInitial)staffInfo.txtInitial.setAttribute('y',y + staffInfo.y);
  if(staffInfo.txtAnnotation)staffInfo.txtAnnotation.setAttribute('y',staffInfo.y+Math.ceil(htone)-25);
  staffInfo.eText.setAttribute("y",y);
  staffInfo.eTrans.setAttribute('y',y+fontsize);
  
  staffInfo.eText.setAttribute("transform", "translate("+staffInfo.x+","+staffInfo.vOffset+")");
  staffInfo.eTrans.setAttribute("transform", "translate("+staffInfo.x+","+staffInfo.vOffset+")");
  if(result){
    result.appendChild(staffInfo.eText);
    result.appendChild(staffInfo.eTrans);
  }
  if(staffInfo.eTrans.childNodes.length>0){
    y += fontsize;
  }
  if(htone>0) {
    staffInfo.vOffset += htone;
    if(line==0) {
      var heightCorrection = 0;
      $(curStaff).children("[id^=neume]").each(function(){
        heightCorrection = Math.min(heightCorrection,this.neume.info.mindy);
      });
      _heightCorrection = heightCorrection + htone;
    }
    curStaff.setAttribute("transform","translate("+staffInfo.x+", " + (staffInfo.y + htone) + ")");
  }
  return y;
}

//This function will trim the width of the staff to lign up with the last element on it.
var trimStaff=function(curStaff,width){
  var x;
  var staffUse=$(curStaff).find("use[href=#staff]");
  if(width){
    x = width;
  } else {
    var lastUse=$(curStaff).find("[id^=neume]:last");
    var lastText=$(curStaff.parentNode).find("[id^=neumetext]:last");
    href=lastUse.attr("href");
    if(href) {
      if(!/\:$/.exec(href))return;
    } else if(!/\|$/.exec(lastUse.text()))return;
    var neumeId = /\d+$/.exec(lastUse.prop('id'))[0];
    var textId = /\d+$/.exec(lastText.prop('id'))[0];
    if(textId > neumeId)return;
    x=parseFloat(lastUse.attr("x"));
    var transform=lastUse.attr("transform");
    var m = regexTranslate.exec(transform);
    if(m && m[1])x += parseFloat(m[1]);
    x += lastUse[0].neume.wChant;
  }
  var scale="scale("+x+",1)";
  staffUse.attr("transform",function(index,transform){
    return transform.replace(/scale\([^\)]*\)/,scale);
  });
}
var justifyLine=function(curStaff){
  var endSpace=2*spaceBetweenNeumes;
  var x2=svgWidth - curStaff.info.x - endSpace;
  var lastUse,lastTspan;
  var words=curStaff.words;
  var i=words.length-1;
  while(i>=0 && !(lastUse && lastTspan)){
    var cWord=words[i--];
    var j=cWord.length-1;
    while(j>=0 && !(lastUse && lastTspan)){
      var tag=cWord[j--];
      if(!lastUse && tag.tagName.match(/^use|text$/i) && tag.neume){
        lastUse = tag;
        continue;
      } else if(!lastTspan && tag.tagName.match(/^tspan$/i)){
        lastTspan=tag;
        continue;
      }
    }
  }
  var currentX=0;
  if(lastUse){
    currentX=parseFloat($(lastUse).attr("x"));
    var transform=$(lastUse).attr("transform");
    var m = regexTranslate.exec(transform);
    if(m && m[1])currentX += parseFloat(m[1]);
    currentX += lastUse.neume.wChant;
  }
  if(lastTspan){
    var tmpX=parseFloat($(lastTspan).attr("x"));
    tmpX += textWidth(lastTspan) - endSpace;
    currentX=Math.max(currentX,tmpX);
//      console.info(tmpX==currentX?lastTspan:lastUse);
  }
  if(currentX>0){
    var extraSpace=x2-currentX;
    var len=words.length-1;
    var delta=extraSpace/len;
    if(extraSpace>0) {
      while(len>0){
        words[len].forEach(function(o){
          if(o.neume)o.neume.justifyOffset=Math.round(extraSpace);
          if($(o).attr("transform")) {
            $(o).attr("transform",function(e,cv){
              return "translate("+Math.round(extraSpace)+") " + (cv||"");
            });
          } else {
            $(o).attr("x",function(e,cv){
              return (cv?parseFloat(cv):0)+Math.round(extraSpace);
            });
          }
        });
        extraSpace -= delta;
        --len;
      }
    }
  }
}
var addCustos=function(staff,cneume,justify,custosXoffset) {
  var tone = cneume.info.ftone;
  var neumeText = neume(indices.custos,tone);
  var t = staff.custos;
  if(t){
    t.textContent = neumeText;
    if(staff.custosLedger)try{staff.removeChild(staff.custosLedger);delete staff.custosLedger;}catch(e){}
  } else {
    t = make('text',neumeText);
    t.setAttribute('class',defChant.getAttribute('class'));
    t.setAttribute('y',0);
  }
  if(justify || typeof(justify)=="undefined"){
    justifyLine(staff);
    justify=true;
  }
  var x2=justify? svgWidth - staff.info.x - (staffheight/15) : custosXoffset;
  t.setAttribute('x',x2);
  staff.appendChild(t);
  staff.custos=cneume.custos=t;
  var ledgerAbove=tone>10;
  var ledgerBelow=tone<2;
  if(ledgerAbove||ledgerBelow)staff.custosLedger=cneume.custosLedger=insertLedger(ledgerAbove,staff,t,true);
}

function relayoutChant(svg){
  var width = svgWidth = $(svg.parentNode).width();
  var $svg = $(svg);
  var $svgg = $svg.children('g');
  var $tmp = $svg.find('#commentary');
  var x = 0,
      xChantMin = 0;
  var staffI = 0;
  var neumeI = 0;
  var $staff = $svg.find('#system'+staffI);
  var curStaff = $staff[0];
  var $neume;
  var $text;
  var $trans;
  var $all;
  var staffInfo = $staff[0].info;
  var staves = [];
  var cneume,pneume;
  var $lastText;
  var needCustos;
  var defs = $(svg).find("defs")[0];
  var extraHeight = staffInfo.y;
  var offset;
  var curWord = [];
  var curSyl;
  var currentUse;
  var words = [];
  var tagsBetweenText = [];
  staffInfo.ltone = 3;
  staffInfo.htone = 10;
  if($tmp.length)$tmp.attr('x',width-$tmp[0].getComputedTextLength());
  while(true){
    pneume = cneume;
    $lastText = $text;
    $neume = $svgg.find('#neume'+neumeI);
    $text = $svgg.find('#neumetext'+neumeI);
    $trans = $svgg.find('#neumetrans'+neumeI);
    cneume = $neume[0]? $neume[0].neume : ($text[0]? $text[0].neume : {match:{}});
    delete cneume.custos;
    var $mask = $svgg.find('#neumemask'+neumeI);
    $all = $.merge($.merge($.merge($.merge($(),$neume),$text),$trans),$mask);
    curSyl = $all.toArray();
    currentUse = $neume.toArray().concat($mask.toArray());
    var hasLedgers = false;
    for(i in cneume.ledgers){
      hasLedgers = true;
      break;
    }
    offset = cneume.offset || 0;
    if($all.length == 0) {
      break;
    }
    
    xChantMin += Math.min(0,offset);
    if(cneume.wChant > 0 && (x < xChantMin || !$text.length)) {
      x = xChantMin;
    } else if(pneume.lastOnLineHyphen){
      $(pneume.lastOnLineHyphen).remove();
      delete pneume.lastOnLineHyphen;
    }
    var nextXTextMin = $text.length?
        x + cneume.wText + Math.max(Math.floor(offset),0)
      : nextXTextMin||0;
    if(cneume.match[7]&&cneume.match.index>0)nextXTextMin+=5;
    var nextXChantMin = x + cneume.wChant + spaceBetweenNeumes - Math.min(offset,0);
    var lastX;
    
    if(Math.max(nextXTextMin, nextXChantMin) >= width - staffInfo.x - spaceBetweenNeumes){
      var clef = lastClefBeforeNeume(neumeI);
      var wClef = clef? clef.wChant : 0;
      
      if($lastText.length && !pneume.lastOnLineHyphen && !$lastText.text().slice(-1).match(/-|\s/)){
        pneume.lastOnLineHyphen = new TagInfo('-').span();
        $lastText.append(pneume.lastOnLineHyphen);
      }
      
      nextXTextMin -= x;
      nextXChantMin -= x;
      x=0;
      xChantMin=wClef+spaceBetweenNeumes+offset;
      if(cneume.wChant > 0 && x < xChantMin) {
        x = xChantMin;
      }
      nextXTextMin+=x;
      nextXChantMin+=x;

      // set custos and move to next system.
      ++staffI;
      if(curWord.length){
        words.push(curWord);
        curWord = [];
      }
      curStaff.words = words;
      words = [];
      tagsBetweenText = [];
      needCustos = curStaff;
      trimStaff(curStaff,width - staffInfo.x);
      var y = finishStaff(curStaff);
      $staff = $svg.find('#system'+staffI);
      if($staff.length){
        curStaff = $staff[0];
        curStaff.info.htone = 10;
        curStaff.info.ltone = 3;
      } else {
        var lineOffset = staffoffset + y + verticalSpace + staffInfo.y;
        curStaff = addStaff(curStaff.parentNode,0,lineOffset,staffI, null, defs);
        curStaff.info.vOffset = curStaff.info.y;
        $staff = $(curStaff);
      }
      staffInfo = curStaff.info;
    }
    curWord = curWord.concat($all.toArray());
    
    if($neume.length){
      staffInfo.ltone = Math.min(staffInfo.ltone, cneume.info.ltone);
      staffInfo.htone = Math.max(staffInfo.htone, cneume.info.htone);
      $staff.append($neume);
      $neume.attr('x',x);
      if(cneume.transform)$neume.attr('transform',cneume.transform);
      if(needCustos){
        addCustos(needCustos,cneume);
        needCustos = null;
      }
    }

    if($text.length){
      $text.attr('x',x);
      $trans.attr('x',x);
      $(staffInfo.eText).append($text);
      $(staffInfo.eTrans).append($trans);
      //x += $text.width();
      
      var count = tagsBetweenText.length - 1;
      if(count<=0) {
        tagsBetweenText[0]=currentUse;
      } else {
        var first = tagsBetweenText[0][0];
        var x1=parseFloat(first.getAttribute('x'))+first.neume.wChant;
        var transform = first.getAttribute('transform');
        if(transform) {
          var m = regexTranslate.exec(transform);
          x1 += parseFloat(m[1]);
        }
        var x2=x;
        if(offset<0)x2-=offset;
        var chantWidth=0;
        for(var i=1;i<=count;++i) {
          chantWidth+=tagsBetweenText[i][0].neume.wChant;
        }
        var spaceWidth=x2-x1-chantWidth;
        spaceWidth /= (count+1);
        var xx = x1 + spaceWidth;
        for(var i=1;i<=count;++i) {
          $(tagsBetweenText[i]).attr('x',xx);
          xx += spaceWidth + tagsBetweenText[i][0].neume.wChant;
        }
        tagsBetweenText = [currentUse];
      }
    } else if(tagsBetweenText.length>0 && !cneume.info.ftone) {
      tagsBetweenText.push(currentUse);
      if((curWord.length==1 && curWord[0]==$neume[0]) || (curWord.length==2 && curWord[0]==$neume[0] && curWord[1]==$mask[0])){
        words.push(curWord);
        curWord=[];
      }
    }
    
    if(hasLedgers){
      processLedger(cneume,$neume[0],curWord);
    }
    if(cneume.match[7]){
      words.push(curWord);
      curWord=[];
    }
    
    x = nextXTextMin;
    xChantMin = nextXChantMin;
    
    ++neumeI;
  }
  if(curStaff.custos){
    $(curStaff.custos).remove();
    curStaff.custos = undefined;
  }
  if(curStaff.custosLedger){
    $(curStaff.custosLedger).remove();
    curStaff.custosLedger = undefined;
  }
  trimStaff(curStaff,width - staffInfo.x);
  finishStaff(curStaff);
  trimStaff(curStaff);
  while($staff.length){
    ++staffI;
    $staff = $svg.find('#system'+staffI);
    $staff.remove();
  }
  svg.setAttribute('height',$(svg).children("g")[0].getBBox().height + extraHeight + _heightCorrection - _defText.getExtentOfChar("q").height);
}

function getChant(text,svg,result,top) {
  if(!top)top=[];
  var header=text[0];
  text = text[1];
  var makeLinks=svg?(svg.parentNode&&svg.parentNode.id=="chant-preview"):false;
  var defs = $(svg).find("defs")[0];
  if(!defs)defs=_defs;
  var match;
  var neumeId = 0;
  var punctumId = 0;
  var remaking=result?true:false;
  if(result){
    $(result).empty();
  } else {
    result=make('g');
    result.setAttribute("transform", "translate(0," + staffoffset + ")");
    result.setAttribute("class", "caeciliae");
  }
  if(makeLinks){
    _clefs=[];
    _accidentals=[];
    _tones=[];
  }
  var width = $(svg.parentNode).width();
  var userNotes = header["user-notes"];
  var commentary= header["commentary"];
  var curHeight = 0;
  if(typeof(userNotes)=="string" && userNotes.length>0){
    var txt = make('text',userNotes);
    txt.setAttribute('id','userNotes');
    txt.setAttribute('class','goudy i');
    txt.setAttribute('y',16-staffoffset);
    result.appendChild(txt);
    curHeight = 20;
  }
  if(typeof(commentary)=="string" && commentary.length>0){
    var txt = make('text',commentary);
    txt.setAttribute('id','commentary');
    txt.setAttribute('class','goudy i');
    txt.setAttribute('y',16-staffoffset);
    result.appendChild(txt);
    txt.setAttribute('x',width-txt.getComputedTextLength());
    curHeight = 20;
  };
  top[0]=curHeight;
  regexOuter.lastIndex = 0;
  var xoffset = 0;
  var xoffsetChantMin = 0;
  var use;
  var use2;
  var span = null;
  var spanNeume;
  var needCustosNextTime;
  var custosXoffset;
  var startX=0;
  var firstText=true;
  var lastSpan;
  var line = 0;
  var words=[];
  var currentWord=[];
  var activeTags=[];
  var clef,wClef,clefNeume;
  var needCustos = false;
  var previousMatch;
  var activeClass = "goudy";
  var usesBetweenText = [];
  var curStaff = addStaff(result,0,curHeight,line, null, defs);
  var staffInfo = curStaff.info;
  try {
    var padding = $(svg.parentNode).css("padding-left");
    if(padding) width -= parseFloat(padding);
  } catch(e) { }
  svgWidth = width;
  
  while(match = regexOuter.exec(text)) {
    //TODO: first collect all data from match into the cneume object
    // so that we can have a function to process just from a cneume object
    // Put the actual text elements in the cneume object as well.
    var cneume={index:match.index+match[1].length,match:match,ledgers:{},wChant:0,wText:0};
    var tags=[];
    if(match[5]) {
      cneume.gabc=match[5];
      // if there is an open paren, assume that the correct close paren has not yet been marked for this GABC.
      if(cneume.gabc.indexOf('(')>=0){
        var iop=match[0].indexOf('(');
        var mspace=cneume.gabc.match(/ /);
        var gabclen=0;
        if(mspace)gabclen=mspace.index;
        cneume.gabc=cneume.gabc.slice(0,gabclen);
        if(gabclen)++gabclen;
        regexOuter.lastIndex -= match[0].length - iop - 1 - gabclen;
      }
      cneume.info = getChantFragment(cneume.gabc,defs);
      clef=cneume.info.clef||clef;
      if(makeLinks){
        if(cneume.info.clef){
          _clefs[neumeId]=clefNeume=cneume;
          clefNeume.clefs = [];
          _accidentals[punctumId] = clef.length==3? -1 : null;
        }
        _tones=_tones.concat(cneume.info.tones);
      }
      defChant.textContent = cneume.info.def.textContent;
      cneume.wChant = defChant.getComputedTextLength();
      if(cneume.gabc==clef)wClef=cneume.wChant;
    } else cneume.info={};
    if(currentWord.length>0 && previousMatch && (previousMatch[7]||previousMatch[8])) {
      words.push(currentWord);
      currentWord=[];
    }
    var space = match[7]||match[8];
    var txt = match[3] || space;
    var translation = regexSqBrackets.exec(txt);
    if(translation){
      txt = txt.slice(0,translation.index) + txt.slice(translation.index + translation[0].length);
      translation = translation[1];
    }
    if(match[3] && space) {
      txt += space;
    }
    cneume.txt =txt;
    cneume.translation = translation;
    var offset = 0;
    if(txt) {
      if(firstText && match[3]) {
        firstText=false;
        if(header["initial-style"]!="0") {
          var initial = txt[0];
          txt = txt.slice(1);
          if(txt.length==0)txt='-';
          var txtInitial = staffInfo.txtInitial = make('text',initial);
          txtInitial.setAttribute('transform','translate(0,'+staffInfo.vOffset+')');
          txtInitial.setAttribute('class','greinitial');
          result.appendChild(txtInitial);
          var lenInitial=txtInitial.getComputedTextLength();
          var annotation = header["annotation"];
          if(typeof(annotation)=="string" && annotation.length>0){
            var m=/([a-g]\d?\*?\s*)$/.exec(annotation);
            var suffix='</sc>';
            if(m){
              annotation=annotation.slice(0,m.index);
              suffix+=m[0];
            }
            annotation = annotation.replace(/\b[A-Z\d]+\b/,function(s){return s.toLowerCase();}) + suffix;
            var txtAnnotation = staffInfo.txtAnnotation = make('text');
            var tagsAnnotation = tagsForText('<sc>'+annotation+'</sc>');
            for(i in tagsAnnotation){
              txtAnnotation.appendChild(tagsAnnotation[i].span());
            }
            txtAnnotation.setAttribute('class','greannotation');
            txtAnnotation.setAttribute('y',staffInfo.vOffset-25);
            result.appendChild(txtAnnotation);
            var lenAnnotation=txtAnnotation.getComputedTextLength();
            var centerX = Math.max(lenAnnotation,lenInitial) / 2;
            txtAnnotation.setAttribute('x',centerX-(lenAnnotation/2));
            txtInitial.setAttribute('x',centerX-(lenInitial/2));
            startX=Math.max(lenAnnotation,lenInitial)+5;
          } else {
            startX=lenInitial + 5;
          }
          staffInfo.eText.setAttribute("transform", "translate("+startX+","+staffInfo.vOffset+")");
          staffInfo.eTrans.setAttribute("transform", "translate("+startX+","+staffInfo.vOffset+")");
          staffInfo.x=startX;
          var useStaff = $(curStaff).find("use[href=#staff]")[0];
          useStaff.setAttribute("transform", "scale(" + (width-startX) + ",1)");
        }
      }
      txt = txt.replace(/^\s+/,'').replace(/\r\n/g,' ').replace(/\n/g,' ').replace(/<v>\\greheightstar<\/v>/g,'*').replaceSpTags();
      
      var tmpArray=[txt];
      tags = tagsForText(tmpArray,activeTags);
      txt=tmpArray[0];
      var pretext="";
      if(tags.length>0)tags.forEach(function(e){pretext+=e.text;});
      if(txt.length>0)tags.push(new TagInfo(txt.replace(/[{}]/g,''),activeTags));
      txt = pretext+txt;
      cneume.wText = textWidth(tags);
      if(txt) {
        var obi=txt.indexOf('{'), //opening brace index
            cbi=txt.indexOf('}'), //closing brace index
            vowel;
        if(obi>=0 && cbi>obi){
          var tmp=txt.slice(obi+1,cbi);
          txt=txt.slice(0,obi) + tmp + txt.slice(cbi+1);
          --cbi;
          vowel = {index:obi, "0":tmp, "1":tmp};
        } else if(/^english$/i.exec(header["centering-scheme"])) {
          vowel = {index: 0, "0":txt.replace(/[,.:;\s]*$/,''), "1":txt.replace(/[,.:;\s]*$/,'')};
        } else {
          vowel = regexVowel.exec(txt);
        }
        if(!vowel) {
          vowel = {index: 0, "0":txt.trimRight(), "1":txt.trimRight()};
        }
        try {
          var index = vowel.index + vowel[0].length - vowel[1].length;
          offset -= textWidth(tags,0,index);
          offset -= textWidth(tags,index,vowel[1].length) / 2;
        } catch(e) {
        }
        offset += notewidth / 2;//defChant.getComputedTextLength() / 2;
      }
    }
    // if there aren't enough characters before the vowel so that the neume begins far enough to the right of the previous neume,
    // add extra space in the text:
    var preWidth=cneume.info.startsWithAccidental?getChantWidth("b-"):0;
    offset += preWidth;
    cneume.offset = offset;
    xoffsetChantMin += Math.min(0,offset);
    if(cneume.wChant > 0 && (xoffset < xoffsetChantMin || !txt)) {
      xoffset = xoffsetChantMin;
    }
    var nextXoffsetTextMin = txt?
        xoffset + cneume.wText + Math.max(Math.floor(offset),0)
      : nextXoffsetTextMin||0;
    if(match[7]&&match.index>0)nextXoffsetTextMin+=5;
    var nextXoffsetChantMin = xoffset + cneume.wChant + spaceBetweenNeumes - Math.min(offset,0);
   //Experimental change (2010.03.14)  Old line:
    var nextXoffset = cneume.wText==0?Math.max(nextXoffset||0,xoffset):Math.max(nextXoffsetTextMin, nextXoffsetChantMin);
    //var nextXoffset = wText==0?Math.max(nextXoffset||0,xoffset):nextXoffsetTextMin;
    var lastX;
    if(needCustosNextTime || nextXoffset >= width - startX - spaceBetweenNeumes - cneume.wChant) {
      needCustos = curStaff;
      needCustos.justify = needCustosNextTime? needCustosNextTime.justify : true;
      if(!needCustos.justify){
        custosXoffset = xoffset;
      }
      needCustosNextTime=undefined;
      usesBetweenText=[];
      if(span&&txt&&$(span).text().slice(-1)!='-'){
        span.appendChild(cneume.lastOnLineHyphen = new TagInfo('-').span());
      }
      if(currentWord.length>0){
        words.push(currentWord);
        currentWord=[];
      }
      curStaff.words=words;
      words=[];
      var y = finishStaff(curStaff);
      var lineOffset = staffoffset + y + verticalSpace + staffInfo.y;
      curStaff = addStaff(result,0,lineOffset,++line, null, defs);
      curStaff.info.vOffset = curStaff.info.y;
      staffInfo = curStaff.info;
      staffInfo.eText.setAttribute('transform', "translate(0," + staffInfo.vOffset + ")");
      staffInfo.eTrans.setAttribute('transform', "translate(0," + staffInfo.vOffset + ")");
      
      nextXoffset -= xoffset;
      nextXoffsetTextMin -= xoffset;
      nextXoffsetChantMin -= xoffset;
      if(clef){
        var use = make('use');
        use.setAttribute('class','clef');
        use.setAttributeNS(xlinkns, 'href', '#' + clef);
        use.setAttribute('x', 0);
        use.setAttribute('y', 0);
        curStaff.appendChild(use);
        if(clefNeume && clefNeume.clefs){
          clefNeume.clefs.push(use);
        }
        xoffset=0;
        xoffsetChantMin=wClef+spaceBetweenNeumes+offset;
//        nextStaffX=wClef;
        if(cneume.wChant > 0 && xoffset < xoffsetChantMin) {
          xoffset = xoffsetChantMin;
        }
        nextXoffset+=xoffset;
        nextXoffsetTextMin+=xoffset;
        nextXoffsetChantMin+=xoffset;
      } else {
        xoffset=0;
      }
    }
    needCustosNextTime = cneume.gabc && cneume.gabc.match(/z/i);
    if(needCustosNextTime){
      needCustosNextTime.justify = cneume.gabc.match(/z/);
    }
      
    if(cneume.gabc) {
      if(needCustos) {
        addCustos(needCustos,cneume,needCustos.justify,custosXoffset);
        needCustos = false;
        startX=0;
      }
      if(cneume.info.mask) {
        use2 = make('use');
        use2.setAttributeNS(xlinkns, 'href', '#' + cneume.info.mask);
        use2.setAttribute('id','neumemask'+neumeId);
        use2.setAttribute('class',"caeciliae");
        use2.setAttribute('x', xoffset);
        use2.setAttribute('y', 0);
        
        currentWord.push(use2);
        masks[line].firstChild.appendChild(use2);
      } else use2 = null;
      staffInfo.ltone = Math.min(staffInfo.ltone, cneume.info.ltone);
      staffInfo.htone = Math.max(staffInfo.htone, cneume.info.htone);
      if(makeLinks) {
        use = $(cneume.info.def).clone()[0];
      } else {
        use = make('use');
        use.setAttributeNS(xlinkns, 'href', '#' + cneume.gabc);
      }
      use.setAttribute('id','neume'+neumeId);
      use.setAttribute('x', xoffset);
      use.setAttribute('y', 0);
      use.neume = cneume;
      if(makeLinks) {
        punctumId = setUpPunctaIn(use,punctumId);
        if(space){
          var tmp = clef && clef.length==3? -1 : null;
          if(_accidentals[_accidentals.length-1] != tmp){
            _accidentals[punctumId] = tmp;
          }
        }
        //use.setAttributeNS(xlinkns, 'href', 'javascript:selectGabc('+(match.index+match[1].length)+','+cneume.gabc.length+')');
      }
      curStaff.appendChild(use);
      currentWord.push(use);
      
      currentUse=[use];
      if(use2)currentUse.push(use2);
      if(txt) {
        var count = usesBetweenText.length - 1;
        if(count<=0) {
          usesBetweenText[0]=currentUse;
        } else {
          var first = usesBetweenText[0][0];
          var x1=parseFloat(first.getAttribute('x'))+first.neume.wChant;
          var transform = first.getAttribute('transform');
          if(transform) {
            var m = regexTranslate.exec(transform);
            x1 += parseFloat(m[1]);
          }
          var x2=xoffset;
          if(offset<0)x2-=offset;
          var chantWidth=0;
          for(var i=1;i<=count;++i) {
            chantWidth+=usesBetweenText[i][0].neume.wChant;
          }
          var spaceWidth=x2-x1-chantWidth;
          spaceWidth /= (count+1);
          var x = x1 + spaceWidth;
          for(var i=1;i<=count;++i) {
            $(usesBetweenText[i]).attr('x',x);
            x += spaceWidth + usesBetweenText[i][0].neume.wChant;
          }
          usesBetweenText = [currentUse];
        }
      } else if(usesBetweenText.length>0 && !cneume.info.ftone) {
        usesBetweenText.push(currentUse);
        if((currentWord.length==1 && currentWord[0]==use) || (currentWord.length==2 && currentWord[0]==use2 && currentWord[1]==use)){
          words.push(currentWord);
          currentWord=[];
        }
      }
    } else use = use2 = null;
    if(txt) {
      lastSpan = span;
      pneume = spanNeume;
      span = make('tspan');
      spanNeume = cneume;
      var spanXoffset = xoffset;
      // Don't worry about placing the vowel correctly if there is no neume.
      if(use) {
        cneume.transform = "translate("+(-offset)+")";
        if(offset > 0) {
          //check if we can push the syllable to the left rather than force a hyphen.
          if(spanXoffset-offset >= xoffsetChantMin) {
            cneume.wText -= offset;
            use.setAttribute('transform', cneume.transform);
            if(use2)
              use2.setAttribute('transform', cneume.transform);
          } else {
            spanXoffset += offset;
            cneume.wText += offset;
          }
        } else {
          use.setAttribute('transform', cneume.transform);
          if(use2)
            use2.setAttribute('transform', cneume.transform);
        }
      }
      if(lastSpan) {
        var lastXoffset = parseFloat(lastSpan.getAttribute('x'),10);
        var lastSpanX2 = lastXoffset + textWidth(lastSpan);
        if(lastSpanX2 < spanXoffset) {
          if($(lastSpan).text().slice(-1)!='-'){
            lastSpan.appendChild(new TagInfo('-').span());
            pneume.wText = textWidth(lastSpan);
            lastSpanX2 = lastXoffset + pneume.wText;
            if(lastSpanX2 > spanXoffset) {
              var additionalOffset = lastSpanX2 - spanXoffset;
              spanXoffset = lastSpanX2;
              if(use) {
                use.setAttribute('x', xoffset + additionalOffset);
                if(use2) {
                  use2.setAttribute('x', xoffset + additionalOffset);
                }
              }
              nextXoffsetTextMin += additionalOffset;
              nextXoffsetChantMin += additionalOffset;
            }
          }
        }
      }
      span.setAttribute('id', 'neumetext'+neumeId);
      span.setAttribute('x', spanXoffset);
      span.setAttribute("class", activeClass);
      span.neume = cneume;
      xoffset = nextXoffsetTextMin;
      xoffsetChantMin = nextXoffsetChantMin;
      tags.forEach(function(e){
        span.appendChild(e.span());
      });
      if(translation){
        var cspan = new TagInfo(translation,['i','trans']).span();
        cspan.setAttribute('id','neumetrans'+neumeId);
        cspan.setAttribute('x',spanXoffset);
        currentWord.push(cspan);
        staffInfo.eTrans.appendChild(cspan);
      }
      currentWord.push(span);
      staffInfo.eText.appendChild(span);
    } else {
      if(use) {
        xoffsetChantMin = xoffset+getChantWidth(cneume.info.def.textContent) + spaceBetweenNeumes;
        xoffset=nextXoffsetTextMin;
      } else {
        xoffsetChantMin = xoffset;
      }
    }
    neumeId++;
    previousMatch = match;
    if(space)span=null;
    processLedger(cneume,use,currentWord);
  }
  finishStaff(curStaff);
  if(gabcSettings.trimStaff) trimStaff(curStaff);
  return result;
}
var boolArray=[true,false];
function processLedger(cneume,use,currentWord){
  for(i in cneume.ledgers){
    $(cneume.ledgers[i]).remove();
  }
  cneume.ledgers={};
  if(cneume.info.ledgerA && (cneume.info.ledgerA.length || cneume.info.ledgerB.length) && use) {
    var curStaff = use.parentNode;
    var led=[];
    processLedgerHelper(cneume.info.ledgerA,led,true);
    processLedgerHelper(cneume.info.ledgerB,led,false);
    
    led.forEach(function(a){
      var tmp = insertLedger(a,curStaff,use);
      cneume.ledgers[a.above]=tmp;
      if(currentWord)currentWord.push(tmp);
    });
  }
}
function processLedgerHelper(old,led,aboveStaff){
  var lastI=null,
      curLen=0;
  for(a in old){
    var i=old[a];
    if(i-1==lastI){
      ++curLen;
    } else if(i-2==lastI){
      curLen += 2;
    } else {
      if(curLen>0)led.push({i:lastI,len:curLen,above:aboveStaff});
      lastI=i;
      curLen=1;
    }
  }
  if(curLen>0)led.push({i:lastI,len:curLen,above:aboveStaff});
}
function insertLedger(above,curStaff,use,isCustos){
  var index=0,len=1;
  if(typeof(above)=='object'){
    index=above.i;
    len=above.len;
    above=above.above;
  }
  var temp = make('use');
  temp.setAttributeNS(xlinkns, 'href', above?'#ledgera':'#ledgerb');
  temp.setAttribute('y',use.getAttribute('y'));
  var transform = use.getAttribute('transform');
  var tx = parseFloat(use.getAttribute('x'));
  if(transform) {
    while(m = regexTranslateG.exec(transform)){
      tx += parseFloat(m[1]);
    }
  }
  var chantWidth=useWidth(use,index,len);
  tx += chantWidth[0];
  chantWidth=chantWidth[1];
  if(isCustos){
    tx -= 0.25*notewidth;
    temp.setAttribute('transform',"translate("+tx+") scale("+(chantWidth+0.25*notewidth)+",1)");
  } else {
    tx -= 0.75*notewidth;
    temp.setAttribute('transform',"translate("+tx+") scale("+(chantWidth+1.5*notewidth)+",1)");
  }
  if(use){
    curStaff.insertBefore(temp,use);
  } else {
    curStaff.appendChild(temp);
  }
  return temp;
}
var ToneInfo = function(obj){
  for(i in obj){
    this[i] = obj[i];
  }
};
(function(){
  var tones,result,minDy,htone,ltone;
  getChantFragment=function(gabc,defs) {
    if(abcs[gabc] != undefined) {
      return abcs[gabc];
    }
    var mask = undefined;
    if(gabc.indexOf('r') > -1) {
      mask = gabc.replace(/r/g,'!');
      getChantFragment(mask,defs);
    }
    result = make('text');
    ltone = 3;
    htone = 0;
    result.setAttribute('id', gabc);
    var ftone = null,
        code,
        curChar,
        nextChar,
        charsLeft = gabc.length,
        index = 0,
        prevIndex = 0,
        match,
        clef,
        clefTone,
        startsWithAccidental = false,
        countTones=0;
        ledgerA=[],
        ledgerB=[];

    minDy = 0;
    regexInner.lastMatch = 0;
    var globalTones=[];
    while(match = regexInner.exec(gabc)) {
      tones = [];
      var previousToneId = -1;
      chant=match[0];
      regexTones.exec('');
      var cmatch;
      while(cmatch = regexTones.exec(chant)) {
        ++countTones;
        var imatch=[];
        if(cmatch[regexTonesSpliceIndex]) {
          var test = cmatch[regexTonesSpliceIndex];
          var newmatch;
          while(newmatch=regexToneModifiers.exec(test)) {
            if(newmatch[3]) {
              var eLoc=newmatch[3].match(/0/)?-1:0;
              var count=newmatch[3].length + eLoc - 1;
              newmatch[3]=newmatch[3].slice(eLoc-1);
              var i=1;
              var len=tones.length;
              while(i<=count && i<=len) {
                var lastTone = tones[len-i];
                if(!lastTone.match[rtg.episema]) {
                  lastTone.match[rtg.episema]=newmatch[3];
                  lastTone.episemaLoc=eLoc;
                }
                ++i;
              }
            }
            if(newmatch[2]){
              var count = newmatch[2].length;
              if(count > 1){
                var lastTone = tones[tones.length-1];
                if(!lastTone.match[rtg.dot]){
                  lastTone.match[rtg.dot]='.';
                }
              }
            }
            $.extend(imatch,newmatch);
          }
        } else {
          imatch = new Array(regexToneModifiersCount);
        }
        var tmpIndex=cmatch.index;
        cmatch = cmatch.splice(0,regexTonesSpliceIndex).concat(imatch.splice(1,imatch.length-1)).concat(cmatch.splice(1,cmatch.length-1));
        cmatch.index=tmpIndex+match.index;
        if(cmatch[rtg.bracketed]) continue;
        if(cmatch[rtg.clef]){
          clef=cmatch[rtg.clef];
          clefTone = (clef[0] == "f")? 5 : 1;
          clefTone += (parseInt(clef.slice(-1)) * 2);
        }
        tone = cmatch[0];
        if(cmatch[rtg.whitespace]) {
          // merely some kind of text substitution.
          for(var i=0; i < transforms[0].length; ++i) {
            tone = tone.replace(transforms[2][i],transforms[1][i]);
          }
          var tmp=make('tspan',tone);
          tmp.setAttribute('offset',cmatch.index);
          tmp.setAttribute('len',cmatch[0].length);
          result.appendChild(tmp);
          htone = Math.max(htone,(/[`,]/.exec(cmatch[rtg.whitespace])&&9.5)||0);
          globalTones.push(tmp=new ToneInfo({match:[]}));
        } else {
          var toneId = parseInt(cmatch[rtg.tone]||cmatch[rtg.clef].slice(0,1),23)-10;
          if(cmatch[rtg.tone] && cmatch[rtg.tone].length == 1) {
            ltone = Math.min(ltone,toneId);
            htone = Math.max(htone,toneId);
            if(ftone==null && !cmatch[rtg.accidental])ftone = toneId;
          } else {
            htone = Math.max(htone,(cmatch[rtg.clef]&&(parseInt(cmatch[rtg.clef].slice(-1))*2+2))||0);
          }
          if(toneId>10){
            ledgerA.push(countTones-1);
          } else if(toneId<2){
            ledgerB.push(countTones-1);
          }
          var tmp=new ToneInfo({
            match: cmatch,
            index: toneId,
            relativeTone: previousToneId < 0? 0 : toneId - previousToneId,
            modifiers: cmatch[rtg.noteType],
            clef: cmatch[rtg.clef],
            episemaLoc:(cmatch[rtg.episema] && cmatch[rtg.episema].match(/0/))?-1:0,
            diamond: cmatch[rtg.toneUpper]? true: false,
            markings: cmatch[rtg.ictus] || cmatch[rtg.dot] || cmatch[rtg.episema],
            liq: cmatch[rtg.diminutiveLiquescentia],
            accidental: cmatch[rtg.accidental]
          });
          tones.push(tmp);
          globalTones.push(tmp);
          previousToneId = toneId;
        }
      }
      for(var i=0; i < tones.length; ++i) {
        i=getNeumeText(i);
      }
    }
    defs.appendChild(result);
    return abcs[gabc] = { 
      ltone:ltone,
      htone:htone,
      ftone:ftone,
      tones:globalTones,
      startsWithAccidental:(globalTones.length>0&&globalTones[0].match[rtg.accidental])?true:false,
      mask:mask,
      clef:clef,
      clefTone: clefTone,
      mindy:minDy,
      ledgerA:ledgerA,
      ledgerB:ledgerB,
      def:result
    };
  }
  var getNeumeText=function(i) {
    var addEpisema=function(loc,loTone,hiTone){
      if(!hiTone)hiTone=loTone;
      if(loc==-1){
        tmpdata += neume(indices.episema_below,loTone);
        ltone=Math.min(ltone,loTone-1);
      } else {
        tmpdata += neume(indices.episema_above,hiTone);
        htone=Math.max(htone,hiTone+1);
      }
    },  addIctus=function(loc,tone){
      if(loc==1){
        tmpdata += neume(indices.ictus_above, tone);
        htone=Math.max(htone,tone+1);
      } else {
        tmpdata += neume(indices.ictus_below, tone);
        ltone=Math.min(ltone,tone-1);
      }
    },  commitTmpData=function(){
      var tspan=make('tspan',tmpdata);
      var tone=arguments[0];
      tspan.setAttribute('offset',tone.match.index);
      tspan.setAttribute('len',tone.match[0].length);
      for(var i=1; i<arguments.length; ++i){
        tspan.setAttribute('len'+i,arguments[i].match[0].length);
      }
      if(arguments.length>1)tspan.setAttribute('count',arguments.length);
      result.appendChild(tspan);
      tmpdata='';
    },  tmpdata = '',
        tonesInGlyph = 1,
        toneReps = 1,
        extraSpace='',
        tone = tones[i],
        nextTone = (tones.length > i+1)? tones[i+1] : null,
        thirdTone = (tones.length > i+2)? tones[i+2] : null,
        fourthTone = (tones.length > i+3)? tones[i+3] : null,
        lastTone = (i > 0)? tones[i-1]: null,
        base = indices.punctum

    if(i>0 && tone.relativeTone==0) tmpdata += "'";
    if(tone.diamond) {
      base = tone.liq? indices.diamond_tilde : indices.diamond;
      var di = Math.abs(tone.relativeTone);
      if(lastTone && lastTone.diamond && (di == 2)) {
        tmpdata += "'";
      }
      if(nextTone && !nextTone.diamond) extraSpace="-";
    } else if(tone.clef) {
        var minDyData=[minDy];
        result.appendChild(makeClefSpan(tone,minDyData));
        minDy=minDyData[0];
        return i;
    } else if(tone.modifiers) {
      if(tone.match[rtg.accidental]) {
        if(i==0)startsWithAccidental=true;
        var aname = (tone.match[rtg.flat])? 'flat' : 'natural';
        tmpdata += neume(indices[aname],tone.index) + "-";
        commitTmpData(tone);
        return i;
      } else {
        if(tone.match[rtg.virga]) {
          base = indices.v;
          toneReps=tone.match[rtg.virga].length;
          extraSpace="'";
        } else if(tone.match[rtg.stropha]) {
          base = indices.s;
          toneReps=tone.match[rtg.stropha].length;
          extraSpace="'";
        } else if(indices[tone.modifiers[0]]) {
          base = indices[tone.modifiers[0]];
          if(nextTone && (nextTone.relativeTone > 0 && nextTone.relativeTone <=5) && tone.modifiers == 'w' && (!thirdTone || thirdTone.relativeTone >= 0)) {
            tmpdata += neume(base,tone.index);
            if(tone.match[rtg.ictus]) {
              addIctus(-1,tone.index);
            }
            if(tone.match[rtg.episema]) {
              addEpisema(-1,tone.index);
            }
            commitTmpData(tone);
            if(nextTone.relativeTone>1) {
              tmpdata += neume(indices.connecting_line,tone.index,nextTone.index);
            }
            ++i;
            base = indices.topPartPodatus;
            tone = nextTone;
            tone.episemaLoc = 1;
          }
        }
      }
    } else if(nextTone && !nextTone.diamond && (!nextTone.modifiers || nextTone.liq)) {
      // no modifers, and there is at least one more tone on the stack.
      if(nextTone.relativeTone > 0 && nextTone.relativeTone <=5) {
        if(thirdTone && !thirdTone.diamond && (!thirdTone.modifiers || thirdTone.modifiers=='~') && thirdTone.relativeTone < 0 && thirdTone.relativeTone >= -4) {
          base = indices.punctum;
          if(!thirdTone.modifiers && fourthTone && fourthTone.relativeTone>=1 && fourthTone.relativeTone <=5) {
            //Going for porrectus next time...this one will be a straight punctum
            --i;
            tone.episemaLoc=0;
            nextTone.episemaLoc=0;
          } else {
            //torculus
            tmpdata += neume(base,tone.index);
            var hiTone=nextTone.index;
            var loTone=Math.min(tone.index,thirdTone.index);
            if(tone.match[rtg.episema]) {
              addEpisema(tone.episemaLoc,loTone,hiTone);
            }
            if(tone.match[rtg.ictus]) {
              addIctus(tone.episemaLoc,tone.index);
              tone.match[rtg.ictus]=undefined;
            }
            commitTmpData(tone);
            if(nextTone.relativeTone > 1) {
              tmpdata += neume(indices.connecting_line,tone.index,nextTone.index);
            }
            if(thirdTone.modifiers=='~'){
              --i;
              base=undefined;
            } else {
              tmpdata += neume(base,nextTone.index);
              if(nextTone.match[rtg.episema]) {
                addEpisema(tone.episemaLoc,loTone,hiTone);
              }
              if(nextTone.match[rtg.ictus]) {
                addIctus(nextTone.episemaLoc,nextTone.index);
                nextTone.match[rtg.ictus]=undefined;
              }
              commitTmpData(nextTone);
              if(thirdTone.relativeTone < -1) {
                tmpdata += neume(indices.connecting_line,thirdTone.index,nextTone.index);
              }
              tone = thirdTone;
              if(thirdTone.match[rtg.episema])tone.episemaTone = thirdTone.episemaLoc==-1?loTone:hiTone;
              if(thirdTone.modifiers=='~')base=indices.lower_tilde;
              tonesInGlyph = 3;
              ++i;
            }
          }
        } else if(nextTone.relativeTone <=5) {
          tone.episemaLoc=-1;
          nextTone.episemaLoc=1;
          base = indices.topPartPodatus;
          tonesInGlyph = 2;
          if(thirdTone && thirdTone.relativeTone <= 0) extraSpace="-";
          if(nextTone.liq) {
            tmpdata += neume(indices['<'],tone.index);
            base = indices.upper_tilde;
          } else {
            tmpdata += neume(indices.bottomPartPodatus,tone.index);
          }
          commitTmpData(tone);
          if(nextTone.relativeTone > 1) {
            tmpdata += neume(indices.connecting_line,tone.index,nextTone.index);
          }
          var temp=tone;
          tone=nextTone;
          nextTone=temp;
        }
        ++i;
      } else if(nextTone.relativeTone < 0 && nextTone.relativeTone >= -5) {
        if(!tone.markings && thirdTone && !thirdTone.diamond && (!thirdTone.modifiers || thirdTone.modifiers=='~') && thirdTone.relativeTone >= 1 && thirdTone.relativeTone <= 4 && nextTone.relativeTone >= -4) {
          if(tone.relativeTone >= 2 && tone.relativeTone <= 5) {
            tmpdata += neume(indices.connecting_line,tone.index-tone.relativeTone,tone.index);
          } else if(tone.relativeTone < 1) {
            var lineLen=Math.max(-nextTone.relativeTone,1);
            tmpdata += (result.childNodes.length>0?"-":"") + neume(indices.decorative_line,tone.index-lineLen,tone.index);
          }
          if(thirdTone.modifiers=='~'){
            --i;
            tmpdata += neume(base,tone.index);
            commitTmpData(tone);
            tmpdata += neume(indices.connecting_line,nextTone.index,tone.index);
            base=undefined;
          } else {
            tmpdata += neume(indices.porrectus,tone.index,nextTone.index);
            commitTmpData(tone,nextTone);
            tmpdata += neume(indices.decorative_line,nextTone.index,thirdTone.index);
            base = indices.topPartPodatus;
            thirdTone.episeamLoc=1;
            nextTone.episemaLoc=-1;
            tone = thirdTone;
            tonesInGlyph = 3;
            ++i;
          }
        } else {
          // clivis
          tonesInGlyph = 2;
          if(nextTone.liq) {
            var lineLen=Math.min(-nextTone.relativeTone,2);
            tmpdata += neume(indices.decorative_line,tone.index-lineLen,tone.index);
            tmpdata += neume(indices['>'],tone.index);
            commitTmpData(tone);
            base = indices.lower_tilde;
          } else {
            if(tone.relativeTone>0 && tone.relativeTone<=5 && lastTone.modifiers=="w") {
              if(tone.relativeTone>1)tmpdata += neume(indices.connecting_line,lastTone.index,tone.index);
            } else {
              tmpdata += neume(indices.decorative_line,nextTone.index,tone.index);
            }
            tmpdata += neume(indices.punctum,tone.index);
            if(tone.match[rtg.episema]) {
              addEpisema(tone.episemaLoc,nextTone.index,tone.index);
            }
            if(tone.match[rtg.ictus]) {
              addIctus(tone.episemaLoc,tone.index);
              tone.match[rtg.ictus]=undefined;
            }
            if(nextTone.match[rtg.episema]) {
              temp = nextTone.episemaLoc==-1?loTone:hiTone;
              tone.episemaTone=1;
              if(nextTone.episemaLoc!=-1)nextTone.episemaTone = tone.index;
            }
            if(tone.match[rtg.dot]) {
              tmpdata += neume(indices.dot,tone.index);
              tone.match[rtg.dot]=undefined;
            }
            commitTmpData(tone);
          }
          if(nextTone.relativeTone < -1) {
            tmpdata += neume(indices.connecting_line,nextTone.index,tone.index);
          }
          var temp=tone;
          tone=nextTone;
          nextTone=temp;
        }
        ++i;
      }
    }
    var temp = neume(base,tone.index);
    if(toneReps>1) {
      temp = (temp+"'").repeat(toneReps).slice(0,-1);
    }
    tmpdata += temp;
    if(tone.match[rtg.ictus]) {
      addIctus(tone.episemaLoc,tone.index);
    }
    if(tone.match[rtg.episema]) {
      var temp = tone.episemaTone||tone.index;
      addEpisema(tone.episemaLoc,temp);
    }
    if(tonesInGlyph>1) {
      if(nextTone.match[rtg.ictus]) {
        addIctus(nextTone.episemaLoc,nextTone.index);
      }
      if(nextTone.match[rtg.episema] && !tone.episemaTone) {
        addEpisema(nextTone.episemaLoc,nextTone.index);
      }
    }
    var lo,hi;
    if(tonesInGlyph>1){
      lo=Math.min(nextTone.index, tone.index);
      hi=Math.max(nextTone.index, tone.index);
      if((hi-lo)>=2 || lo%2 == 0) lo=undefined;
    }
    var temp = tone.match[rtg.dot];
    if(temp) {
      if(tone.index==lo) {
        tmpdata+=neume(indices.dot,lo-1);
      } else {
        tmpdata+=neume(indices.dot,tone.index);
      }
      temp = temp.length;
    } else {
      temp = 0;
    }
    if(nextTone && (temp>1 || (tonesInGlyph>1 && (temp=nextTone.match[rtg.dot])))) {
      if(nextTone.index==lo) {
        tmpdata+=neume(indices.dot,lo-1);
      } else {
        tmpdata+=neume(indices.dot,nextTone.index);
      }
    }
    if(temp && tones[i+1]) extraSpace += "--";
    tmpdata += extraSpace;
    if(base){
      commitTmpData(tone);
    }
    return i;
  }
})();
//temporary...wont work with multiple chants on the same page.
function addStaff(result,x,y,line,width,defs) {
  var maskId = 'staffmask' + line;
  var staffId= 'staff'+line;
  var systemId='system'+line;
  var T;
  if(masks[line]) {
    var tmp = masks[line].firstChild;
    while(tmp.childElementCount > 1) {
      tmp.removeChild(tmp.childNodes[1]);
    }
    T = tmp.firstChild;
  } else {
    var oldMask=masks[line],
        mask,
        g;
    if(oldMask && oldMask.parentNode != defs) {
      oldMask = $(defs).find("#"+maskId)[0];
    }
    if(oldMask) {
      mask = oldMask;
      g = mask.firstChild;
      T = $(g).find(">rect")[0];
    } else {
      mask = make('mask');
      mask.setAttribute('maskUnits','objectBoundingBox');
      mask.setAttribute('id', maskId);
      g = make('g');
      g.setAttribute('class', 'caeciliae');
      mask.appendChild(g);
      T = make('rect');
      g.appendChild(T);
      defs.appendChild(mask);
    }
    masks[line] = mask;
    mask.setAttribute('transform','translate(0,'+(y)+')');
  }
  T.setAttribute('y', -staffheight);
  T.setAttribute('width', '10000');
  T.setAttribute('height', 1+staffheight);
  T.setAttribute('fill', 'white');
  
  var returnVal = make('g');
  var staffInfo = returnVal.info = {
    ltone:3,
    htone:10,
    vOffset:0,
    x:0,
    y:parseInt(y),
    eText:make('text'),
    eTrans:make('text')
  };
  staffInfo.eText.setAttribute("class","goudy");
  staffInfo.eTrans.setAttribute("class","goudy");
      
  var group = make('g');
  returnVal.setAttribute('id',systemId);
  group.setAttribute('id',staffId);
  group.setAttribute('mask','url(#' + maskId + ')');
  var staff = make("use");
  staff.setAttributeNS(xlinkns, "href", "#staff");
  if(!width) width = $(svg.parentNode).width();
  staff.setAttribute("transform", "translate("+(x)+") scale(" + (width) + ",1)");
  group.appendChild(staff);
  returnVal.appendChild(group);
  result.appendChild(returnVal);
  return returnVal;
}
var gradients={};
// sets the gradient for the selected part of a porrectus
// punctumTag is the tspan element for the porrectus
// offset is 0 if the left side is selected and 1 if the right.
function setGradient(punctumTag,offset){
  var gradType = offset==0?'RedBlack':'BlackRed',
      neumeTag = punctumTag.parentNode,
      tmp=[],
      punctumIndex = $(punctumTag).index(),
      i,
      stops = useWidth(neumeTag,punctumIndex,1),
      totalWidth=neumeTag.neume.wChant || useWidth(neumeTag),
      gradId = 'grad' + gradType + stops.join('_') + '_' + totalWidth;

  if(!(gradId in gradients)){
    var $grad = $(gradients[gradType]).clone(),
        $stops = $grad.find("stop");

    $grad.attr("id",gradId);
    $($stops[0]).attr("offset",(stops[0]+(0.25*stops[1]))/totalWidth);
    $($stops[1]).attr("offset",(stops[0]+(0.75*stops[1]))/totalWidth);
    _defs.appendChild($grad[0]);
    gradients[gradId]=$grad[0];
  }
  
  punctumTag.setAttribute("style","fill:url(#"+gradId+")");
}
function setUpPunctaIn(use,punctumId){
  var id=0,
      oId=punctumId,
      tones=use.neume.info.tones;
  $(use).children().each(function(){
    var tone = tones[id];
    if(tone.match[rtg.accidental]){
      _accidentals[punctumId] = tone.match[rtg.flat]? (tone.index - _clefs[_clefs.length-1].info.clefTone) : null;
    }
    this.setAttribute('id','punctum'+punctumId);
    var count = parseInt(this.getAttribute('count'))||1;
    if(count == 2) {
      if(punctumId==selectedPunctum){
        selectedPunctumTag=this;
        this.setAttribute('class','selectable selected-1');
        setGradient(this,0);
      } else if(punctumId+1 == selectedPunctum){
        selectedPunctumTag=this;
        this.setAttribute('class','selectable selected-2');
        setGradient(this,1);
      } else {
        this.setAttribute('class','selectable');
      }
    } else if(punctumId==selectedPunctum){
      selectedPunctumTag=this;
      this.setAttribute('class','selectable selected');
    } else {
      this.setAttribute('class','selectable');
    }
    id += parseInt(this.getAttribute('count'))||1;
    punctumId = oId + id;
  });
  return punctumId
}
var playTone = function(){console.warn('Audiolet library not loaded.');};
var playScore = playTone;
var stopScore = playTone;
var baseFreq=385;
$(function() {
  var onAudiolet = function(){
    var audiolet = new Audiolet(baseFreq*4,2,baseFreq);
    var Synth = function(frequency,duration) {
      AudioletGroup.apply(this, [audiolet, 0, 1]);
      this.sine = new Sine(audiolet, frequency);
      
      this.gain = new Gain(audiolet);
      this.env = new PercussiveEnvelope(audiolet, 1, 0.3, (duration || 1) * .3,
          function() {
              this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
          }.bind(this)
      );
      this.envMulAdd = new Multiply(audiolet, 0.2, 0);

      // Main signal path
      this.sine.connect(this.gain);
      this.gain.connect(this.outputs[0]);

      // Envelope
      this.env.connect(this.envMulAdd);
      this.envMulAdd.connect(this.gain, 0, 1);
    };
    extend(Synth,AudioletGroup);
    var playFreq = function(freq,duration){
      var s = new Synth(freq,duration);
      s.connect(audiolet.output);
    };
    var semitones={
      0:0,
      1:2,
      2:4,
      3:5,
      4:7,
      5:9,
      6:11
    };
    playTone = function(tone,isFlat,duration){
      var freq=baseFreq;
      isFlat = tone==isFlat;
      while(tone<0){
        tone += 7, freq /= 2;
      }
      while(tone>=7){
        tone -= 7, freq *= 2;
      }
      if(tone>0){
        freq *= Math.pow(2.0, (semitones[tone] - (isFlat?1:0))/12);
      }
      playFreq(freq,duration);
    };
    var _isPlaying=false;
    tempo=150;
    var seq;
    playScore = function(fromBeginning){
      var punctumId = fromBeginning?0:(selectedPunctum||0);
      while(seq && seq.next());
      seq = new PSequence(_tones,1,punctumId);
      _isPlaying=true;
      audiolet.scheduler.setTempo(tempo);
      audiolet.scheduler.play([seq], 1, function(toneInfo){
        var duration;
        while(!(_isPlaying=_isPlaying && punctumId < _tones.length) || !(duration = toneInfo.play(punctumId))){
          ++punctumId;
          if(!(toneInfo=seq.next())){
            selectPunctum(-1);
            _isPlaying=false;
            return;
          }
        }
        selectPunctum(punctumId,true);
        if(duration)audiolet.scheduler.setTempo(tempo/duration);
        ++punctumId;
      });
    };
    stopScore = function(){
      _isPlaying=false;
    }
  };
  var onSink = function(){
    if(typeof(Audiolet)=='function'){
      try{onAudiolet();} catch(e){}
    } else {
      $.getScript('audiolet.js',onAudiolet);
    }
  };
  if(typeof(Sink)=='function'){
    onSink();
  } else {
    $.getScript('sink.js',onSink);
  }
  if($("link[href=style\\.css]").length==0){
    $(document.head).append($('<link rel="stylesheet" type="text/css" href="style.css">'));
  }
  var table = $("#tbl");
  if(table) {
    for(var code = 0xE0E0; code < 0xFFFF; code += 16) {
      var row = document.createElement('row');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      td1.innerText = '0x' + code.toString(16);
      var s = '';
      for(var i=0; i < 16; ++i) {
        s += String.fromCharCode(code+i) + '_';
      }
      td2.innerText = s;
      
      td2.className = 'caeciliae';
      row.appendChild(td1);
      row.appendChild(td2);
      table.append(row);
    }
  }

  svg = document.createElementNS(svgns, 'svg');
  svg.setAttribute('style','width:100%');
  setPrintFont=function(usePrintFont){
    $(svg).find(".caeciliae,.caeciliae-print").attr("class",usePrintFont?"caeciliae-print":"caeciliae");
  };
  /*var style = document.createElementNS(svgns, "style");
  style.setAttribute("type", "text/css");
  svgStyle=style;
  svgStyle.appendChild(document.createTextNode(""));
  setSvgFont=function(useSvg){
    style.firstChild.textContent = useSvg?styleFontPrint:styleFont;
  };
  var otherStyle = document.createElementNS(svgns, "style");
  otherStyle.appendChild(document.createTextNode("a.svg{text-decoration:none}\na.svg:hover{fill:#e22}\n"
    + ".b{font-weight:700}\n"
    + ".i{font-style:italic}\n"
    + ".sc{font-variant:small-caps}\n"
    + ".goudy{" + styleGoudy + "}\n"
    + ".caeciliae{" + styleCaeciliae + "}\n"
    + ".caeciliaeSvg{" +styleCaeciliaeSvg + "}"
  ));
  otherStyle.setAttribute("type", "text/css");
  svg.appendChild(otherStyle);
  setSvgFont(false);
  svg.appendChild(style);
  */
  _defs = document.createElementNS(svgns, "defs");
  defText = make('text','');
  defText.setAttribute("class", "goudy");
  _defs.appendChild(defText);
  _defText = make('text','');
  _defText.setAttribute("class", "goudy");
  _defs.appendChild(_defText);
  defChant = make('text','p');
  defChant.setAttribute('class', 'caeciliae');
  _defs.appendChild(defChant);
  defChantSvg=make('text','p');
  defChantSvg.setAttribute('class', 'caeciliaeSvg');
  _defs.appendChild(defChantSvg);
  var tmp=make('linearGradient');
  tmp.setAttribute('gradientUnits','objectBoundingBox');
  tmp.setAttribute('id','gradRedBlack');
  var tmp2=make('stop');
  tmp2.setAttribute('offset','0');
  tmp2.setAttribute('stop-color','#e22');
  tmp.appendChild(tmp2);
  tmp2=make('stop');
  tmp2.setAttribute('offset','100');
  tmp2.setAttribute('stop-color','#000');
  tmp.appendChild(tmp2);
  gradients.RedBlack=tmp;
  tmp=make('linearGradient');
  tmp.setAttribute('gradientUnits','objectBoundingBox');
  tmp.setAttribute('id','gradBlackRed');
  var tmp2=make('stop');
  tmp2.setAttribute('offset','0');
  tmp2.setAttribute('stop-color','#000');
  tmp.appendChild(tmp2);
  tmp2=make('stop');
  tmp2.setAttribute('offset','100');
  tmp2.setAttribute('stop-color','#e22');
  tmp.appendChild(tmp2);
  gradients.BlackRed=tmp;
  
  var gStaff;
  if(staffInFont) {
    gStaff = document.createElementNS(svgns, "text")
    gStaff.textContent="'";
    gStaff.setAttribute("transform","scale(0.5,1)");
  } else {
    gStaff = document.createElementNS(svgns, "g");
    var height = 1;
    var line = document.createElementNS(svgns, "path");
    var stringLine = "h1v" + height + "h-1zm0 -" + spaceheight;
    line.setAttribute("d", "M0 0" + stringLine.repeat(4));
    
/*    var grey = document.createElementNS(svgns,"rect");
    grey.setAttribute("width","1000");
    grey.setAttribute("fill","grey");
    grey.setAttribute("height",staffheight*4/5);
    grey.setAttribute("y","-47");
    gStaff.appendChild(grey);
*/
    gStaff.appendChild(line);
    
    var ledger = document.createElementNS(svgns, "g");
    //stringLine = stringLine.replace(/m0.*$/,'');
    line = document.createElementNS(svgns, "path");
    line.setAttribute("d","M0 " + spaceheight + stringLine);
    ledger.appendChild(line);
    ledger.setAttribute("id","ledgerb");
    _defs.appendChild(ledger);
    ledger = document.createElementNS(svgns, "g");
    line = document.createElementNS(svgns, "path");
    line.setAttribute("d","M0 " + (-spaceheight*4) + stringLine);
    ledger.appendChild(line);
    ledger.setAttribute("id","ledgera");
    _defs.appendChild(ledger);
  }
  gStaff.setAttribute("id", "staff");
  _defs.appendChild(gStaff);
  
  
  svg.appendChild(_defs);
  textElem = document.createElementNS(svgns, "g");
  textElem.setAttribute("transform", "translate(0," + staffoffset + ")");
  textElem.setAttribute("class", "caeciliae");
  svg.appendChild(textElem);
  var cp=$("#chant-preview");
  if(cp.length==0) {
    $(document.body).append(svg);
  } else {
    cp.append(svg);
    lastClefBeforeNeume=function(neumeId){
      var i,result={clefTone:9};
      for(i in _clefs){
        if(i<neumeId)result=_clefs[i];
        else break;
      }
      return result;
    };
    lastClefBeforePunctum=function(punctumId){
      var i,result={clefTone:9};
      for(i in _clefs){
        try {
          var punctumI = parseInt($(svg).find('#neume'+i).children()[0].id.match(/\d+$/)[0]);
          if(punctumI<punctumId)result=_clefs[i].info;
          else break;
        } catch(e){}
      }
      return result;
    }
    var isPunctumFlat=function(punctumId,toneId){
      var i,result=null;
      for(i in _accidentals){
        if(i<=punctumId)result=_accidentals[i];
        else break;
      }
      return result;
    }
    ToneInfo.prototype.play = function(punctumId){
      var clefIndex = lastClefBeforePunctum(punctumId).clefTone;
      var duration = this.match&&(this.match[rtg.dot]||this.match[rtg.episema])?2:1;
      if(!this.clef && !this.accidental && typeof(this.index)=="number"){
        playTone(this.index-clefIndex,isPunctumFlat(punctumId),duration);
        return duration;
      }
      return false;
    };

    var moveSelectedPunctum=function(offset){
      var tag = selectedPunctumTag;
      if(!tag)return;
      var neumeTag = tag.parentNode;
      var punctumId = selectedPunctum - /^punctum(\d+)$/.exec(neumeTag.childNodes[0].id)[1];
      var neume = neumeTag.neume;
      var tone = neume.info.tones[punctumId];
      if(!tone || !tone.match)return;
      var letter = tone.match[rtg.tone],
          newLetter,clef;
      if(!letter){
        clef = tone.match[rtg.clef];
        letter = parseInt(clef.slice(-1));
        var newLetter = letter + offset;
        if(newLetter<1)newLetter=1;
        else if(newLetter>4)newLetter=4;
        offset = newLetter - letter;
        if(offset==0)return;
        clef = clef.slice(0,-1) + newLetter;
      } else {
        var newIndex = tone.index + offset;
        if(newIndex<0)newIndex=0;
        else if(newIndex>12)newIndex=12;
        offset = newIndex - tone.index;
        if(offset==0)return;
        newLetter = String.fromCharCode(letter.charCodeAt(0)+offset);
      }

      e=$("#editor");
      var cGABC = e.val();
      var index = getHeaderLen(cGABC);
      index += neume.index;
      var tmp=cGABC.slice(0,index);
      cGABC = cGABC.slice(index);
      index = selectSelectedGabc(true);
      var i2 = index + tone.match[0].length;
      var neumeText = cGABC.slice(0,index);
      neumeText += cGABC.slice(index,i2).replace(letter,newLetter);
      index = neume.gabc.length;
      neumeText += cGABC.slice(i2,index);
      cGABC = tmp + neumeText + cGABC.slice(index);
      neume.gabc = neumeText;
      var oldInfo = neume.info;
      var newNeume = neume.info = getChantFragment(neumeText,$(svg).find("defs")[0]);
      if(clef){
        for(i in _clefs[selectedNeume].clefs){
          var c = _clefs[selectedNeume].clefs[i];
          c.setAttributeNS(xlinkns, 'href', '#' + clef);
        }
      }
      stopScore();
      newNeume.tones[punctumId].play(selectedPunctum);
      var use = $(newNeume.def).clone()[0];
      use.neume=neume;
      use.setAttribute("id",neumeTag.id);
      use.setAttribute("x",neumeTag.getAttribute("x"));
      use.setAttribute("y",neumeTag.getAttribute("y"));
      use.setAttribute("transform",neumeTag.getAttribute("transform"));
      $(neumeTag).replaceWith(use);
      neume.wChant = useWidth(use);
      processLedger(neume,use);
      relayoutChant(svg);
      // if this punctum has an associated custos, that needs to be moved as well
      if(punctumId==0 && neume.custos){
        addCustos(neume.custos.parentNode,neume);
      }
      
      var staff = use.parentNode;
      var oldHtone = staff.info.htone;
      var oldLtone = staff.info.ltone;
      if(oldInfo.htone <= neume.info.htone){
        staff.info.htone = Math.max(staff.info.htone,neume.info.htone);
      } else {
        // re-calculate the htone of the system based on all neumes in it.
        staff.info.htone = 10;
        $(staff).find("[id^=neume]").each(function(){
          staff.info.htone = Math.max(staff.info.htone,this.neume.info.htone);
        });
      }
      if(oldInfo.ltone >= neume.info.ltone){ 
        staff.info.ltone = Math.min(staff.info.ltone,neume.info.ltone);
      } else {
        // re-calculate the ltone of the system based on all neumes in it.
        staff.info.ltone = 3;
        $(staff).find("[id^=neume]").each(function(){
          staff.info.ltone = Math.min(staff.info.ltone,this.neume.info.ltone);
        });
      }
      var extraHeight = $(staff.parentNode).children("#system0")[0].info.y;
      if(clef || oldHtone != staff.info.htone || oldLtone != staff.info.ltone){
        var y = finishStaff(staff);
        var lineOffset = staffoffset + y + verticalSpace + staff.info.y;
        // update all staves below as well.
        var i = parseInt(staff.id.match(/\d+$/)[0]) + 1;
        while( (staff = $(staff).siblings('#system'+i)[0]) ){
          staff.info.y = lineOffset;
          y = finishStaff(staff);
          lineOffset = staffoffset + y + verticalSpace + staff.info.y;
          ++i;
        }
      }
      svg.setAttribute('height',$(svg).children("g")[0].getBBox().height + extraHeight + _heightCorrection - _defText.getExtentOfChar("q").height);
      
      punctumId = selectedPunctum - punctumId;
      selectedPunctumTag=null;
      punctumId = setUpPunctaIn(use,punctumId);
      selectedNeumeTag=use;
      e.val(cGABC);
    }
    var selectSelectedGabc=function(getOffset){
      if(!(selectedPunctum!=null && selectedPunctumTag))return;
      var tag = selectedPunctumTag;
      var punctumOffset=selectedPunctum - tag.id.match(/^punctum(\d+)$/)[1];
      var parent=tag.parentNode;
      var offset = parseInt(tag.getAttribute("offset"))||0;
      var len = parseInt(tag.getAttribute("len"))||3;
      if(punctumOffset){
        offset += len;
        len = parseInt(tag.getAttribute("len1"));
      }
      if(getOffset) return offset;
      selectGabc(parent.neume.index+offset,len);
    }
    var selectPunctum=function(punctumToSelect,dontPlay){
      punctumToSelect=parseInt(punctumToSelect);
      if(punctumToSelect<0)punctumToSelect=-1;
      if(punctumToSelect==selectedPunctum)return;
      var punctumOffset=0,
          punctum;
      if(punctumToSelect<0) {
        dontPlay=true;
        punctum=$();
      } else {
        punctum=$(svg).find("#punctum"+punctumToSelect);
        if(punctum.length==0){
          punctumOffset=1;
          --punctumToSelect;
          punctum=$(svg).find("#punctum"+punctumToSelect);
          if(punctum.length==0 || punctum.attr("count")!=2){
            selectedPunctumTag=null;
            return;
          }
        }
      }
      selectedPunctum=punctumToSelect+punctumOffset;
      selectedPunctumTag=punctum[0];
      var tmp=punctum.parent().attr("id");
      if(tmp)tmp = /neume(\d+)/i.exec(tmp);
      selectedNeume = tmp?parseInt(tmp[1]):-1;
      selectedNeumeTag = selectedPunctumTag && selectedPunctumTag.parentNode;
      $(svg).find(".selectable").attr({"class":"selectable",style:""});
      punctum.attr("class","selectable selected" + (punctum.attr("count")==2?"-"+(1+punctumOffset):""));
      if(punctum.attr("count")==2)setGradient(punctum[0],punctumOffset);
      
      if(!dontPlay){
        //play tone
        stopScore();
        var punctumId = selectedPunctum - /^punctum(\d+)$/.exec(selectedNeumeTag.childNodes[0].id)[1];
        selectedNeumeTag.neume.info.tones[punctumId].play(selectedPunctum);
      }
    };
    var selectNeume=function(neumeToSelect){
      var neume=$(svg).find("#neume"+neumeToSelect + ">tspan");
      punctumToSelect=/punctum(\d+)/i.exec(neume.attr("id"));
      if(punctumToSelect)selectPunctum(parseInt(punctumToSelect[1]));
    };
    $("tspan.selectable[id^=punctum]").live("click",function(e){
      selectPunctum(/punctum(\d+)/i.exec(this.id)[1]);
    });
    var docKeyDown=function(e){
      if(e.target.tagName.match(/textarea|input|select/i)){
        selectPunctum(-1);
        return;
      }
      var punctumToSelect=selectedPunctum;
      if(e.ctrlKey) {
        var neumeToSelect = selectedNeume;
        switch(e.which){
          case 37: // left;
            --neumeToSelect;
            break;
          case 39: // right
            ++neumeToSelect;
            break;
          case 38: // up
            moveSelectedPunctum(2);
            e.preventDefault();
            return;
          case 40: // down
            moveSelectedPunctum(-2);
            e.preventDefault();
            return;
          case 13: // enter
            callUpdateChant();
            return;
          case 32: // space
            playScore();
            return;
          default:
            return;
        }
        selectNeume(neumeToSelect);
      } else {
        switch(e.which){
          case 37: // left;
            --punctumToSelect;
            break;
          case 39: // right
            ++punctumToSelect;
            break;
          case 38: // up
            moveSelectedPunctum(1);
            e.preventDefault();
            return;
          case 40: // down
            moveSelectedPunctum(-1);
            e.preventDefault();
            return;
          case 13: // enter
            selectSelectedGabc();
            e.preventDefault();
            return;
          case 32: // space
            playScore(true);
            e.preventDefault();
            return;
          case 27:
            stopScore();
            return;
          default:
            console.info(e.which);
            return;
        }
        selectPunctum(punctumToSelect);
      }
    };
    $(document).keydown(docKeyDown);
  }
  var elements = $('.jgabc');
  elements.each(function(index, element) {
    var elem=$(element).clone().toggleClass("jgabc jgabc-svg").text("");
    $(element).hide();
    $(svg).clone().appendTo(elem);
    $(element).after(elem);
  });
  var _timeoutUpdate=null;
  var _timeoutUpdateWidth=null;
  var updateAllChant = function(e,dontDelay){
    callUpdateChant();
    if(_timeoutUpdate) clearTimeout(_timeoutUpdate);
    if(!dontDelay) {
      var delay = 500;
      _timeoutUpdate = setTimeout(function() {updateAllChant(null,true);},delay);
      return;
    }
    _timeoutUpdate = null;
    elements.each(function(index, element) {
      var old=$(element).next(".jgabc-svg").find("svg")[0];
      if(!old) return;
      updateChant(element.innerHTML, old, true);
    });
  }
  var updateAllChantWidthHelper = function(dontDelay){
    if(_timeoutUpdateWidth) clearTimeout(_timeoutUpdateWidth);
    if(!dontDelay) {
      var delay = 500;
      _timeoutUpdateWidth = setTimeout(function() {updateAllChantWidthHelper(true);},delay);
      return;
    }
    _timeoutUpdateWidth = null;
    relayoutChant(svg);
    elements.each(function(index, element) {
      var old=$(element).next(".jgabc-svg").find("svg")[0];
      if(!old) return;
      relayoutChant(old);
    });
  }
  //var updateAllChantWidth;
  if(navigator.userAgent.match(/\bChrome\b/)){
    updateAllChantWidth = function(e){
      updateAllChantWidthHelper(true);
    };
  } else {
    updateAllChantWidth = function(e){
      updateAllChantWidthHelper();
    };
  }
  var callUpdateChant = function(){
    updateChant($("#editor").val(),svg);
  };
  forceUpdateChant = function(){
    updateChant($("#editor").val(),svg,true);
  }
  var handleDragOver=function(e){
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  var handleDrop=function(e){
    e.stopPropagation();
    e.preventDefault();
    var i;
    for(i=0; i < e.originalEvent.dataTransfer.files.length; ++i){
      var file = e.originalEvent.dataTransfer.files[i];
      var reader=new FileReader();
      var $txtArea = $(this);
      reader.onload=function(e){
        $txtArea
          .val(e.target.result)
          .keyup();
        if(typeof(processGabc)=="function")processGabc(e.target.result);
      };
      reader.readAsText(file);
    }
  };
  $("#editor")
    .keyup(callUpdateChant)
    .bind('dragover', handleDragOver)
    .bind('drop', handleDrop);
  //$(window).resize(updateAllChant);
  $(window).resize(updateAllChantWidth);
  var tWidth=0;
  var oldTWidth=0;
  var initCount=0;
  var init = function() {
    if(svg.parentNode && svg.parentNode.clientWidth == 0) {
      setTimeout(init, 100);
    } else {
      tWidth=textWidth("abcdefghijklmnopqrstuvwxyz","goudy",true);
      var cWidth1=getChantWidth("4q5P");
      var cWidth2=getChantWidth("P");
      notewidth = getChantWidth("p");
      if(cWidth1==cWidth2) {
        neume = _neumeLig;
        indices=_indicesLig;
        makeClefSpan=_clefSpanLig;
      } else {
        neume = _neumeChar;
        indices=_indicesChar;
        makeClefSpan=_clefSpanChar;
      }
      if(tWidth != oldTWidth) {
        _txtWidths={};
        oldTWidth=tWidth;
        forceUpdateChant();
        updateAllChant();
      }
      if(++initCount < 100) {
        setTimeout(init,300);
      }
    }
  };
  setTimeout(init, 100);
}
);
window.updateChant=updateChant;
var neume=_neumeChar;
var indices=_indicesChar;
var makeClefSpan=_clefSpanChar;
