/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.dialog.add("radio",function(e){return{title:e.lang.checkboxAndRadio.radioTitle,minWidth:350,minHeight:140,onShow:function(){var e=this;delete e.radioButton;var t=e.getParentEditor().getSelection().getSelectedElement();t&&"input"==t.getName()&&"radio"==t.getAttribute("type")&&(e.radioButton=t,e.setupContent(t))},onOk:function(){var e,t=this.radioButton,i=!t;i&&(e=this.getParentEditor(),t=e.document.createElement("input"),t.setAttribute("type","radio")),i&&e.insertElement(t),this.commitContent({element:t})},contents:[{id:"info",label:e.lang.checkboxAndRadio.radioTitle,title:e.lang.checkboxAndRadio.radioTitle,elements:[{id:"name",type:"text",label:e.lang.common.name,"default":"",accessKey:"N",setup:function(e){this.setValue(e.data("cke-saved-name")||e.getAttribute("name")||"")},commit:function(e){var t=e.element;this.getValue()?t.data("cke-saved-name",this.getValue()):(t.data("cke-saved-name",!1),t.removeAttribute("name"))}},{id:"value",type:"text",label:e.lang.checkboxAndRadio.value,"default":"",accessKey:"V",setup:function(e){this.setValue(e.getAttribute("value")||"")},commit:function(e){var t=e.element;this.getValue()?t.setAttribute("value",this.getValue()):t.removeAttribute("value")}},{id:"checked",type:"checkbox",label:e.lang.checkboxAndRadio.selected,"default":"",accessKey:"S",value:"checked",setup:function(e){this.setValue(e.getAttribute("checked"))},commit:function(t){var i=t.element;if(CKEDITOR.env.ie||CKEDITOR.env.opera){var a=i.getAttribute("checked"),n=!!this.getValue();if(a!=n){var c=CKEDITOR.dom.element.createFromHtml('<input type="radio"'+(n?' checked="checked"':"")+"></input>",e.document);i.copyAttributes(c,{type:1,checked:1}),c.replace(i),e.getSelection().selectElement(c),t.element=c}}else this.getValue()?i.setAttribute("checked","checked"):i.removeAttribute("checked")}}]}]}});