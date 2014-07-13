/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add("colordialog",function(e){function t(){y.getById(C).removeStyle("background-color"),d.getContentElement("picker","selectedColor").setValue(""),c&&c.removeAttribute("aria-selected"),c=null}function o(e){var t,o=e.data.getTarget();"td"==o.getName()&&(t=o.getChild(0).getHtml())&&(c=o,c.setAttribute("aria-selected",!0),d.getContentElement("picker","selectedColor").setValue(t))}function l(e){e=e.replace(/^#/,"");for(var t=0,o=[];2>=t;t++)o[t]=parseInt(e.substr(2*t,2),16);var l=.2126*o[0]+.7152*o[1]+.0722*o[2];return"#"+(l>=165?"000":"fff")}function r(e){!e.name&&(e=new CKEDITOR.event(e));var t,o=!/mouse/.test(e.name),r=e.data.getTarget();"td"==r.getName()&&(t=r.getChild(0).getHtml())&&(a(e),o?g=r:u=r,o&&(r.setStyle("border-color",l(t)),r.setStyle("border-style","dotted")),y.getById(h).setStyle("background-color",t),y.getById(I).setHtml(t))}function n(){var e=g.getChild(0).getHtml();g.setStyle("border-color",e),g.setStyle("border-style","solid"),y.getById(h).removeStyle("background-color"),y.getById(I).setHtml("&nbsp;"),g=null}function a(e){var t=!/mouse/.test(e.name),o=t&&g;if(o){var l=o.getChild(0).getHtml();o.setStyle("border-color",l),o.setStyle("border-style","solid")}g||u||(y.getById(h).removeStyle("background-color"),y.getById(I).setHtml("&nbsp;"))}function i(t){var l,r,n=t.data,a=n.getTarget(),i=n.getKeystroke(),s="rtl"==e.lang.dir;switch(i){case 38:(l=a.getParent().getPrevious())&&(r=l.getChild([a.getIndex()]),r.focus()),n.preventDefault();break;case 40:(l=a.getParent().getNext())&&(r=l.getChild([a.getIndex()]),r&&1==r.type&&r.focus()),n.preventDefault();break;case 32:case 13:o(t),n.preventDefault();break;case s?37:39:(r=a.getNext())?1==r.type&&(r.focus(),n.preventDefault(!0)):(l=a.getParent().getNext())&&(r=l.getChild([0]),r&&1==r.type&&(r.focus(),n.preventDefault(!0)));break;case s?39:37:(r=a.getPrevious())?(r.focus(),n.preventDefault(!0)):(l=a.getParent().getPrevious())&&(r=l.getLast(),r.focus(),n.preventDefault(!0));break;default:return}}function s(){function e(e,o){for(var r=e;e+3>r;r++){var n=new b(p.$.insertRow(-1));n.setAttribute("role","row");for(var a=o;o+3>a;a++)for(var i=0;6>i;i++)t(n.$,"#"+l[a]+l[i]+l[r])}}function t(e,t){var l=new b(e.insertCell(-1));l.setAttribute("class","ColorCell"),l.setAttribute("tabIndex",-1),l.setAttribute("role","gridcell"),l.on("keydown",i),l.on("click",o),l.on("focus",r),l.on("blur",a),l.setStyle("background-color",t),l.setStyle("border","1px solid "+t),l.setStyle("width","14px"),l.setStyle("height","14px");var n=v("color_table_cell");l.setAttribute("aria-labelledby",n),l.append(CKEDITOR.dom.element.createFromHtml('<span id="'+n+'" class="cke_voice_label">'+t+"</span>",CKEDITOR.document))}p=CKEDITOR.dom.element.createFromHtml('<table tabIndex="-1" aria-label="'+m.options+'"'+' role="grid" style="border-collapse:separate;" cellspacing="0">'+'<caption class="cke_voice_label">'+m.options+"</caption>"+'<tbody role="presentation"></tbody></table>'),p.on("mouseover",r),p.on("mouseout",a);var l=["00","33","66","99","cc","ff"];e(0,0),e(3,0),e(0,3),e(3,3);var n=new b(p.$.insertRow(-1));n.setAttribute("role","row");for(var s=0;6>s;s++)t(n.$,"#"+l[s]+l[s]+l[s]);for(var d=0;12>d;d++)t(n.$,"#000000")}var d,c,g,u,p,b=CKEDITOR.dom.element,y=CKEDITOR.document,m=e.lang.colordialog,f={type:"html",html:"&nbsp;"},v=function(e){return CKEDITOR.tools.getNextId()+"_"+e},h=v("hicolor"),I=v("hicolortext"),C=v("selhicolor");return s(),{title:m.title,minWidth:360,minHeight:220,onLoad:function(){d=this},onHide:function(){t(),n()},contents:[{id:"picker",label:m.title,accessKey:"I",elements:[{type:"hbox",padding:0,widths:["70%","10%","30%"],children:[{type:"html",html:"<div></div>",onLoad:function(){CKEDITOR.document.getById(this.domId).append(p)},focus:function(){(g||this.getElement().getElementsByTag("td").getItem(0)).focus()}},f,{type:"vbox",padding:0,widths:["70%","5%","25%"],children:[{type:"html",html:"<span>"+m.highlight+'</span>												<div id="'+h+'" style="border: 1px solid; height: 74px; width: 74px;"></div>												<div id="'+I+'">&nbsp;</div><span>'+m.selected+'</span>												<div id="'+C+'" style="border: 1px solid; height: 20px; width: 74px;"></div>'},{type:"text",label:m.selected,labelStyle:"display:none",id:"selectedColor",style:"width: 74px",onChange:function(){try{y.getById(C).setStyle("background-color",this.getValue())}catch(e){t()}}},f,{type:"button",id:"clear",style:"margin-top: 5px",label:m.clear,onClick:t}]}]}]}]}});