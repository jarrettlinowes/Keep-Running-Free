/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
!function(){function e(e,t,o){var s=this,m=i[s.id];if(m)for(var d=s instanceof CKEDITOR.ui.dialog.checkbox,c=0;c<m.length;c++){var g=m[c];switch(g.type){case a:if(!e)continue;if(null!==e.getAttribute(g.name)){var h=e.getAttribute(g.name);return d?s.setValue("true"==h.toLowerCase()):s.setValue(h),void 0}d&&s.setValue(!!g["default"]);break;case l:if(!e)continue;if(g.name in o)return h=o[g.name],d?s.setValue("true"==h.toLowerCase()):s.setValue(h),void 0;d&&s.setValue(!!g["default"]);break;case n:if(!t)continue;if(t.getAttribute(g.name))return h=t.getAttribute(g.name),d?s.setValue("true"==h.toLowerCase()):s.setValue(h),void 0;d&&s.setValue(!!g["default"])}}}function t(e,t,o){var s=this,m=i[s.id];if(m)for(var d=""===s.getValue(),c=s instanceof CKEDITOR.ui.dialog.checkbox,g=0;g<m.length;g++){var h=m[g];switch(h.type){case a:if(!e||"data"==h.name&&t&&!e.hasAttribute("data"))continue;var p=s.getValue();d||c&&p===h["default"]?e.removeAttribute(h.name):e.setAttribute(h.name,p);break;case l:if(!e)continue;if(p=s.getValue(),d||c&&p===h["default"])h.name in o&&o[h.name].remove();else if(h.name in o)o[h.name].setAttribute("value",p);else{var r=CKEDITOR.dom.element.createFromHtml("<cke:param></cke:param>",e.getDocument());r.setAttributes({name:h.name,value:p}),e.getChildCount()<1?r.appendTo(e):r.insertBefore(e.getFirst())}break;case n:if(!t)continue;p=s.getValue(),d||c&&p===h["default"]?t.removeAttribute(h.name):t.setAttribute(h.name,p)}}}for(var a=1,l=2,n=4,i={id:[{type:a,name:"id"}],classid:[{type:a,name:"classid"}],codebase:[{type:a,name:"codebase"}],pluginspage:[{type:n,name:"pluginspage"}],src:[{type:l,name:"movie"},{type:n,name:"src"},{type:a,name:"data"}],name:[{type:n,name:"name"}],align:[{type:a,name:"align"}],title:[{type:a,name:"title"},{type:n,name:"title"}],"class":[{type:a,name:"class"},{type:n,name:"class"}],width:[{type:a,name:"width"},{type:n,name:"width"}],height:[{type:a,name:"height"},{type:n,name:"height"}],hSpace:[{type:a,name:"hSpace"},{type:n,name:"hSpace"}],vSpace:[{type:a,name:"vSpace"},{type:n,name:"vSpace"}],style:[{type:a,name:"style"},{type:n,name:"style"}],type:[{type:n,name:"type"}]},o=["play","loop","menu","quality","scale","salign","wmode","bgcolor","base","flashvars","allowScriptAccess","allowFullScreen"],s=0;s<o.length;s++)i[o[s]]=[{type:n,name:o[s]},{type:l,name:o[s]}];for(o=["allowFullScreen","play","loop","menu"],s=0;s<o.length;s++)i[o[s]][0]["default"]=i[o[s]][1]["default"]=!0;CKEDITOR.tools.cssLength,CKEDITOR.dialog.add("flash",function(a){var l,n=!a.config.flashEmbedTagOnly,i=a.config.flashAddEmbedTag||a.config.flashEmbedTagOnly,o="<div>"+CKEDITOR.tools.htmlEncode(a.lang.common.preview)+"<br>"+'<div id="cke_FlashPreviewLoader'+CKEDITOR.tools.getNextNumber()+'" style="display:none"><div class="loading">&nbsp;</div></div>'+'<div id="cke_FlashPreviewBox'+CKEDITOR.tools.getNextNumber()+'" class="FlashPreviewBox"></div></div>';return{title:a.lang.flash.title,minWidth:420,minHeight:310,onShow:function(){var e=this;e.fakeImage=e.objectNode=e.embedNode=null,l=new CKEDITOR.dom.element("embed",a.document);var t=e.getSelectedElement();if(t&&t.data("cke-real-element-type")&&"flash"==t.data("cke-real-element-type")){e.fakeImage=t;var n=a.restoreRealElement(t),i=null,o=null,s={};if("cke:object"==n.getName()){i=n;var m=i.getElementsByTag("embed","cke");m.count()>0&&(o=m.getItem(0));for(var d=i.getElementsByTag("param","cke"),c=0,g=d.count();g>c;c++){var h=d.getItem(c),p=h.getAttribute("name"),r=h.getAttribute("value");s[p]=r}}else"cke:embed"==n.getName()&&(o=n);e.objectNode=i,e.embedNode=o,e.setupContent(i,o,s,t)}},onOk:function(){var e=this,t=null,l=null,o=null;if(e.fakeImage)t=e.objectNode,l=e.embedNode;else{if(n){t=CKEDITOR.dom.element.createFromHtml("<cke:object></cke:object>",a.document);var s={classid:"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",codebase:"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"};t.setAttributes(s)}i&&(l=CKEDITOR.dom.element.createFromHtml("<cke:embed></cke:embed>",a.document),l.setAttributes({type:"application/x-shockwave-flash",pluginspage:"http://www.macromedia.com/go/getflashplayer"}),t&&l.appendTo(t))}if(t){o={};for(var m=t.getElementsByTag("param","cke"),d=0,c=m.count();c>d;d++)o[m.getItem(d).getAttribute("name")]=m.getItem(d)}var g={},h={};e.commitContent(t,l,o,g,h);var p=a.createFakeElement(t||l,"cke_flash","flash",!0);p.setAttributes(h),p.setStyles(g),e.fakeImage?(p.replace(e.fakeImage),a.getSelection().selectElement(p)):a.insertElement(p)},onHide:function(){this.preview&&this.preview.setHtml("")},contents:[{id:"info",label:a.lang.common.generalTab,accessKey:"I",elements:[{type:"vbox",padding:0,children:[{type:"hbox",widths:["280px","110px"],align:"right",children:[{id:"src",type:"text",label:a.lang.common.url,required:!0,validate:CKEDITOR.dialog.validate.notEmpty(a.lang.flash.validateSrc),setup:e,commit:t,onLoad:function(){var e=this.getDialog(),t=function(t){l.setAttribute("src",t),e.preview.setHtml('<embed height="100%" width="100%" src="'+CKEDITOR.tools.htmlEncode(l.getAttribute("src"))+'" type="application/x-shockwave-flash"></embed>')};e.preview=e.getContentElement("info","preview").getElement().getChild(3),this.on("change",function(e){e.data&&e.data.value&&t(e.data.value)}),this.getInputElement().on("change",function(){t(this.getValue())},this)}},{type:"button",id:"browse",filebrowser:"info:src",hidden:!0,style:"display:inline-block;margin-top:10px;",label:a.lang.common.browseServer}]}]},{type:"hbox",widths:["25%","25%","25%","25%","25%"],children:[{type:"text",id:"width",style:"width:95px",label:a.lang.common.width,validate:CKEDITOR.dialog.validate.htmlLength(a.lang.common.invalidHtmlLength.replace("%1",a.lang.common.width)),setup:e,commit:t},{type:"text",id:"height",style:"width:95px",label:a.lang.common.height,validate:CKEDITOR.dialog.validate.htmlLength(a.lang.common.invalidHtmlLength.replace("%1",a.lang.common.height)),setup:e,commit:t},{type:"text",id:"hSpace",style:"width:95px",label:a.lang.flash.hSpace,validate:CKEDITOR.dialog.validate.integer(a.lang.flash.validateHSpace),setup:e,commit:t},{type:"text",id:"vSpace",style:"width:95px",label:a.lang.flash.vSpace,validate:CKEDITOR.dialog.validate.integer(a.lang.flash.validateVSpace),setup:e,commit:t}]},{type:"vbox",children:[{type:"html",id:"preview",style:"width:95%;",html:o}]}]},{id:"Upload",hidden:!0,filebrowser:"uploadButton",label:a.lang.common.upload,elements:[{type:"file",id:"upload",label:a.lang.common.upload,size:38},{type:"fileButton",id:"uploadButton",label:a.lang.common.uploadSubmit,filebrowser:"info:src","for":["Upload","upload"]}]},{id:"properties",label:a.lang.flash.propertiesTab,elements:[{type:"hbox",widths:["50%","50%"],children:[{id:"scale",type:"select",label:a.lang.flash.scale,"default":"",style:"width : 100%;",items:[[a.lang.common.notSet,""],[a.lang.flash.scaleAll,"showall"],[a.lang.flash.scaleNoBorder,"noborder"],[a.lang.flash.scaleFit,"exactfit"]],setup:e,commit:t},{id:"allowScriptAccess",type:"select",label:a.lang.flash.access,"default":"",style:"width : 100%;",items:[[a.lang.common.notSet,""],[a.lang.flash.accessAlways,"always"],[a.lang.flash.accessSameDomain,"samedomain"],[a.lang.flash.accessNever,"never"]],setup:e,commit:t}]},{type:"hbox",widths:["50%","50%"],children:[{id:"wmode",type:"select",label:a.lang.flash.windowMode,"default":"",style:"width : 100%;",items:[[a.lang.common.notSet,""],[a.lang.flash.windowModeWindow,"window"],[a.lang.flash.windowModeOpaque,"opaque"],[a.lang.flash.windowModeTransparent,"transparent"]],setup:e,commit:t},{id:"quality",type:"select",label:a.lang.flash.quality,"default":"high",style:"width : 100%;",items:[[a.lang.common.notSet,""],[a.lang.flash.qualityBest,"best"],[a.lang.flash.qualityHigh,"high"],[a.lang.flash.qualityAutoHigh,"autohigh"],[a.lang.flash.qualityMedium,"medium"],[a.lang.flash.qualityAutoLow,"autolow"],[a.lang.flash.qualityLow,"low"]],setup:e,commit:t}]},{type:"hbox",widths:["50%","50%"],children:[{id:"align",type:"select",label:a.lang.common.align,"default":"",style:"width : 100%;",items:[[a.lang.common.notSet,""],[a.lang.common.alignLeft,"left"],[a.lang.flash.alignAbsBottom,"absBottom"],[a.lang.flash.alignAbsMiddle,"absMiddle"],[a.lang.flash.alignBaseline,"baseline"],[a.lang.common.alignBottom,"bottom"],[a.lang.common.alignMiddle,"middle"],[a.lang.common.alignRight,"right"],[a.lang.flash.alignTextTop,"textTop"],[a.lang.common.alignTop,"top"]],setup:e,commit:function(e,a,l,n,i){var o=this.getValue();t.apply(this,arguments),o&&(i.align=o)}},{type:"html",html:"<div></div>"}]},{type:"fieldset",label:CKEDITOR.tools.htmlEncode(a.lang.flash.flashvars),children:[{type:"vbox",padding:0,children:[{type:"checkbox",id:"menu",label:a.lang.flash.chkMenu,"default":!0,setup:e,commit:t},{type:"checkbox",id:"play",label:a.lang.flash.chkPlay,"default":!0,setup:e,commit:t},{type:"checkbox",id:"loop",label:a.lang.flash.chkLoop,"default":!0,setup:e,commit:t},{type:"checkbox",id:"allowFullScreen",label:a.lang.flash.chkFull,"default":!0,setup:e,commit:t}]}]}]},{id:"advanced",label:a.lang.common.advancedTab,elements:[{type:"hbox",widths:["45%","55%"],children:[{type:"text",id:"id",label:a.lang.common.id,setup:e,commit:t},{type:"text",id:"title",label:a.lang.common.advisoryTitle,setup:e,commit:t}]},{type:"hbox",widths:["45%","55%"],children:[{type:"text",id:"bgcolor",label:a.lang.flash.bgcolor,setup:e,commit:t},{type:"text",id:"class",label:a.lang.common.cssClass,setup:e,commit:t}]},{type:"text",id:"style",validate:CKEDITOR.dialog.validate.inlineStyle(a.lang.common.invalidInlineStyle),label:a.lang.common.cssStyle,setup:e,commit:t}]}]}})}();