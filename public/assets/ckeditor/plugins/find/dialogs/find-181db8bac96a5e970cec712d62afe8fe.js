/*
Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
!function(){function e(e){return e.type==CKEDITOR.NODE_TEXT&&e.getLength()>0&&(!n||!e.isReadOnly())}function t(e){return!(e.type==CKEDITOR.NODE_ELEMENT&&e.isBlockBoundary(CKEDITOR.tools.extend({},CKEDITOR.dtd.$empty,CKEDITOR.dtd.$nonEditable)))}function a(e){var t,a,n,r;t="find"===e?1:0,a=1-t;var c,o=l.length;for(c=0;o>c;c++)n=this.getContentElement(i[t],l[c][t]),r=this.getContentElement(i[a],l[c][a]),r.setValue(n.getValue())}var n,r=function(){var e=this;return{textNode:e.textNode,offset:e.offset,character:e.textNode?e.textNode.getText().charAt(e.offset):null,hitMatchBoundary:e._.matchBoundary}},i=["find","replace"],l=[["txtFindFind","txtFindReplace"],["txtFindCaseChk","txtReplaceCaseChk"],["txtFindWordChk","txtReplaceWordChk"],["txtFindCyclic","txtReplaceCyclic"]],c=function(i,l){function c(e,t){var a=new CKEDITOR.dom.range;return a.setStart(e.textNode,t?e.offset:e.offset+1),a.setEndAt(i.document.getBody(),CKEDITOR.POSITION_BEFORE_END),a}function o(e){var t=new CKEDITOR.dom.range;return t.setStartAt(i.document.getBody(),CKEDITOR.POSITION_AFTER_START),t.setEnd(e.textNode,e.offset),t}function h(e){var t,a=i.getSelection(),n=i.document.getBody();return a&&!e?(t=a.getRanges()[0].clone(),t.collapse(!0)):(t=new CKEDITOR.dom.range,t.setStartAt(n,CKEDITOR.POSITION_AFTER_START)),t.setEndAt(n,CKEDITOR.POSITION_BEFORE_END),t}var s=new CKEDITOR.style(CKEDITOR.tools.extend({attributes:{"data-cke-highlight":1},fullMatch:1,ignoreReadonly:1,childRule:function(){return 0}},i.config.find_highlight,!0)),g=function(a,n){var r=this,i=new CKEDITOR.dom.walker(a);i.guard=n?t:function(e){!t(e)&&(r._.matchBoundary=!0)},i.evaluator=e,i.breakOnFalse=1,a.startContainer.type==CKEDITOR.NODE_TEXT&&(this.textNode=a.startContainer,this.offset=a.startOffset-1),this._={matchWord:n,walker:i,matchBoundary:!1}};g.prototype={next:function(){return this.move()},back:function(){return this.move(!0)},move:function(e){var t=this,a=t.textNode;if(null===a)return r.call(t);if(t._.matchBoundary=!1,a&&e&&t.offset>0)return t.offset--,r.call(t);if(a&&t.offset<a.getLength()-1)return t.offset++,r.call(t);for(a=null;!(a||(a=t._.walker[e?"previous":"next"].call(t._.walker),t._.matchWord&&!a||t._.walker._.end)););return t.textNode=a,t.offset=a?e?a.getLength()-1:0:0,r.call(t)}};var d=function(e,t){this._={walker:e,cursors:[],rangeLength:t,highlightRange:null,isMatched:0}};d.prototype={toDomRange:function(){var e=new CKEDITOR.dom.range(i.document),t=this._.cursors;if(t.length<1){var a=this._.walker.textNode;if(!a)return null;e.setStartAfter(a)}else{var n=t[0],r=t[t.length-1];e.setStart(n.textNode,n.offset),e.setEnd(r.textNode,r.offset+1)}return e},updateFromDomRange:function(e){var t,a=this,n=new g(e);a._.cursors=[];do t=n.next(),t.character&&a._.cursors.push(t);while(t.character);a._.rangeLength=a._.cursors.length},setMatched:function(){this._.isMatched=!0},clearMatched:function(){this._.isMatched=!1},isMatched:function(){return this._.isMatched},highlight:function(){var e=this;if(!(e._.cursors.length<1)){e._.highlightRange&&e.removeHighlight();var t=e.toDomRange(),a=t.createBookmark();s.applyToRange(t),t.moveToBookmark(a),e._.highlightRange=t;var n=t.startContainer;n.type!=CKEDITOR.NODE_ELEMENT&&(n=n.getParent()),n.scrollIntoView(),e.updateFromDomRange(t)}},removeHighlight:function(){var e=this;if(e._.highlightRange){var t=e._.highlightRange.createBookmark();s.removeFromRange(e._.highlightRange),e._.highlightRange.moveToBookmark(t),e.updateFromDomRange(e._.highlightRange),e._.highlightRange=null}},isReadOnly:function(){return this._.highlightRange?this._.highlightRange.startContainer.isReadOnly():0},moveBack:function(){var e=this,t=e._.walker.back(),a=e._.cursors;return t.hitMatchBoundary&&(e._.cursors=a=[]),a.unshift(t),a.length>e._.rangeLength&&a.pop(),t},moveNext:function(){var e=this,t=e._.walker.next(),a=e._.cursors;return t.hitMatchBoundary&&(e._.cursors=a=[]),a.push(t),a.length>e._.rangeLength&&a.shift(),t},getEndCharacter:function(){var e=this._.cursors;return e.length<1?null:e[e.length-1].character},getNextCharacterRange:function(e){var t,a,n=this._.cursors;return a=(t=n[n.length-1])&&t.textNode?new g(c(t)):this._.walker,new d(a,e)},getCursors:function(){return this._.cursors}};var u=0,f=1,R=2,p=function(e,t){var a=[-1];t&&(e=e.toLowerCase());for(var n=0;n<e.length;n++)for(a.push(a[n]+1);a[n+1]>0&&e.charAt(n)!=e.charAt(a[n+1]-1);)a[n+1]=a[a[n+1]-1]+1;this._={overlap:a,state:0,ignoreCase:!!t,pattern:e}};p.prototype={feedCharacter:function(e){var t=this;for(t._.ignoreCase&&(e=e.toLowerCase());;){if(e==t._.pattern.charAt(t._.state))return t._.state++,t._.state==t._.pattern.length?(t._.state=0,R):f;if(!t._.state)return u;t._.state=t._.overlap[t._.state]}return null},reset:function(){this._.state=0}};var m=/[.,"'?!;: \u0085\u00a0\u1680\u280e\u2028\u2029\u202f\u205f\u3000]/,C=function(e){if(!e)return!0;var t=e.charCodeAt(0);return t>=9&&13>=t||t>=8192&&8202>=t||m.test(e)},x={searchRange:null,matchRange:null,find:function(e,t,a,n,r,i){var l=this;l.matchRange?(l.matchRange.removeHighlight(),l.matchRange=l.matchRange.getNextCharacterRange(e.length)):l.matchRange=new d(new g(l.searchRange),e.length);for(var s=new p(e,!t),f=u,m="%";null!==m;){for(l.matchRange.moveNext();(m=l.matchRange.getEndCharacter())&&(f=s.feedCharacter(m),f!=R);)l.matchRange.moveNext().hitMatchBoundary&&s.reset();if(f==R){if(a){var x=l.matchRange.getCursors(),_=x[x.length-1],v=x[0],y=new g(o(v),!0),E=new g(c(_),!0);if(!C(y.back().character)||!C(E.next().character))continue}return l.matchRange.setMatched(),r!==!1&&l.matchRange.highlight(),!0}}return l.matchRange.clearMatched(),l.matchRange.removeHighlight(),n&&!i?(l.searchRange=h(1),l.matchRange=null,arguments.callee.apply(l,Array.prototype.slice.call(arguments).concat([!0]))):!1},replaceCounter:0,replace:function(e,t,a,r,l,c,o){var h=this;n=1;var s=0;if(h.matchRange&&h.matchRange.isMatched()&&!h.matchRange._.isReplaced&&!h.matchRange.isReadOnly()){h.matchRange.removeHighlight();var g=h.matchRange.toDomRange(),d=i.document.createText(a);if(!o){var u=i.getSelection();u.selectRanges([g]),i.fire("saveSnapshot")}g.deleteContents(),g.insertNode(d),o||(u.selectRanges([g]),i.fire("saveSnapshot")),h.matchRange.updateFromDomRange(g),o||h.matchRange.highlight(),h.matchRange._.isReplaced=!0,h.replaceCounter++,s=1}else s=h.find(t,r,l,c,!o);return n=0,s}},_=i.lang.findAndReplace;return{title:_.title,resizable:CKEDITOR.DIALOG_RESIZE_NONE,minWidth:350,minHeight:170,buttons:[CKEDITOR.dialog.cancelButton],contents:[{id:"find",label:_.find,title:_.find,accessKey:"",elements:[{type:"hbox",widths:["230px","90px"],children:[{type:"text",id:"txtFindFind",label:_.findWhat,isChanged:!1,labelLayout:"horizontal",accessKey:"F"},{type:"button",id:"btnFind",align:"left",style:"width:100%",label:_.find,onClick:function(){var e=this.getDialog();x.find(e.getValueOf("find","txtFindFind"),e.getValueOf("find","txtFindCaseChk"),e.getValueOf("find","txtFindWordChk"),e.getValueOf("find","txtFindCyclic"))||alert(_.notFoundMsg)}}]},{type:"fieldset",label:CKEDITOR.tools.htmlEncode(_.findOptions),style:"margin-top:29px",children:[{type:"vbox",padding:0,children:[{type:"checkbox",id:"txtFindCaseChk",isChanged:!1,label:_.matchCase},{type:"checkbox",id:"txtFindWordChk",isChanged:!1,label:_.matchWord},{type:"checkbox",id:"txtFindCyclic",isChanged:!1,"default":!0,label:_.matchCyclic}]}]}]},{id:"replace",label:_.replace,accessKey:"M",elements:[{type:"hbox",widths:["230px","90px"],children:[{type:"text",id:"txtFindReplace",label:_.findWhat,isChanged:!1,labelLayout:"horizontal",accessKey:"F"},{type:"button",id:"btnFindReplace",align:"left",style:"width:100%",label:_.replace,onClick:function(){var e=this.getDialog();x.replace(e,e.getValueOf("replace","txtFindReplace"),e.getValueOf("replace","txtReplace"),e.getValueOf("replace","txtReplaceCaseChk"),e.getValueOf("replace","txtReplaceWordChk"),e.getValueOf("replace","txtReplaceCyclic"))||alert(_.notFoundMsg)}}]},{type:"hbox",widths:["230px","90px"],children:[{type:"text",id:"txtReplace",label:_.replaceWith,isChanged:!1,labelLayout:"horizontal",accessKey:"R"},{type:"button",id:"btnReplaceAll",align:"left",style:"width:100%",label:_.replaceAll,isChanged:!1,onClick:function(){var e=this.getDialog();for(x.replaceCounter=0,x.searchRange=h(1),x.matchRange&&(x.matchRange.removeHighlight(),x.matchRange=null),i.fire("saveSnapshot");x.replace(e,e.getValueOf("replace","txtFindReplace"),e.getValueOf("replace","txtReplace"),e.getValueOf("replace","txtReplaceCaseChk"),e.getValueOf("replace","txtReplaceWordChk"),!1,!0););x.replaceCounter?(alert(_.replaceSuccessMsg.replace(/%1/,x.replaceCounter)),i.fire("saveSnapshot")):alert(_.notFoundMsg)}}]},{type:"fieldset",label:CKEDITOR.tools.htmlEncode(_.findOptions),children:[{type:"vbox",padding:0,children:[{type:"checkbox",id:"txtReplaceCaseChk",isChanged:!1,label:_.matchCase},{type:"checkbox",id:"txtReplaceWordChk",isChanged:!1,label:_.matchWord},{type:"checkbox",id:"txtReplaceCyclic",isChanged:!1,"default":!0,label:_.matchCyclic}]}]}]}],onLoad:function(){var e,t,n=this,r=0;this.on("hide",function(){r=0}),this.on("show",function(){r=1}),this.selectPage=CKEDITOR.tools.override(this.selectPage,function(i){return function(l){i.call(n,l);var c,o,h,s=n._.tabs[l];o="find"===l?"txtFindFind":"txtFindReplace",h="find"===l?"txtFindWordChk":"txtReplaceWordChk",e=n.getContentElement(l,o),t=n.getContentElement(l,h),s.initialized||(c=CKEDITOR.document.getById(e._.inputId),s.initialized=!0),r&&a.call(this,l)}})},onShow:function(){var e=this;x.searchRange=h();var t=e.getParentEditor().getSelection().getSelectedText(),a="find"==l?"txtFindFind":"txtFindReplace",n=e.getContentElement(l,a);n.setValue(t),n.select(),e.selectPage(l),e[("find"==l&&e._.editor.readOnly?"hide":"show")+"Page"]("replace")},onHide:function(){var e;x.matchRange&&x.matchRange.isMatched()&&(x.matchRange.removeHighlight(),i.focus(),e=x.matchRange.toDomRange(),e&&i.getSelection().selectRanges([e])),delete x.matchRange},onFocus:function(){return"replace"==l?this.getContentElement("replace","txtFindReplace"):this.getContentElement("find","txtFindFind")}}};CKEDITOR.dialog.add("find",function(e){return c(e,"find")}),CKEDITOR.dialog.add("replace",function(e){return c(e,"replace")})}();