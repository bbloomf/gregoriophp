(function(e){function d(k,j,i,h){var f=d.sinks,g;for(g in f){if(f.hasOwnProperty(g)&&f[g].enabled){try{return new f[g](k,j,i,h)}catch(l){}}}throw"No audio sink available."}function c(f){this.boundTo=f;this.buffers=[];f.activeRecordings.push(this)}c.prototype={add:function(f){this.buffers.push(f)},clear:function(){this.buffers=[]},stop:function(){var f=this.boundTo.activeRecordings,g;for(g=0;g<f.length;g++){if(f[g]===this){f.splice(g--,1)}}},join:function(){var k=0,m=0,h=this.buffers,f,o,j,g=h.length;for(j=0;j<g;j++){k+=h[j].length}f=new Float32Array(k);for(j=0;j<g;j++){for(o=0;o<h[j].length;o++){f[m+o]=h[j][o]}m+=h[j].length}return f}};function b(){}d.SinkClass=b;b.prototype={sampleRate:44100,channelCount:2,preBufferSize:4096,writePosition:0,writeMode:"async",channelMode:"interleaved",previousHit:0,ringBuffer:null,ringOffset:0,start:function(i,h,g,f){this.channelCount=isNaN(h)?this.channelCount:h;this.preBufferSize=isNaN(g)?this.preBufferSize:g;this.sampleRate=isNaN(f)?this.sampleRate:f;this.readFn=i;this.activeRecordings=[];this.previousHit=+new Date;this.asyncBuffers=[];this.syncBuffers=[]},process:function(g,h){this.ringBuffer&&(this.channelMode==="interleaved"?this.ringSpin:this.ringSpinInterleaved).apply(this,arguments);this.writeBuffersSync.apply(this,arguments);if(this.readFn){if(this.channelMode==="interleaved"){this.readFn.apply(this,arguments)}else{var f=d.deinterleave(g,this.channelCount);this.readFn.apply(this,[f].concat([].slice.call(arguments,1)));d.interleave(f,this.channelCount,g)}}this.writeBuffersAsync.apply(this,arguments);this.recordData.apply(this,arguments);this.previousHit=+new Date;this.writePosition+=g.length/h},record:function(){return new c(this)},recordData:function(g){var j=this.activeRecordings,h,f=j.length;for(h=0;h<f;h++){j[h].add(g)}},writeBuffersAsync:function(h){var g=this.asyncBuffers,f=h.length,j,m,k,p,o;if(g){for(k=0;k<g.length;k++){j=g[k];m=j.b.length;o=j.d;j.d-=Math.min(o,f);for(p=0;p+o<f&&p<m;p++){h[p+o]+=j.b[p]}j.b=j.b.subarray(p+o);k>=m&&g.splice(k--,1)}}},writeBuffersSync:function(h){var g=this.syncBuffers,f=h.length,j=0,k=0;for(;j<f&&g.length;j++){h[j]+=g[0][k];if(g[0].length<=k){g.splice(0,1);k=0;continue}k++}if(g.length){g[0]=g[0].subarray(k)}},writeBufferAsync:function(g,h){g=this.mode==="deinterleaved"?d.interleave(g,this.channelCount):g;var f=this.asyncBuffers;f.push({b:g,d:isNaN(h)?~~((+new Date-this.previousHit)/1000*this.sampleRate):h});return f.length},writeBufferSync:function(g){g=this.mode==="deinterleaved"?d.interleave(g,this.channelCount):g;var f=this.syncBuffers;f.push(g);return f.length},writeBuffer:function(){this[this.writeMode==="async"?"writeBufferAsync":"writeBufferSync"].apply(this,arguments)},getSyncWriteOffset:function(){var f=this.syncBuffers,h=0,g;for(g=0;g<f.length;g++){h+=f[g].length}return h},getPlaybackTime:function(){return this.writePosition-this.preBufferSize},ringSpin:function(h){var j=this.ringBuffer,g=h.length,f=j.length,n=this.ringOffset,k;for(k=0;k<g;k++){h[k]+=j[n];n=(n+1)%f}this.ringOffset=n},ringSpinDeinterleaved:function(p){var o=this.ringBuffer,k=p.length,f=o.length,j=o[0].length,r=f*j,h=this.ringOffset,q,g;for(q=0;q<k;q+=f){for(g=0;g<f;g++){p[q+g]+=o[g][h]}h=(h+1)%j}this.ringOffset=g}};function a(i,h,f,g){f=f||h.prototype;h.prototype=new d.SinkClass();h.prototype.type=i;h.enabled=!g;for(g in f){if(f.hasOwnProperty(g)){h.prototype[g]=f[g]}}a[i]=h}a("moz",function(){var o=this,h=0,n=null,m=new Audio(),l,k,i,j,f;o.start.apply(o,arguments);o.preBufferSize=isNaN(arguments[2])?o.sampleRate/2:o.preBufferSize;function g(){if(n){l=m.mozWriteAudio(n);h+=l;if(l<n.length){n=n.subarray(l);return n}n=null}k=m.mozCurrentSampleOffset();i=Number(k+o.preBufferSize*o.channelCount-h);if(i>0){j=new Float32Array(i);o.process(j,o.channelCount);l=m.mozWriteAudio(j);if(l<j.length){n=j.subarray(l)}h+=l}}m.mozSetup(o.channelCount,o.sampleRate);o.kill=d.doInterval(g,20);o._bufferFill=g;o._audio=m},{getPlaybackTime:function(){return this._audio.mozCurrentSampleOffset()/this.channelCount}});a("webkit",function(m,k,i,h){var f=this,j=new (window.AudioContext||webkitAudioContext)(),l=j.createJavaScriptNode(i,0,k);f.start.apply(f,arguments);function g(v){var o=v.outputBuffer,r=o.numberOfChannels,t,q,s=o.length,w=o.size,u=new Array(r),p=new Float32Array(s*r);for(t=0;t<r;t++){u[t]=o.getChannelData(t)}f.process(p,f.channelCount);for(t=0;t<s;t++){for(q=0;q<r;q++){u[q][t]=p[t*f.channelCount+q]}}}l.onaudioprocess=g;l.connect(j.destination);f.sampleRate=j.sampleRate;f._context=j;f._node=l;f._callback=g},{kill:function(){},getPlaybackTime:function(){return this._context.currentTime*this.sampleRate},});a("dummy",function(){var f=this;f.start.apply(f,arguments);function g(){var h=new Float32Array(f.preBufferSize*f.channelCount);f.process(h,f.channelCount)}f.kill=d.doInterval(g,f.preBufferSize/f.sampleRate*1000);f._callback=g},null,true);d.sinks=d.devices=a;d.Recording=c;d.doInterval=function(l,h){var g=typeof window==="undefined"?undefined:window.MozBlobBuilder||window.WebKitBlobBuilder||window.MSBlobBuilder||window.OBlobBuilder||window.BlobBuilder,k,j,f;if((d.doInterval.backgroundWork||d.devices.moz.backgroundWork)&&g){try{f=new g();f.append('setInterval(function(){ postMessage("tic"); }, '+h+");");j=(window.MozURL||window.webkitURL||window.MSURL||window.OURL||window.URL).createObjectURL(f.getBlob());k=new Worker(j);k.onmessage=function(){l()};return function(){k.terminate();(window.MozURL||window.webkitURL||window.MSURL||window.OURL||window.URL).revokeObjectURL(j)}}catch(i){}}k=setInterval(l,h);return function(){clearInterval(k)}};d.doInterval.backgroundWork=true;(function(){function f(g,h){if(g&&h){f[g]=h}else{if(g&&f[g] instanceof Function){d.interpolate=f[g]}}return f[g]}d.interpolation=f;f("linear",function(g,k){var j=Math.floor(k),i=j+1,h=k-j;i=i<g.length?i:0;return g[j]*(1-h)+g[i]*h});f("nearest",function(g,h){return h>=g.length-0.5?g[0]:g[Math.round(h)]});f("linear")}());d.resample=function(p,f,s,t,h){var o=arguments.length,k=o===2?f:o===3?f/s:t/f*h/s,m=p.length,g=Math.ceil(m/k),r=new Float32Array(g),q,j;for(q=0,j=0;q<m;q+=k){r[j++]=d.interpolate(p,q)}return r};d.deinterleave=function(g,m){var f=g.length,k=f/m,h=[],j,o;for(j=0;j<m;j++){h[j]=new Float32Array(k);for(o=0;o<k;o++){h[j][o]=g[o*m+j]}}return h};d.interleave=function(h,m,g){m=m||h.length;var f=h[0].length,k=h.length,j,o;g=g||new Float32Array(f*m);for(j=0;j<k;j++){for(o=0;o<f;o++){g[j+o*m]=h[j][o]}}return g};d.mix=function(h){var g=[].slice.call(arguments,1),f,j,k;for(k=0;k<g.length;k++){f=Math.max(h.length,g[k].length);for(j=0;j<f;j++){h[j]+=g[k][j]}}return h};d.resetBuffer=function(g){var f=g.length,h;for(h=0;h<f;h++){g[h]=0}return g};d.clone=function(h,f){var g=h.length,j;f=f||new Float32Array(g);for(j=0;j<g;j++){f[j]=h[j]}return f};d.createDeinterleaved=function(j,h){var f=new Array(h),g;for(g=0;g<h;g++){f[g]=new Float32Array(j)}return f};e.Sink=d}(function(){return this}()));