/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
if(window.CKEDITOR||(window.CKEDITOR=function(){var t={timestamp:"",version:"3.6.3",revision:"7474",rnd:Math.floor(900*Math.random())+100,_:{},status:"unloaded",basePath:function(){var t=window.CKEDITOR_BASEPATH||"";if(!t)for(var e=document.getElementsByTagName("script"),r=0;r<e.length;r++){var a=e[r].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);if(a){t=a[1];break}}if(-1==t.indexOf(":/")&&(t=0===t.indexOf("/")?location.href.match(/^.*?:\/\/[^\/]*/)[0]+t:location.href.match(/^[^\?]*\/(?:)/)[0]+t),!t)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return t}(),getUrl:function(t){return-1==t.indexOf(":/")&&0!==t.indexOf("/")&&(t=this.basePath+t),this.timestamp&&"/"!=t.charAt(t.length-1)&&!/[&?]t=/.test(t)&&(t+=(t.indexOf("?")>=0?"&":"?")+"t="+this.timestamp),t}},e=window.CKEDITOR_GETURL;if(e){var r=t.getUrl;t.getUrl=function(a){return e.call(t,a)||r.call(t,a)}}return t}()),CKEDITOR.loader)CKEDITOR.loader.load("core/ckeditor");else if(CKEDITOR._autoLoad="core/ckeditor",!document.body||document.readyState&&"complete"!=document.readyState)document.write('<script type="text/javascript" src="'+CKEDITOR.getUrl("_source/core/loader.js")+'"></script>');else{var script=document.createElement("script");script.type="text/javascript",script.src=CKEDITOR.getUrl("_source/core/loader.js"),document.body.appendChild(script)}