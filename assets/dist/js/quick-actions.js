(()=>{var e={2151:e=>{var t={utf8:{stringToBytes:function(e){return t.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(t.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],r=0;r<e.length;r++)t.push(255&e.charCodeAt(r));return t},bytesToString:function(e){for(var t=[],r=0;r<e.length;r++)t.push(String.fromCharCode(e[r]));return t.join("")}}};e.exports=t},3939:e=>{var t,r;t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&r.rotl(e,8)|4278255360&r.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=r.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],r=0,i=0;r<e.length;r++,i+=8)t[i>>>5]|=e[r]<<24-i%32;return t},wordsToBytes:function(e){for(var t=[],r=0;r<32*e.length;r+=8)t.push(e[r>>>5]>>>24-r%32&255);return t},bytesToHex:function(e){for(var t=[],r=0;r<e.length;r++)t.push((e[r]>>>4).toString(16)),t.push((15&e[r]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],r=0;r<e.length;r+=2)t.push(parseInt(e.substr(r,2),16));return t},bytesToBase64:function(e){for(var r=[],i=0;i<e.length;i+=3)for(var o=e[i]<<16|e[i+1]<<8|e[i+2],n=0;n<4;n++)8*i+6*n<=8*e.length?r.push(t.charAt(o>>>6*(3-n)&63)):r.push("=");return r.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var r=[],i=0,o=0;i<e.length;o=++i%4)0!=o&&r.push((t.indexOf(e.charAt(i-1))&Math.pow(2,-2*o+8)-1)<<2*o|t.indexOf(e.charAt(i))>>>6-2*o);return r}},e.exports=r},7206:e=>{function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(t(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}(e)||!!e._isBuffer)}},1549:(e,t,r)=>{var i=r(2032),o=r(3862),n=r(6721),a=r(2749),s=r(5749);function u(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var i=e[t];this.set(i[0],i[1])}}u.prototype.clear=i,u.prototype.delete=o,u.prototype.get=n,u.prototype.has=a,u.prototype.set=s,e.exports=u},79:(e,t,r)=>{var i=r(3702),o=r(80),n=r(4739),a=r(8655),s=r(1175);function u(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var i=e[t];this.set(i[0],i[1])}}u.prototype.clear=i,u.prototype.delete=o,u.prototype.get=n,u.prototype.has=a,u.prototype.set=s,e.exports=u},8223:(e,t,r)=>{var i=r(6110)(r(9325),"Map");e.exports=i},3661:(e,t,r)=>{var i=r(3040),o=r(7670),n=r(289),a=r(4509),s=r(2949);function u(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var i=e[t];this.set(i[0],i[1])}}u.prototype.clear=i,u.prototype.delete=o,u.prototype.get=n,u.prototype.has=a,u.prototype.set=s,e.exports=u},1873:(e,t,r)=>{var i=r(9325).Symbol;e.exports=i},1033:e=>{e.exports=function(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}},4932:e=>{e.exports=function(e,t){for(var r=-1,i=null==e?0:e.length,o=Array(i);++r<i;)o[r]=t(e[r],r,e);return o}},4528:e=>{e.exports=function(e,t){for(var r=-1,i=t.length,o=e.length;++r<i;)e[o+r]=t[r];return e}},6547:(e,t,r)=>{var i=r(3360),o=r(5288),n=Object.prototype.hasOwnProperty;e.exports=function(e,t,r){var a=e[t];n.call(e,t)&&o(a,r)&&(void 0!==r||t in e)||i(e,t,r)}},6025:(e,t,r)=>{var i=r(5288);e.exports=function(e,t){for(var r=e.length;r--;)if(i(e[r][0],t))return r;return-1}},3360:(e,t,r)=>{var i=r(3243);e.exports=function(e,t,r){"__proto__"==t&&i?i(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r}},3120:(e,t,r)=>{var i=r(4528),o=r(5891);e.exports=function e(t,r,n,a,s){var u=-1,c=t.length;for(n||(n=o),s||(s=[]);++u<c;){var l=t[u];r>0&&n(l)?r>1?e(l,r-1,n,a,s):i(s,l):a||(s[s.length]=l)}return s}},7422:(e,t,r)=>{var i=r(1769),o=r(7797);e.exports=function(e,t){for(var r=0,n=(t=i(t,e)).length;null!=e&&r<n;)e=e[o(t[r++])];return r&&r==n?e:void 0}},2552:(e,t,r)=>{var i=r(1873),o=r(659),n=r(9350),a=i?i.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":a&&a in Object(e)?o(e):n(e)}},8077:e=>{e.exports=function(e,t){return null!=e&&t in Object(e)}},7534:(e,t,r)=>{var i=r(2552),o=r(346);e.exports=function(e){return o(e)&&"[object Arguments]"==i(e)}},5083:(e,t,r)=>{var i=r(1882),o=r(7296),n=r(3805),a=r(7473),s=/^\[object .+?Constructor\]$/,u=Function.prototype,c=Object.prototype,l=u.toString,p=c.hasOwnProperty,b=RegExp("^"+l.call(p).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=function(e){return!(!n(e)||o(e))&&(i(e)?b:s).test(a(e))}},6001:(e,t,r)=>{var i=r(7420),o=r(631);e.exports=function(e,t){return i(e,t,(function(t,r){return o(e,r)}))}},7420:(e,t,r)=>{var i=r(7422),o=r(3170),n=r(1769);e.exports=function(e,t,r){for(var a=-1,s=t.length,u={};++a<s;){var c=t[a],l=i(e,c);r(l,c)&&o(u,n(c,e),l)}return u}},3170:(e,t,r)=>{var i=r(6547),o=r(1769),n=r(361),a=r(3805),s=r(7797);e.exports=function(e,t,r,u){if(!a(e))return e;for(var c=-1,l=(t=o(t,e)).length,p=l-1,b=e;null!=b&&++c<l;){var d=s(t[c]),f=r;if("__proto__"===d||"constructor"===d||"prototype"===d)return e;if(c!=p){var w=b[d];void 0===(f=u?u(w,d,b):void 0)&&(f=a(w)?w:n(t[c+1])?[]:{})}i(b,d,f),b=b[d]}return e}},9570:(e,t,r)=>{var i=r(7334),o=r(3243),n=r(3488),a=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:i(t),writable:!0})}:n;e.exports=a},7556:(e,t,r)=>{var i=r(1873),o=r(4932),n=r(6449),a=r(4394),s=i?i.prototype:void 0,u=s?s.toString:void 0;e.exports=function e(t){if("string"==typeof t)return t;if(n(t))return o(t,e)+"";if(a(t))return u?u.call(t):"";var r=t+"";return"0"==r&&1/t==-1/0?"-0":r}},1769:(e,t,r)=>{var i=r(6449),o=r(8586),n=r(1802),a=r(3222);e.exports=function(e,t){return i(e)?e:o(e,t)?[e]:n(a(e))}},5481:(e,t,r)=>{var i=r(9325)["__core-js_shared__"];e.exports=i},3243:(e,t,r)=>{var i=r(6110),o=function(){try{var e=i(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},8816:(e,t,r)=>{var i=r(5970),o=r(6757),n=r(2865);e.exports=function(e){return n(o(e,void 0,i),e+"")}},4840:(e,t,r)=>{var i="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g;e.exports=i},2651:(e,t,r)=>{var i=r(4218);e.exports=function(e,t){var r=e.__data__;return i(t)?r["string"==typeof t?"string":"hash"]:r.map}},6110:(e,t,r)=>{var i=r(5083),o=r(392);e.exports=function(e,t){var r=o(e,t);return i(r)?r:void 0}},659:(e,t,r)=>{var i=r(1873),o=Object.prototype,n=o.hasOwnProperty,a=o.toString,s=i?i.toStringTag:void 0;e.exports=function(e){var t=n.call(e,s),r=e[s];try{e[s]=void 0;var i=!0}catch(e){}var o=a.call(e);return i&&(t?e[s]=r:delete e[s]),o}},392:e=>{e.exports=function(e,t){return null==e?void 0:e[t]}},9326:(e,t,r)=>{var i=r(1769),o=r(2428),n=r(6449),a=r(361),s=r(294),u=r(7797);e.exports=function(e,t,r){for(var c=-1,l=(t=i(t,e)).length,p=!1;++c<l;){var b=u(t[c]);if(!(p=null!=e&&r(e,b)))break;e=e[b]}return p||++c!=l?p:!!(l=null==e?0:e.length)&&s(l)&&a(b,l)&&(n(e)||o(e))}},2032:(e,t,r)=>{var i=r(1042);e.exports=function(){this.__data__=i?i(null):{},this.size=0}},3862:e=>{e.exports=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}},6721:(e,t,r)=>{var i=r(1042),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;if(i){var r=t[e];return"__lodash_hash_undefined__"===r?void 0:r}return o.call(t,e)?t[e]:void 0}},2749:(e,t,r)=>{var i=r(1042),o=Object.prototype.hasOwnProperty;e.exports=function(e){var t=this.__data__;return i?void 0!==t[e]:o.call(t,e)}},5749:(e,t,r)=>{var i=r(1042);e.exports=function(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=i&&void 0===t?"__lodash_hash_undefined__":t,this}},5891:(e,t,r)=>{var i=r(1873),o=r(2428),n=r(6449),a=i?i.isConcatSpreadable:void 0;e.exports=function(e){return n(e)||o(e)||!!(a&&e&&e[a])}},361:e=>{var t=/^(?:0|[1-9]\d*)$/;e.exports=function(e,r){var i=typeof e;return!!(r=null==r?9007199254740991:r)&&("number"==i||"symbol"!=i&&t.test(e))&&e>-1&&e%1==0&&e<r}},8586:(e,t,r)=>{var i=r(6449),o=r(4394),n=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,a=/^\w*$/;e.exports=function(e,t){if(i(e))return!1;var r=typeof e;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=e&&!o(e))||a.test(e)||!n.test(e)||null!=t&&e in Object(t)}},4218:e=>{e.exports=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}},7296:(e,t,r)=>{var i,o=r(5481),n=(i=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+i:"";e.exports=function(e){return!!n&&n in e}},3702:e=>{e.exports=function(){this.__data__=[],this.size=0}},80:(e,t,r)=>{var i=r(6025),o=Array.prototype.splice;e.exports=function(e){var t=this.__data__,r=i(t,e);return!(r<0||(r==t.length-1?t.pop():o.call(t,r,1),--this.size,0))}},4739:(e,t,r)=>{var i=r(6025);e.exports=function(e){var t=this.__data__,r=i(t,e);return r<0?void 0:t[r][1]}},8655:(e,t,r)=>{var i=r(6025);e.exports=function(e){return i(this.__data__,e)>-1}},1175:(e,t,r)=>{var i=r(6025);e.exports=function(e,t){var r=this.__data__,o=i(r,e);return o<0?(++this.size,r.push([e,t])):r[o][1]=t,this}},3040:(e,t,r)=>{var i=r(1549),o=r(79),n=r(8223);e.exports=function(){this.size=0,this.__data__={hash:new i,map:new(n||o),string:new i}}},7670:(e,t,r)=>{var i=r(2651);e.exports=function(e){var t=i(this,e).delete(e);return this.size-=t?1:0,t}},289:(e,t,r)=>{var i=r(2651);e.exports=function(e){return i(this,e).get(e)}},4509:(e,t,r)=>{var i=r(2651);e.exports=function(e){return i(this,e).has(e)}},2949:(e,t,r)=>{var i=r(2651);e.exports=function(e,t){var r=i(this,e),o=r.size;return r.set(e,t),this.size+=r.size==o?0:1,this}},2224:(e,t,r)=>{var i=r(104);e.exports=function(e){var t=i(e,(function(e){return 500===r.size&&r.clear(),e})),r=t.cache;return t}},1042:(e,t,r)=>{var i=r(6110)(Object,"create");e.exports=i},9350:e=>{var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},6757:(e,t,r)=>{var i=r(1033),o=Math.max;e.exports=function(e,t,r){return t=o(void 0===t?e.length-1:t,0),function(){for(var n=arguments,a=-1,s=o(n.length-t,0),u=Array(s);++a<s;)u[a]=n[t+a];a=-1;for(var c=Array(t+1);++a<t;)c[a]=n[a];return c[t]=r(u),i(e,this,c)}}},9325:(e,t,r)=>{var i=r(4840),o="object"==typeof self&&self&&self.Object===Object&&self,n=i||o||Function("return this")();e.exports=n},2865:(e,t,r)=>{var i=r(9570),o=r(1811)(i);e.exports=o},1811:e=>{var t=Date.now;e.exports=function(e){var r=0,i=0;return function(){var o=t(),n=16-(o-i);if(i=o,n>0){if(++r>=800)return arguments[0]}else r=0;return e.apply(void 0,arguments)}}},1802:(e,t,r)=>{var i=r(2224),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,n=/\\(\\)?/g,a=i((function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(o,(function(e,r,i,o){t.push(i?o.replace(n,"$1"):r||e)})),t}));e.exports=a},7797:(e,t,r)=>{var i=r(4394);e.exports=function(e){if("string"==typeof e||i(e))return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t}},7473:e=>{var t=Function.prototype.toString;e.exports=function(e){if(null!=e){try{return t.call(e)}catch(e){}try{return e+""}catch(e){}}return""}},7334:e=>{e.exports=function(e){return function(){return e}}},5288:e=>{e.exports=function(e,t){return e===t||e!=e&&t!=t}},5970:(e,t,r)=>{var i=r(3120);e.exports=function(e){return null!=e&&e.length?i(e,1):[]}},631:(e,t,r)=>{var i=r(8077),o=r(9326);e.exports=function(e,t){return null!=e&&o(e,t,i)}},3488:e=>{e.exports=function(e){return e}},2428:(e,t,r)=>{var i=r(7534),o=r(346),n=Object.prototype,a=n.hasOwnProperty,s=n.propertyIsEnumerable,u=i(function(){return arguments}())?i:function(e){return o(e)&&a.call(e,"callee")&&!s.call(e,"callee")};e.exports=u},6449:e=>{var t=Array.isArray;e.exports=t},1882:(e,t,r)=>{var i=r(2552),o=r(3805);e.exports=function(e){if(!o(e))return!1;var t=i(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t}},294:e=>{e.exports=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991}},3805:e=>{e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},346:e=>{e.exports=function(e){return null!=e&&"object"==typeof e}},4394:(e,t,r)=>{var i=r(2552),o=r(346);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==i(e)}},104:(e,t,r)=>{var i=r(3661);function o(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var r=function(){var i=arguments,o=t?t.apply(this,i):i[0],n=r.cache;if(n.has(o))return n.get(o);var a=e.apply(this,i);return r.cache=n.set(o,a)||n,a};return r.cache=new(o.Cache||i),r}o.Cache=i,e.exports=o},4383:(e,t,r)=>{var i=r(6001),o=r(8816)((function(e,t){return null==e?{}:i(e,t)}));e.exports=o},3222:(e,t,r)=>{var i=r(7556);e.exports=function(e){return null==e?"":i(e)}},3503:(e,t,r)=>{var i,o,n,a,s;i=r(3939),o=r(2151).utf8,n=r(7206),a=r(2151).bin,s=function(e,t){e.constructor==String?e=t&&"binary"===t.encoding?a.stringToBytes(e):o.stringToBytes(e):n(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var r=i.bytesToWords(e),u=8*e.length,c=1732584193,l=-271733879,p=-1732584194,b=271733878,d=0;d<r.length;d++)r[d]=16711935&(r[d]<<8|r[d]>>>24)|4278255360&(r[d]<<24|r[d]>>>8);r[u>>>5]|=128<<u%32,r[14+(u+64>>>9<<4)]=u;var f=s._ff,w=s._gg,v=s._hh,h=s._ii;for(d=0;d<r.length;d+=16){var m=c,g=l,y=p,x=b;c=f(c,l,p,b,r[d+0],7,-680876936),b=f(b,c,l,p,r[d+1],12,-389564586),p=f(p,b,c,l,r[d+2],17,606105819),l=f(l,p,b,c,r[d+3],22,-1044525330),c=f(c,l,p,b,r[d+4],7,-176418897),b=f(b,c,l,p,r[d+5],12,1200080426),p=f(p,b,c,l,r[d+6],17,-1473231341),l=f(l,p,b,c,r[d+7],22,-45705983),c=f(c,l,p,b,r[d+8],7,1770035416),b=f(b,c,l,p,r[d+9],12,-1958414417),p=f(p,b,c,l,r[d+10],17,-42063),l=f(l,p,b,c,r[d+11],22,-1990404162),c=f(c,l,p,b,r[d+12],7,1804603682),b=f(b,c,l,p,r[d+13],12,-40341101),p=f(p,b,c,l,r[d+14],17,-1502002290),c=w(c,l=f(l,p,b,c,r[d+15],22,1236535329),p,b,r[d+1],5,-165796510),b=w(b,c,l,p,r[d+6],9,-1069501632),p=w(p,b,c,l,r[d+11],14,643717713),l=w(l,p,b,c,r[d+0],20,-373897302),c=w(c,l,p,b,r[d+5],5,-701558691),b=w(b,c,l,p,r[d+10],9,38016083),p=w(p,b,c,l,r[d+15],14,-660478335),l=w(l,p,b,c,r[d+4],20,-405537848),c=w(c,l,p,b,r[d+9],5,568446438),b=w(b,c,l,p,r[d+14],9,-1019803690),p=w(p,b,c,l,r[d+3],14,-187363961),l=w(l,p,b,c,r[d+8],20,1163531501),c=w(c,l,p,b,r[d+13],5,-1444681467),b=w(b,c,l,p,r[d+2],9,-51403784),p=w(p,b,c,l,r[d+7],14,1735328473),c=v(c,l=w(l,p,b,c,r[d+12],20,-1926607734),p,b,r[d+5],4,-378558),b=v(b,c,l,p,r[d+8],11,-2022574463),p=v(p,b,c,l,r[d+11],16,1839030562),l=v(l,p,b,c,r[d+14],23,-35309556),c=v(c,l,p,b,r[d+1],4,-1530992060),b=v(b,c,l,p,r[d+4],11,1272893353),p=v(p,b,c,l,r[d+7],16,-155497632),l=v(l,p,b,c,r[d+10],23,-1094730640),c=v(c,l,p,b,r[d+13],4,681279174),b=v(b,c,l,p,r[d+0],11,-358537222),p=v(p,b,c,l,r[d+3],16,-722521979),l=v(l,p,b,c,r[d+6],23,76029189),c=v(c,l,p,b,r[d+9],4,-640364487),b=v(b,c,l,p,r[d+12],11,-421815835),p=v(p,b,c,l,r[d+15],16,530742520),c=h(c,l=v(l,p,b,c,r[d+2],23,-995338651),p,b,r[d+0],6,-198630844),b=h(b,c,l,p,r[d+7],10,1126891415),p=h(p,b,c,l,r[d+14],15,-1416354905),l=h(l,p,b,c,r[d+5],21,-57434055),c=h(c,l,p,b,r[d+12],6,1700485571),b=h(b,c,l,p,r[d+3],10,-1894986606),p=h(p,b,c,l,r[d+10],15,-1051523),l=h(l,p,b,c,r[d+1],21,-2054922799),c=h(c,l,p,b,r[d+8],6,1873313359),b=h(b,c,l,p,r[d+15],10,-30611744),p=h(p,b,c,l,r[d+6],15,-1560198380),l=h(l,p,b,c,r[d+13],21,1309151649),c=h(c,l,p,b,r[d+4],6,-145523070),b=h(b,c,l,p,r[d+11],10,-1120210379),p=h(p,b,c,l,r[d+2],15,718787259),l=h(l,p,b,c,r[d+9],21,-343485551),c=c+m>>>0,l=l+g>>>0,p=p+y>>>0,b=b+x>>>0}return i.endian([c,l,p,b])},s._ff=function(e,t,r,i,o,n,a){var s=e+(t&r|~t&i)+(o>>>0)+a;return(s<<n|s>>>32-n)+t},s._gg=function(e,t,r,i,o,n,a){var s=e+(t&i|r&~i)+(o>>>0)+a;return(s<<n|s>>>32-n)+t},s._hh=function(e,t,r,i,o,n,a){var s=e+(t^r^i)+(o>>>0)+a;return(s<<n|s>>>32-n)+t},s._ii=function(e,t,r,i,o,n,a){var s=e+(r^(t|~i))+(o>>>0)+a;return(s<<n|s>>>32-n)+t},s._blocksize=16,s._digestsize=16,e.exports=function(e,t){if(null==e)throw new Error("Illegal argument "+e);var r=i.wordsToBytes(s(e,t));return t&&t.asBytes?r:t&&t.asString?a.bytesToString(r):i.bytesToHex(r)}},7232:function(e,t,r){var i;!function(o,n){"use strict";var a="function",s="undefined",u="object",c="string",l="major",p="model",b="name",d="type",f="vendor",w="version",v="architecture",h="console",m="mobile",g="tablet",y="smarttv",x="wearable",_="embedded",k="Amazon",T="Apple",S="ASUS",j="BlackBerry",O="Browser",A="Chrome",z="Firefox",P="Google",N="Huawei",B="LG",E="Microsoft",q="Motorola",C="Opera",U="Samsung",M="Sharp",I="Sony",R="Xiaomi",D="Zebra",$="Facebook",F="Chromium OS",L="Mac OS",V=" Browser",G=function(e){for(var t={},r=0;r<e.length;r++)t[e[r].toUpperCase()]=e[r];return t},H=function(e,t){return typeof e===c&&-1!==W(t).indexOf(W(e))},W=function(e){return e.toLowerCase()},Z=function(e,t){if(typeof e===c)return e=e.replace(/^\s\s*/,""),typeof t===s?e:e.substring(0,500)},J=function(e,t){for(var r,i,o,s,c,l,p=0;p<t.length&&!c;){var b=t[p],d=t[p+1];for(r=i=0;r<b.length&&!c&&b[r];)if(c=b[r++].exec(e))for(o=0;o<d.length;o++)l=c[++i],typeof(s=d[o])===u&&s.length>0?2===s.length?typeof s[1]==a?this[s[0]]=s[1].call(this,l):this[s[0]]=s[1]:3===s.length?typeof s[1]!==a||s[1].exec&&s[1].test?this[s[0]]=l?l.replace(s[1],s[2]):n:this[s[0]]=l?s[1].call(this,l,s[2]):n:4===s.length&&(this[s[0]]=l?s[3].call(this,l.replace(s[1],s[2])):n):this[s]=l||n;p+=2}},Q=function(e,t){for(var r in t)if(typeof t[r]===u&&t[r].length>0){for(var i=0;i<t[r].length;i++)if(H(t[r][i],e))return"?"===r?n:r}else if(H(t[r],e))return"?"===r?n:r;return t.hasOwnProperty("*")?t["*"]:e},X={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},K={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[w,[b,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[w,[b,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[b,w],[/opios[\/ ]+([\w\.]+)/i],[w,[b,C+" Mini"]],[/\bop(?:rg)?x\/([\w\.]+)/i],[w,[b,C+" GX"]],[/\bopr\/([\w\.]+)/i],[w,[b,C]],[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],[w,[b,"Baidu"]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,/(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio)\/([-\w\.]+)/i,/(heytap|ovi)browser\/([\d\.]+)/i,/(weibo)__([\d\.]+)/i],[b,w],[/quark(?:pc)?\/([-\w\.]+)/i],[w,[b,"Quark"]],[/\bddg\/([\w\.]+)/i],[w,[b,"DuckDuckGo"]],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[w,[b,"UC"+O]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i,/micromessenger\/([\w\.]+)/i],[w,[b,"WeChat"]],[/konqueror\/([\w\.]+)/i],[w,[b,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[w,[b,"IE"]],[/ya(?:search)?browser\/([\w\.]+)/i],[w,[b,"Yandex"]],[/slbrowser\/([\w\.]+)/i],[w,[b,"Smart Lenovo "+O]],[/(avast|avg)\/([\w\.]+)/i],[[b,/(.+)/,"$1 Secure "+O],w],[/\bfocus\/([\w\.]+)/i],[w,[b,z+" Focus"]],[/\bopt\/([\w\.]+)/i],[w,[b,C+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[w,[b,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[w,[b,"Dolphin"]],[/coast\/([\w\.]+)/i],[w,[b,C+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[w,[b,"MIUI "+O]],[/fxios\/([-\w\.]+)/i],[w,[b,z]],[/\bqihu|(qi?ho?o?|360)browser/i],[[b,"360"+V]],[/\b(qq)\/([\w\.]+)/i],[[b,/(.+)/,"$1Browser"],w],[/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],[[b,/(.+)/,"$1"+V],w],[/samsungbrowser\/([\w\.]+)/i],[w,[b,U+" Internet"]],[/(comodo_dragon)\/([\w\.]+)/i],[[b,/_/g," "],w],[/metasr[\/ ]?([\d\.]+)/i],[w,[b,"Sogou Explorer"]],[/(sogou)mo\w+\/([\d\.]+)/i],[[b,"Sogou Mobile"],w],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i],[b,w],[/(lbbrowser|rekonq)/i,/\[(linkedin)app\]/i],[b],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[b,$],w],[/(Klarna)\/([\w\.]+)/i,/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(alipay)client\/([\w\.]+)/i,/(twitter)(?:and| f.+e\/([\w\.]+))/i,/(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i],[b,w],[/\bgsa\/([\w\.]+) .*safari\//i],[w,[b,"GSA"]],[/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],[w,[b,"TikTok"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[w,[b,A+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[b,A+" WebView"],w],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[w,[b,"Android "+O]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[b,w],[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],[w,[b,"Mobile Safari"]],[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],[w,b],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[b,[w,Q,{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(webkit|khtml)\/([\w\.]+)/i],[b,w],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[b,"Netscape"],w],[/(wolvic)\/([\w\.]+)/i],[b,w],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[w,[b,z+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i],[b,[w,/_/g,"."]],[/(cobalt)\/([\w\.]+)/i],[b,[w,/master.|lts./,""]]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[[v,"amd64"]],[/(ia32(?=;))/i],[[v,W]],[/((?:i[346]|x)86)[;\)]/i],[[v,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[v,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[v,"armhf"]],[/windows (ce|mobile); ppc;/i],[[v,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[v,/ower/,"",W]],[/(sun4\w)[;\)]/i],[[v,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[v,W]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[p,[f,U],[d,g]],[/\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]((?!sm-[lr])[-\w]+)/i,/sec-(sgh\w+)/i],[p,[f,U],[d,m]],[/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],[p,[f,T],[d,m]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[p,[f,T],[d,g]],[/(macintosh);/i],[p,[f,T]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[p,[f,M],[d,m]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[p,[f,N],[d,g]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[p,[f,N],[d,m]],[/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i],[[p,/_/g," "],[f,R],[d,m]],[/oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[p,/_/g," "],[f,R],[d,g]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[p,[f,"OPPO"],[d,m]],[/\b(opd2\d{3}a?) bui/i],[p,[f,"OPPO"],[d,g]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[p,[f,"Vivo"],[d,m]],[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],[p,[f,"Realme"],[d,m]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[p,[f,q],[d,m]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[p,[f,q],[d,g]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[p,[f,B],[d,g]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[p,[f,B],[d,m]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[p,[f,"Lenovo"],[d,g]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[p,/_/g," "],[f,"Nokia"],[d,m]],[/(pixel c)\b/i],[p,[f,P],[d,g]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[p,[f,P],[d,m]],[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[p,[f,I],[d,m]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[p,"Xperia Tablet"],[f,I],[d,g]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[p,[f,"OnePlus"],[d,m]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[p,[f,k],[d,g]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[p,/(.+)/g,"Fire Phone $1"],[f,k],[d,m]],[/(playbook);[-\w\),; ]+(rim)/i],[p,f,[d,g]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[p,[f,j],[d,m]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[p,[f,S],[d,g]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[p,[f,S],[d,m]],[/(nexus 9)/i],[p,[f,"HTC"],[d,g]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[f,[p,/_/g," "],[d,m]],[/droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])\w*(\)| bui)/i],[p,[f,"TCL"],[d,g]],[/(itel) ((\w+))/i],[[f,W],p,[d,Q,{tablet:["p10001l","w7001"],"*":"mobile"}]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[p,[f,"Acer"],[d,g]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[p,[f,"Meizu"],[d,m]],[/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],[p,[f,"Ulefone"],[d,m]],[/droid.+; (a(?:015|06[35]|142p?))/i],[p,[f,"Nothing"],[d,m]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[f,p,[d,m]],[/(kobo)\s(ereader|touch)/i,/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[f,p,[d,g]],[/(surface duo)/i],[p,[f,E],[d,g]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[p,[f,"Fairphone"],[d,m]],[/(u304aa)/i],[p,[f,"AT&T"],[d,m]],[/\bsie-(\w*)/i],[p,[f,"Siemens"],[d,m]],[/\b(rct\w+) b/i],[p,[f,"RCA"],[d,g]],[/\b(venue[\d ]{2,7}) b/i],[p,[f,"Dell"],[d,g]],[/\b(q(?:mv|ta)\w+) b/i],[p,[f,"Verizon"],[d,g]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[p,[f,"Barnes & Noble"],[d,g]],[/\b(tm\d{3}\w+) b/i],[p,[f,"NuVision"],[d,g]],[/\b(k88) b/i],[p,[f,"ZTE"],[d,g]],[/\b(nx\d{3}j) b/i],[p,[f,"ZTE"],[d,m]],[/\b(gen\d{3}) b.+49h/i],[p,[f,"Swiss"],[d,m]],[/\b(zur\d{3}) b/i],[p,[f,"Swiss"],[d,g]],[/\b((zeki)?tb.*\b) b/i],[p,[f,"Zeki"],[d,g]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[f,"Dragon Touch"],p,[d,g]],[/\b(ns-?\w{0,9}) b/i],[p,[f,"Insignia"],[d,g]],[/\b((nxa|next)-?\w{0,9}) b/i],[p,[f,"NextBook"],[d,g]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[f,"Voice"],p,[d,m]],[/\b(lvtel\-)?(v1[12]) b/i],[[f,"LvTel"],p,[d,m]],[/\b(ph-1) /i],[p,[f,"Essential"],[d,m]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[p,[f,"Envizen"],[d,g]],[/\b(trio[-\w\. ]+) b/i],[p,[f,"MachSpeed"],[d,g]],[/\btu_(1491) b/i],[p,[f,"Rotor"],[d,g]],[/(shield[\w ]+) b/i],[p,[f,"Nvidia"],[d,g]],[/(sprint) (\w+)/i],[f,p,[d,m]],[/(kin\.[onetw]{3})/i],[[p,/\./g," "],[f,E],[d,m]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[p,[f,D],[d,g]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[p,[f,D],[d,m]],[/smart-tv.+(samsung)/i],[f,[d,y]],[/hbbtv.+maple;(\d+)/i],[[p,/^/,"SmartTV"],[f,U],[d,y]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[f,B],[d,y]],[/(apple) ?tv/i],[f,[p,T+" TV"],[d,y]],[/crkey/i],[[p,A+"cast"],[f,P],[d,y]],[/droid.+aft(\w+)( bui|\))/i],[p,[f,k],[d,y]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[p,[f,M],[d,y]],[/(bravia[\w ]+)( bui|\))/i],[p,[f,I],[d,y]],[/(mitv-\w{5}) bui/i],[p,[f,R],[d,y]],[/Hbbtv.*(technisat) (.*);/i],[f,p,[d,y]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[f,Z],[p,Z],[d,y]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[d,y]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[f,p,[d,h]],[/droid.+; (shield) bui/i],[p,[f,"Nvidia"],[d,h]],[/(playstation [345portablevi]+)/i],[p,[f,I],[d,h]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[p,[f,E],[d,h]],[/\b(sm-[lr]\d\d[05][fnuw]?s?)\b/i],[p,[f,U],[d,x]],[/((pebble))app/i],[f,p,[d,x]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[p,[f,T],[d,x]],[/droid.+; (glass) \d/i],[p,[f,P],[d,x]],[/droid.+; (wt63?0{2,3})\)/i],[p,[f,D],[d,x]],[/(quest( \d| pro)?)/i],[p,[f,$],[d,x]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[f,[d,_]],[/(aeobc)\b/i],[p,[f,k],[d,_]],[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],[p,[d,m]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[p,[d,g]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[d,g]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[d,m]],[/(android[-\w\. ]{0,9});.+buil/i],[p,[f,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[w,[b,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[w,[b,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i,/\b(libweb)/i],[b,w],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[w,b]],os:[[/microsoft (windows) (vista|xp)/i],[b,w],[/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],[b,[w,Q,X]],[/windows nt 6\.2; (arm)/i,/windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,/(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[w,Q,X],[b,"Windows"]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,/cfnetwork\/.+darwin/i],[[w,/_/g,"."],[b,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[b,L],[w,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[w,b],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[b,w],[/\(bb(10);/i],[w,[b,j]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[w,[b,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[w,[b,z+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[w,[b,"webOS"]],[/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],[w,[b,"watchOS"]],[/crkey\/([\d\.]+)/i],[w,[b,A+"cast"]],[/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],[[b,F],w],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[b,w],[/(sunos) ?([\w\.\d]*)/i],[[b,"Solaris"],w],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,/(unix) ?([\w\.]*)/i],[b,w]]},Y=function(e,t){if(typeof e===u&&(t=e,e=n),!(this instanceof Y))return new Y(e,t).getResult();var r=typeof o!==s&&o.navigator?o.navigator:n,i=e||(r&&r.userAgent?r.userAgent:""),h=r&&r.userAgentData?r.userAgentData:n,y=t?function(e,t){var r={};for(var i in e)t[i]&&t[i].length%2==0?r[i]=t[i].concat(e[i]):r[i]=e[i];return r}(K,t):K,x=r&&r.userAgent==i;return this.getBrowser=function(){var e,t={};return t[b]=n,t[w]=n,J.call(t,i,y.browser),t[l]=typeof(e=t[w])===c?e.replace(/[^\d\.]/g,"").split(".")[0]:n,x&&r&&r.brave&&typeof r.brave.isBrave==a&&(t[b]="Brave"),t},this.getCPU=function(){var e={};return e[v]=n,J.call(e,i,y.cpu),e},this.getDevice=function(){var e={};return e[f]=n,e[p]=n,e[d]=n,J.call(e,i,y.device),x&&!e[d]&&h&&h.mobile&&(e[d]=m),x&&"Macintosh"==e[p]&&r&&typeof r.standalone!==s&&r.maxTouchPoints&&r.maxTouchPoints>2&&(e[p]="iPad",e[d]=g),e},this.getEngine=function(){var e={};return e[b]=n,e[w]=n,J.call(e,i,y.engine),e},this.getOS=function(){var e={};return e[b]=n,e[w]=n,J.call(e,i,y.os),x&&!e[b]&&h&&h.platform&&"Unknown"!=h.platform&&(e[b]=h.platform.replace(/chrome os/i,F).replace(/macos/i,L)),e},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return i},this.setUA=function(e){return i=typeof e===c&&e.length>500?Z(e,500):e,this},this.setUA(i),this};Y.VERSION="1.0.39",Y.BROWSER=G([b,w,l]),Y.CPU=G([v]),Y.DEVICE=G([p,f,d,h,m,y,g,x,_]),Y.ENGINE=Y.OS=G([b,w]),typeof t!==s?(e.exports&&(t=e.exports=Y),t.UAParser=Y):r.amdO?(i=function(){return Y}.call(t,r,t,e))===n||(e.exports=i):typeof o!==s&&(o.UAParser=Y);var ee=typeof o!==s&&(o.jQuery||o.Zepto);if(ee&&!ee.ua){var te=new Y;ee.ua=te.getResult(),ee.ua.get=function(){return te.getUA()},ee.ua.set=function(e){te.setUA(e);var t=te.getResult();for(var r in t)ee.ua[r]=t[r]}}}("object"==typeof window?window:this)}},t={};function r(i){var o=t[i];if(void 0!==o)return o.exports;var n=t[i]={exports:{}};return e[i].call(n.exports,n,n.exports,r),n.exports}r.amdO={},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}();var i={};(()=>{"use strict";function e(e){"undefined"!=typeof document&&("complete"!==document.readyState&&"interactive"!==document.readyState?document.addEventListener("DOMContentLoaded",e):e())}r(3503),r(7232),r(4383);var t=!1,i=[],o=function(){t||(t=!0,i.forEach((function(e){return e()})))},n=function(){if(!t)return null!==document.body?o():void setTimeout(n,100)};n(),e(o);var a,s,u,c=function(){return c=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},c.apply(this,arguments)},l=!1;if((u=window)&&"object"==typeof u&&"nabQuickActionSettings"in u)s=window.nabQuickActionSettings,e((function(){var e=document.querySelector("#wp-admin-bar-nelio-ab-testing-experiment-create a"),t=document.querySelector("#wp-admin-bar-nelio-ab-testing-heatmap-create a");e&&e.addEventListener("click",b),t&&t.addEventListener("click",d)}));else{var p=document.getElementById("wp-admin-bar-nelio-ab-testing");null===(a=null==p?void 0:p.parentNode)||void 0===a||a.removeChild(p)}function b(e){e.preventDefault();var t=null!=s?s:{},r=t.postId,i=t.postType,o=t.experimentType,n=t.root,a=t.nonce;r&&i&&o&&n&&a&&(l||(l=!0,fetch("".concat(n,"nab/v1/experiment"),{headers:{"content-type":"application/json","x-wp-nonce":a},method:"POST",body:JSON.stringify({type:o,addTestedPostScopeRule:!0})}).then((function(e){return e.json()})).then((function(e){fetch("".concat(n,"nab/v1/experiment/").concat(e.id),{headers:{"content-type":"application/json","x-wp-nonce":a},method:"PUT",body:JSON.stringify(c(c({},e),{alternatives:[{id:"control",attributes:{postId:r,postType:i}}]}))}).then((function(e){return e.json()})).then((function(e){window.location.href=e.links.edit}))}))))}function d(e){if(e.preventDefault(),!l){l=!0;var t=null!=s?s:{},r=t.postId,i=t.postType,o=t.currentUrl,n=t.root,a=t.nonce;n&&a&&fetch("".concat(n,"nab/v1/experiment"),{headers:{"content-type":"application/json","x-wp-nonce":a},method:"POST",body:JSON.stringify({type:"nab/heatmap",addTestedPostScopeRule:!1})}).then((function(e){return e.json()})).then((function(e){var t={id:e.id,type:"nab/heatmap",trackingMode:r?"post":"url",trackedPostId:r||void 0,trackedPostType:r?i:void 0,trackedUrl:r?void 0:o};fetch("".concat(n,"nab/v1/experiment/").concat(t.id),{headers:{"content-type":"application/json","x-wp-nonce":a},method:"PUT",body:JSON.stringify(t)}).then((function(e){return e.json()})).then((function(e){window.location.href=e.links.edit}))}))}}})();var o=nab="undefined"==typeof nab?{}:nab;for(var n in i)o[n]=i[n];i.__esModule&&Object.defineProperty(o,"__esModule",{value:!0})})();