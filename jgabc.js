String.prototype.repeat = function(num){return new Array(num+1).join(this);};
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
var regexToneModifiers = /(')|(\.{1,2})|((?:_){1,4}0?)/g
var regexTones = new RegExp("([/ ,;:`]+)|((?:[fF]|[cC][bB]?)[1-4])|(?:(-)?(([A-M])|([a-m]))(([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|(o)|(O)|((x)|(y))|(q)|((R)|(r0)|(r(?![1-5])))|(r[1-5]))?((?:" + String(regexToneModifiers).replace(/^\/|\/\w*$/g,"").replace(/\((?!\?:)/g,"(?:") + ")*)|(z0))|\\[([^\\]]*)(?:\\]|$)","g");
//                          /([\/ ,;:`]+)|([cfCF][1-4])|(?:(-)?(([A-M])|([a-m]))(([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|(o)|(O)|((x)|(y))|(q)|((R)|(r0)|(r(?![1-5])))|(r[1-5]))?((?:(?:')|(?:\.{1,2})|(?:(?:_0?){1,4}))*)|(z0))|\[([^\]]*)(?:\]|$)                                )*)|(z0))|\[([^\]]*)(?:\]|$)
//                          /([\/ ,;:`]+)|([cfCF][1-4])|(?:(-)?(([A-M])|([a-m]))(([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|(o)|(O)|((x)|(y))|(q)|((R)|(r0)|(r(?![1-5])))|(r[1-5]))?((?:(?:')|(?:\.{1,2})|(?:(?:_0?){1,4}))*)|(z0))|\[([^\]]*)(?:\]|$)
var regexTonesSpliceIndex=26;
var regexToneModifiersCount = 4;
var rtg = {
  whitespace: 1,
  clef: 2,
  initioDebilis: 3,
  tone: 4,
  toneUpper: 5, // diamond
  toneLower: 6,
  noteType: 7,      // (([Vv]{1,3})|(s{1,3})|((<)|(>)|(~))|(w)|([oO])|([xy])|(q)]|(R|r0|r(?![1-5]))|(r[1-5]))
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
  ictus: 26,        // (')
  dot: 27,          // (\.{1,2})
  episema: 28,      // ((?:_0?)){1,4})
  custos: 29,        // z0
  bracketed: 30      // [text]
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
var _timeoutGabcUpdate = null;
var _minUpdateInterval = 1700;
var _heightCorrection = 0;

var utf8_bom=String.fromCharCode(0xEF)+String.fromCharCode(0xBB)+String.fromCharCode(0xBF);
function encode_utf8( s )
{
  return utf8_bom+unescape( encodeURIComponent( s ) );
}
function decode_utf8( s )
{
  return decodeURIComponent( escape( s ) );
}

function getHeader(text){
  var match=text.match(regexHeaderEnd);
  if(match){
    var txtHeader = text.slice(0,match.index+match[0].length);
    var json = "{" + (txtHeader.replace(/^([\w-_]+):\s*([^;\r\n]+)(?:;|$)|^.*$/gmi,'"$1":"$2",').slice(0,-1))+"}";
    try {
      var result = JSON.parse(json);
      result.toString=function(){return txtHeader;};
      result.length = txtHeader.length;
      return result;
    } catch(ex){
    }
    return txtHeader;
  }
  return "";
}
function updateLinks(text){
  var header=getHeader(text);
  if(header){
    text = text.slice(header.length);
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
      var filename = header.filename||"Untitled";
      if(!filename.match(/\.gabc$/))filename += ".gabc";
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
      //console.info("("+i+","+len+") " + JSON.stringify(txt));
      txt.forEach(function(e){
        var tmp=e.span();
        dt.appendChild(tmp);
        var sIndex=Math.max(i,idx);
        var tlen=Math.min(idx+e.text.length,i+(len||1000000))-sIndex;
        sIndex-=idx;
        idx+=e.text.length;
        //console.info("e: " + JSON.stringify(e));
        try {
          if(tlen>0&&sIndex>=0)wid+=tmp.getSubStringLength(sIndex,tlen);
        } catch(exception){
          console.warn(exception);
        }
      });
      //console.info(dt.textContent + "[" + i + "," + (len||100) + "]: " + wid + " " + JSON.stringify(txt));
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
    //console.info(txt.textContent + ": " + dt.getComputedTextLength());
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

function useWidth(use) {
  if(use.tagName.match(/^use$/i))return getChantWidth(document.getElementById(use.getAttribute('href').slice(1)).textContent);
  return getChantWidth(use.textContent);
}

function getChantWidth(text) {
  defChant.textContent=text;
  return defChant.getComputedTextLength();
}

function selectGabc(start,len){
  var e=$("#editor")[0];
  var header=getHeader(e.value);
  start+=header.length;
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
  var width = $(svg.parentNode).width();
  var userNotes = header["user-notes"];
  var commentary= header["commentary"];
  var curHeight = 0;
  if(typeof(userNotes)=="string" && userNotes.length>0){
    var txt = make('text',userNotes);
    txt.setAttribute('class','goudy i');
    txt.setAttribute('y',16-staffoffset);
    result.appendChild(txt);
    curHeight = 20;
  }
  if(typeof(commentary)=="string" && commentary.length>0){
    var txt = make('text',commentary);
    txt.setAttribute('class','goudy i');
    txt.setAttribute('y',16-staffoffset);
    result.appendChild(txt);
    txt.setAttribute('x',width-$(txt).width());
    curHeight = 20;
  };
  top[0]=curHeight;
  regexOuter.lastIndex = 0;
  var xoffset = 0;
  var xoffsetChantMin = 0;
  var use;
  var use2;
  var span = null;
  var eText = make('text');
  var eTrans= make('text');
  var txtInitial;
  var txtAnnotation;
  var startX=0;
  var firstText=true;
  eText.setAttribute("class", "goudy");
  eText.setAttribute('transform', "translate(0," + curHeight + ")");
  eTrans.setAttribute('class','goudy');
  var lastSpan;
  var ltone = 3;
  var htone = 9;
  var line = 0;
  var lineOffsets = [curHeight];
  var words=[];
  var currentWord=[];
  try {
    var padding = $(svg.parentElement).css("padding-left");
    if(padding) width -= parseFloat(padding);
  } catch(e) { }
  svgWidth = width;
  var activeTags=[];
  var clef,wClef;
  var needCustos = false;
  var previousMatch;
  var activeClass = "goudy";
  var usesBetweenText = [];
  var curStaff = addStaff(result,0,lineOffsets[line],line, null, defs);

  //This function will trim the width of the staff to lign up with the last element on it.
  var trimStaff=function(){
    var staffUse=$(curStaff).find("use[href=#staff]");
    var lastUse=$(curStaff).find("[id^=neume]:last");
    href=lastUse.attr("href");
    if(href) {
      if(!/\:$/.exec(href))return;
    } else if(!/\|$/.exec(lastUse.text()))return;
    var x=parseFloat(lastUse.attr("x"));
    var transform=lastUse.attr("transform");
    var m = regexTranslate.exec(transform);
    if(m && m[1])x += parseFloat(m[1]);
    x += useWidth(lastUse[0]);
    var scale="scale("+x+",1)";
    staffUse.attr("transform",function(index,transform){
      return transform.replace(/scale\([^\)]*\)/,scale);
    });
  }
  
  //This function will update the height and y offset of the staff once there is no more chant to be put on it, based on htone and ltone
  var finishStaff=function(){
    ltone = (3 - ltone);
    ltone = (ltone <= 0)? 0 : ((ltone * spaceheight)/2);
    htone = (htone - 9);
    htone = (htone <= 0)? 0 : ((htone * spaceheight)/2);
    var y = Math.ceil(0.1*staffheight + fontsize + ltone + htone);
    if(txtInitial)txtInitial.setAttribute('y',y);
    if(txtAnnotation)txtAnnotation.setAttribute('y',parseFloat(txtAnnotation.getAttribute('y'))+Math.ceil(htone));
    txtInitial=null;
    txtAnnotation=null;
    //startX=0;
    eText.setAttribute("y",y);
    eTrans.setAttribute('y',y+fontsize);
    result.appendChild(eText);
    result.appendChild(eTrans);
    if(eTrans.childNodes.length>0){
      lineOffsets[line] += fontsize;
    }
    if(htone>0) {
      lineOffsets[line] += htone;
      if(line==0) _heightCorrection += htone;
      curStaff.setAttribute("transform",(curStaff.getAttribute("transform")||"")+" translate(0, " + htone + ")");
    }
    return y;
  }
  var justifyLine=function(){
    var endSpace=2*spaceBetweenNeumes;
    var x2=svgWidth - startX - endSpace;
    if(currentWord.length>0){
      words.push(currentWord);
      currentWord=[];
    }
    var lastUse,lastTspan;
    var i=words.length-1;
    while(i>=0 && !(lastUse && lastTspan)){
      var cWord=words[i--];
      var j=cWord.length-1;
      while(j>=0 && !(lastUse && lastTspan)){
        var tag=cWord[j--];
        if(!lastUse && tag.tagName.match(/^use|text$/i)){
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
      currentX += useWidth(lastUse);
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
    words=[];
  }
  var addCustos=function(result,tone) {
    justifyLine();
    var x2=svgWidth - startX - (staffheight/15);
    var t = make('text',neume(indices.custos,tone));
    t.setAttribute('class',defChant.getAttribute('class'));
    t.setAttribute('x',x2);
    t.setAttribute('y',0);
    result.appendChild(t);
    var ledgerAbove=tone>10;
    var ledgerBelow=tone<2;
    if(ledgerAbove||ledgerBelow)insertLedger(ledgerAbove,result,t,true);
  }
  //_heightCorrection=0;
  while(match = regexOuter.exec(text)) {
    //TODO: first collect all data from match into the cneume object
    // so that we can have a function to process just from a cneume object
    // Put the actual text elements in the cneume object as well.
    var cneume={};
    var tags=[];
    if(match[5]) {
      cneume.gabc=match[5];
      cneume.info = getChantFragment(cneume.gabc,defs);
      clef=cneume.info.clef||clef;
      if(line==0 && cneume.info.mindy<_heightCorrection) {
        _heightCorrection = cneume.info.mindy;
      }
      defChant.textContent = cneume.info.def.textContent;
      cneume.wChant = defChant.getComputedTextLength();
      if(cneume.gabc==clef)wClef=cneume.wChant;
    } else cneume.info={};
    var wText;
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
      if(firstText && header["initial-style"]!="0") {
        var initial = txt[0];
        txt = txt.slice(1);
        if(txt.length==0)txt='-';
        txtInitial = make('text',initial);
        txtInitial.setAttribute('transform','translate(0,'+lineOffsets[line]+')');
        txtInitial.setAttribute('class','greinitial');
        result.appendChild(txtInitial);
        var lenInitial=$(txtInitial).width();
        var annotation = header["annotation"];
        if(typeof(annotation)=="string" && annotation.length>0){
          annotation = annotation.replace(/\b[IVX]+\b/,function(s){return s.toLowerCase();})
            .replace(/((?:per\\.?|[a-g][\d]?\*?)\s*)$/i,"</sc>$1");
          txtAnnotation = make('text');
          var tagsAnnotation = tagsForText('<sc>'+annotation+'</sc>');
          for(i in tagsAnnotation){
            txtAnnotation.appendChild(tagsAnnotation[i].span());
          }
          txtAnnotation.setAttribute('class','greannotation');
          txtAnnotation.setAttribute('y',lineOffsets[line]-25);
          result.appendChild(txtAnnotation);
          var lenAnnotation=$(txtAnnotation).width();
          var centerX = Math.max(lenAnnotation,lenInitial) / 2;
          txtAnnotation.setAttribute('x',centerX-(lenAnnotation/2));
          txtInitial.setAttribute('x',centerX-(lenInitial/2));
          startX=Math.max(lenAnnotation,lenInitial)+5;
        } else {
          startX=lenInitial + 5;
        }
        eText.setAttribute("transform", "translate("+startX+","+lineOffsets[line]+")");
        eTrans.setAttribute("transform", "translate("+startX+","+lineOffsets[line]+")");
        curStaff.setAttribute("transform", curStaff.getAttribute("transform") + " translate("+startX+")");
        var useStaff = $(curStaff).find("use[href=#staff]")[0];
        useStaff.setAttribute("transform", "scale(" + (width-startX) + ",1)");
      }
      firstText=false;
      txt = txt.replace(/^\s+/,'').replace(/\r\n/g,' ').replace(/\n/g,' ').replace(/<v>\\greheightstar<\/v>/g,'*').replaceSpTags();
      
      var tmpArray=[txt];
      tags = tagsForText(tmpArray,activeTags);
      txt=tmpArray[0];
      var pretext="";
      if(tags.length>0)tags.forEach(function(e){pretext+=e.text;});
      if(txt.length>0)tags.push(new TagInfo(txt.replace(/[{}]/g,''),activeTags));
      txt = pretext+txt;
      wText = textWidth(tags);
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
          vowel = {index: 0, "0":txt.trimRight(), "1":txt.trimRight()};
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
    } else {
      wText = 0;
    }
    // if there aren't enough characters before the vowel so that the neume begins far enough to the right of the previous neume,
    // add extra space in the text:
    var preWidth=cneume.info.startsWithAccidental?getChantWidth("b-"):0;
    offset += preWidth;
    xoffsetChantMin += Math.min(0,offset);
    if(cneume.wChant > 0 && (xoffset < xoffsetChantMin || !txt)) {
      xoffset = xoffsetChantMin;
    }
    var nextXoffsetTextMin = txt?
        xoffset + wText + Math.max(Math.floor(offset),0)
      : nextXoffsetTextMin||0;
    if(match[7]&&match.index>0)nextXoffsetTextMin+=5;
    var nextXoffsetChantMin = xoffset + cneume.wChant + spaceBetweenNeumes - Math.min(offset,0);
   //Experimental change (2010.03.14)  Old line:
    var nextXoffset = wText==0?Math.max(nextXoffset||0,xoffset):Math.max(nextXoffsetTextMin, nextXoffsetChantMin);
    //var nextXoffset = wText==0?Math.max(nextXoffset||0,xoffset):nextXoffsetTextMin;
    var lastX;
    if(nextXoffset >= width - startX - spaceBetweenNeumes) {
      needCustos = curStaff;
      usesBetweenText=[];
      if(span&&txt&&$(span).text().slice(-1)!='-')span.appendChild(new TagInfo('-').span());
      var y = finishStaff();
      eText = make('text');
      eText.setAttribute("class", "goudy");
      eTrans= make('text');
      eTrans.setAttribute("class", "goudy");
      lineOffsets.push(staffoffset + y + verticalSpace + lineOffsets[line++] - htone);
      ltone = 3;
      htone = 10;
      eText.setAttribute('transform', "translate(0," + lineOffsets[line] + ")");
      eTrans.setAttribute('transform', "translate(0," + lineOffsets[line] + ")");
      curStaff = addStaff(result,0,lineOffsets[line],line, null, defs);
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
      
    if(cneume.gabc) {
      if(needCustos) {
        addCustos(needCustos,cneume.info.ftone);
        needCustos = false;
        startX=0;
      }
      if(cneume.info.mask) {
        use2 = make('use');
        use2.setAttributeNS(xlinkns, 'href', '#' + cneume.info.mask);
        use2.setAttribute('class',"caeciliae");
        use2.setAttribute('x', xoffset);
        use2.setAttribute('y', 0);
        
        currentWord.push(use2);
        //use2 = make('rect');
        //use2.setAttribute('x', xoffset);
        //use2.setAttribute('y', lineOffsets[line]-47);
        //use2.setAttribute('fill','#ffff');
        //use2.setAttribute('height',staffheight*4/5);
        //use2.setAttribute('width',spaceheight/2);
        //use2 = make('circle');
        //use2.setAttribute('cx', xoffset + (64 * staffheight / 1000));
        //use2.setAttribute('cy', lineOffsets[line] - (132 * staffheight / 1000) - spaceheight/2);
        //use2.setAttribute('r', 250 * staffheight / 1000);
        //use2.setAttribute('fill','black');
        masks[line].firstChild.appendChild(use2);
      } else use2 = null;
      ltone = Math.min(ltone, cneume.info.ltone);
      htone = Math.max(htone, cneume.info.htone);
      if(makeLinks) {
        use = $(cneume.info.def).clone()[0];
      } else {
        use = make('use');
        use.setAttributeNS(xlinkns, 'href', '#' + cneume.gabc);
      }
      use.setAttribute('id','neume'+neumeId);
      use.setAttribute('x', xoffset);
      use.setAttribute('y', 0);
      if(makeLinks) {
        $(use).children().each(function(){
          this.setAttribute('class','selectable' + ((punctumId==selectedPunctum)?" selected":""));
          this.setAttribute('id','punctum'+punctumId);
          punctumId += parseInt(this.getAttribute('count'))||1;
        });
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
          var x1=parseFloat(first.getAttribute('x'))+useWidth(first);
          var transform = first.getAttribute('transform');
          if(transform) {
            var m = regexTranslate.exec(transform);
            x1 += parseFloat(m[1]);
          }
          var x2=xoffset;
          if(offset<0)x2-=offset;
          var chantWidth=0;
          for(var i=1;i<=count;++i) {
            chantWidth+=useWidth(usesBetweenText[i][0]);
          }
          var spaceWidth=x2-x1-chantWidth;
          spaceWidth /= (count+1);
          var x = x1 + spaceWidth;
          for(var i=1;i<=count;++i) {
            var u=usesBetweenText[i];
            for(j in u) {
              u[j].setAttribute('x', x);
          }
            x += spaceWidth + useWidth(u[0]);
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
      span = make('tspan');
      var spanXoffset = xoffset;
      // Don't worry about placing the vowel correctly if there is no neume.
      if(use) {
        if(offset > 0) {
          //check if we can push the syllable to the left rather than force a hyphen.
          if(spanXoffset-offset >= xoffsetChantMin) {
            wText -= offset;
            use.setAttribute('transform', "translate(" + (-offset) + ")");
            if(use2)
              use2.setAttribute('transform', "translate(" + (-offset) + ")");
          } else {
            spanXoffset += offset;
            wText += offset;
          }
        } else {
          use.setAttribute('transform', "translate(" + (-offset) + ")");
          if(use2)
            use2.setAttribute('transform', "translate(" + (-offset) + ")");
          cneume.wChant -= offset;
        }
      }
      if(lastSpan) {
        var lastXoffset = parseFloat(lastSpan.getAttribute('x'),10);
        var lastSpanX2 = lastXoffset + textWidth(lastSpan);
        if(lastSpanX2 < spanXoffset) {
          if($(lastSpan).text().slice(-1)!='-'){
            lastSpan.appendChild(new TagInfo('-').span());
            lastSpanX2 = lastXoffset + textWidth(lastSpan);
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
        eTrans.appendChild(cspan);
      }
      currentWord.push(span);
      eText.appendChild(span);
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
    if(cneume.info.ledger && use) {
      var ledgers=[];
      if(cneume.info.ltone<2)ledgers.push(false);
      if(cneume.info.htone>10)ledgers.push(true);
      ledgers.forEach(function(a){
        currentWord.push(insertLedger(a,curStaff,use));
      });
    }
  }
  finishStaff();
  if(gabcSettings.trimStaff) trimStaff();
  return result;
}
function insertLedger(above,curStaff,use,isCustos){
  var temp = make('use');
  temp.setAttributeNS(xlinkns, 'href', above?'#ledgera':'#ledgerb');
  temp.setAttribute('y',use.getAttribute('y'));
  var transform = use.getAttribute('transform');
  var tx = parseFloat(use.getAttribute('x'));
  if(transform) {
    var m = regexTranslate.exec(transform);
    if(m) tx += parseFloat(m[1]);
  }
  chantWidth=useWidth(use);
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
    var ftone = null;
    result.setAttribute('id', gabc);
    var code;
    var curChar, nextChar;
    var charsLeft = gabc.length;
    var index = 0;
    var prevIndex = 0;
    var match;
    var clef;
    var startsWithAccidental = false;
    minDy = 0;
    regexInner.lastMatch = 0;
    while(match = regexInner.exec(gabc)) {
      tones = [];
      var previousToneId = -1;
      chant=match[0];
      regexTones.exec('');
      while(cmatch = regexTones.exec(chant)) {
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
            $.extend(imatch,newmatch);
          }
        } else {
          imatch = new Array(regexToneModifiersCount);
        }
        cmatch = cmatch.splice(0,regexTonesSpliceIndex).concat(imatch.splice(1,imatch.length-1)).concat(cmatch.splice(1,cmatch.length-1));
        if(cmatch[rtg.bracketed]) continue;
        if(cmatch[rtg.clef])clef=cmatch[rtg.clef];
        tone = cmatch[0];
        if(cmatch[rtg.whitespace]) {
          // merely some kind of text substitution.
          for(var i=0; i < transforms[0].length; ++i) {
            tone = tone.replace(transforms[2][i],transforms[1][i]);
          }
          result.appendChild(make('tspan',tone));
          htone = Math.max(htone,(/[`,]/.exec(cmatch[rtg.whitespace])&&9.5)||0);
        } else {
          var toneId = parseInt(cmatch[rtg.tone]||cmatch[rtg.clef].slice(0,1),23)-10;
          if(cmatch[rtg.tone] && cmatch[rtg.tone].length == 1) {
            ltone = Math.min(ltone,toneId);
            htone = Math.max(htone,toneId);
            ftone = ftone || (!cmatch[rtg.accidental]&&toneId);
          } else {
            htone = Math.max(htone,(cmatch[rtg.clef]&&(parseInt(cmatch[rtg.clef].slice(-1))*2+2))||0);
          }
          tones.push({
            match: cmatch,
            index: toneId,
            relativeTone: previousToneId < 0? 0 : toneId - previousToneId,
            modifiers: cmatch[rtg.noteType],
            clef: cmatch[rtg.clef],
            episemaLoc:(cmatch[rtg.episema] && cmatch[rtg.episema].match(/0/))?-1:0,
            diamond: cmatch[rtg.toneUpper]? true: false,
            markings: cmatch[rtg.ictus] || cmatch[rtg.dot] || cmatch[rtg.episema],
            liq: cmatch[rtg.diminutiveLiquescentia]
          });
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
      startsWithAccidental:(tones.length>0&&tones[0].match[rtg.accidental])?true:false,
      mask:mask,
      clef:clef,
      mindy:minDy,
      ledger:(ltone<2 || htone > 10),
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
    },  commitTmpData=function(count){
      var tspan=make('tspan',tmpdata);
      if(count)tspan.setAttribute('count',count);
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
        base = indices.punctum,
        otherValue=undefined;

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
        commitTmpData();
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
            commitTmpData();
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
              tone.match[rtg.episema]=undefined;
            }
            if(tone.match[rtg.ictus]) {
              addIctus(tone.episemaLoc,tone.index);
              tone.match[rtg.ictus]=undefined;
            }
            commitTmpData();
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
                nextTone.match[rtg.episema]=undefined;
              }
              if(nextTone.match[rtg.ictus]) {
                addIctus(nextTone.episemaLoc,nextTone.index);
                nextTone.match[rtg.ictus]=undefined;
              }
              commitTmpData();
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
            //otherValue = tone.index;
          }
          commitTmpData();
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
            commitTmpData();
            tmpdata += neume(indices.connecting_line,nextTone.index,tone.index);
            base=undefined;
          } else {
            tmpdata += neume(indices.porrectus,tone.index,nextTone.index);
            commitTmpData(2);
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
            commitTmpData();
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
              tone.match[rtg.episema]=undefined;
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
            commitTmpData();
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
    var temp;
    if(otherValue){
      temp = neume(base,otherValue,tone.index);
    } else {
      temp = neume(base,tone.index);
    } 
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
    if(temp>1 || (tonesInGlyph>1 && (temp=nextTone.match[rtg.dot]))) {
      if(nextTone.index==lo) {
        tmpdata+=neume(indices.dot,lo-1);
      } else {
        tmpdata+=neume(indices.dot,nextTone.index);
      }
    }
    if(temp && tones[i+1]) extraSpace += "--";
    tmpdata += extraSpace;
    commitTmpData((otherValue && base)?2:undefined);
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
    if(oldMask && oldMask.parentElement != defs) {
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
  var group = make('g');
  returnVal.setAttribute('id',systemId);
  group.setAttribute('id',staffId);
  group.setAttribute('mask','url(#' + maskId + ')');
  returnVal.setAttribute('transform', 'translate(0,'+y+')');
  var staff = make("use");
  staff.setAttributeNS(xlinkns, "href", "#staff");
  if(!width) width = $(svg.parentNode).width();
  staff.setAttribute("transform", "translate("+(x)+") scale(" + (width) + ",1)");
  group.appendChild(staff);
  returnVal.appendChild(group);
  result.appendChild(returnVal);
  return returnVal;
}

$(function() {
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
  tmp2.setAttribute('offset','25%');
  tmp2.setAttribute('stop-color','#e22');
  tmp.appendChild(tmp2);
  tmp2=make('stop');
  tmp2.setAttribute('offset','90%');
  tmp2.setAttribute('stop-color','#000');
  tmp.appendChild(tmp2);
  _defs.appendChild(tmp);
  tmp=make('linearGradient');
  tmp.setAttribute('gradientUnits','objectBoundingBox');
  tmp.setAttribute('id','gradBlackRed');
  var tmp2=make('stop');
  tmp2.setAttribute('offset','10%');
  tmp2.setAttribute('stop-color','#000');
  tmp.appendChild(tmp2);
  tmp2=make('stop');
  tmp2.setAttribute('offset','75%');
  tmp2.setAttribute('stop-color','#e22');
  tmp.appendChild(tmp2);
  _defs.appendChild(tmp);
  
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
    var selectPunctum=function(punctumToSelect){
      punctumToSelect=parseInt(punctumToSelect);
      if(punctumToSelect<0)punctumToSelect=-1;
      if(punctumToSelect==selectedPunctum)return;
      var punctumOffset=0,
          punctum;
      if(punctumToSelect<0) {
        punctum=$();
      } else {
        punctum=$(svg).find("#punctum"+punctumToSelect);
        if(punctum.length==0){
          punctumOffset=1;
          --punctumToSelect;
          punctum=$(svg).find("#punctum"+punctumToSelect);
          if(punctum.length==0 || punctum.attr("count")!=2)
            return;
        }
      }
      selectedPunctum=punctumToSelect+punctumOffset;
      var tmp=punctum.parent().attr("id");
        if(tmp)tmp = /neume(\d+)/i.exec(tmp);
        selectedNeume = tmp?parseInt(tmp[1]):-1;
      $(svg).find(".selectable").attr({"class":"selectable",style:""});
      punctum.attr("class","selectable selected" + (punctum.attr("count")==2?"-"+(1+punctumOffset):""))
        .attr("style",punctum.attr("count")==2?"fill:url(#grad"+(punctumOffset==0?"RedBlack":"BlackRed")+")":"");
      console.info("Selected: " + selectedPunctum);
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
      if(e.target.tagName.match(/textarea|input/i)){
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
        }
        selectNeume(neumeToSelect);
      } else {
        switch(e.which){
          case 37: // left;
            --punctumToSelect;
            break;
          case 39: // right
            ++punctumToSelect;
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
  $(window).resize(updateAllChant);
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
