/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.editorConfig=function(e){e.filebrowserBrowseUrl="/ckeditor/attachment_files",e.filebrowserFlashBrowseUrl="/ckeditor/attachment_files",e.filebrowserFlashUploadUrl="/ckeditor/attachment_files",e.filebrowserImageBrowseLinkUrl="/ckeditor/pictures",e.filebrowserImageBrowseUrl="/ckeditor/pictures",e.filebrowserImageUploadUrl="/ckeditor/pictures",e.filebrowserUploadUrl="/ckeditor/attachment_files",e.filebrowserParams=function(){var e=jQuery("meta[name=csrf-token]").attr("content"),t=jQuery("meta[name=csrf-param]").attr("content"),r=new Object;return void 0!==t&&void 0!==e&&(r[t]=e),r},e.addQueryString=function(e,t){var r=[];if(!t)return e;for(var a in t)r.push(a+"="+encodeURIComponent(t[a]));return e+(-1!=e.indexOf("?")?"&":"?")+r.join("&")},CKEDITOR.on("dialogDefinition",function(t){var r,a,o=t.data.name,i=t.data.definition;$.inArray(o,["link","image","attachment","flash"])>-1&&(r=i.getContents("Upload")||i.getContents("upload"),a=null==r?null:r.get("upload"),a&&null==a.filebrowser.params&&(a.filebrowser.params=e.filebrowserParams(),a.action=e.addQueryString(a.action,a.filebrowser.params)))}),e.extraPlugins="embed,attachment",e.toolbar="Easy",e.toolbar_Easy=[["Source","-","Preview"],["Cut","Copy","Paste","PasteText","PasteFromWord"],["Undo","Redo","-","SelectAll","RemoveFormat"],["Styles","Format"],["Subscript","Superscript","TextColor"],["Maximize","-","About"],"/",["Bold","Italic","Underline","Strike"],["NumberedList","BulletedList","-","Outdent","Indent","Blockquote"],["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"],["Link","Unlink","Anchor"],["Image","Attachment","Flash","Embed"],["Table","HorizontalRule","Smiley","SpecialChar","PageBreak"]]};