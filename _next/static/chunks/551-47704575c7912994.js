(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[551],{9604:function(p,k,c){"use strict";function q(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function r(c,d){var a=Object.keys(c);if(Object.getOwnPropertySymbols){var b=Object.getOwnPropertySymbols(c);d&&(b=b.filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable})),a.push.apply(a,b)}return a}function s(c){for(var a=1;a<arguments.length;a++){var b=null!=arguments[a]?arguments[a]:{};a%2?r(Object(b),!0).forEach(function(a){q(c,a,b[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(b)):r(Object(b)).forEach(function(a){Object.defineProperty(c,a,Object.getOwnPropertyDescriptor(b,a))})}return c}c.d(k,{ZP:function(){return ad}});function t(c,a){(null==a||a>c.length)&&(a=c.length);for(var b=0,d=Array(a);b<a;b++)d[b]=c[b];return d}function u(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function v(c,d){var a=Object.keys(c);if(Object.getOwnPropertySymbols){var b=Object.getOwnPropertySymbols(c);d&&(b=b.filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable})),a.push.apply(a,b)}return a}function w(c){for(var a=1;a<arguments.length;a++){var b=null!=arguments[a]?arguments[a]:{};a%2?v(Object(b),!0).forEach(function(a){u(c,a,b[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(c,Object.getOwnPropertyDescriptors(b)):v(Object(b)).forEach(function(a){Object.defineProperty(c,a,Object.getOwnPropertyDescriptor(b,a))})}return c}function l(a){return function e(){for(var f=this,d=arguments.length,c=Array(d),b=0;b<d;b++)c[b]=arguments[b];return c.length>=a.length?a.apply(this,c):function(){for(var b=arguments.length,d=Array(b),a=0;a<b;a++)d[a]=arguments[a];return e.apply(f,[].concat(c,d))}}}function x(a){return({}).toString.call(a).includes("Object")}function y(a){return"function"==typeof a}var z=l(function(a,b){throw Error(a[b]||a.default)})({initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"}),A={changes:function(b,a){return x(a)||z("changeType"),Object.keys(a).some(function(d){var a,c;return a=b,c=d,!Object.prototype.hasOwnProperty.call(a,c)})&&z("changeField"),a},selector:function(a){y(a)||z("selectorType")},handler:function(a){y(a)||x(a)||z("handlerType"),x(a)&&Object.values(a).some(function(a){return!y(a)})&&z("handlersType")},initial:function(a){var b;a||z("initialIsRequired"),x(a)||z("initialType"),!Object.keys(b=a).length&&z("initialContent")}};function B(b,a){return y(a)?a(b.current):a}function C(a,b){return a.current=w(w({},a.current),b),b}function D(c,a,b){return y(a)?a(c.current):Object.keys(b).forEach(function(d){var b;return null===(b=a[d])|| void 0===b?void 0:b.call(a,c.current[d])}),b}var m={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:"Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "},E=(function(a){return function e(){for(var f=this,d=arguments.length,c=Array(d),b=0;b<d;b++)c[b]=arguments[b];return c.length>=a.length?a.apply(this,c):function(){for(var b=arguments.length,d=Array(b),a=0;a<b;a++)d[a]=arguments[a];return e.apply(f,[].concat(c,d))}}})(function(a,b){throw Error(a[b]||a.default)})(m),F={config:function(a){var b;return a||E("configIsRequired"),b=a,!({}).toString.call(b).includes("Object")&&E("configType"),a.urls?(console.warn(m.deprecation),{paths:{vs:a.urls.monacoBase}}):a}},G=function(){for(var b=arguments.length,c=Array(b),a=0;a<b;a++)c[a]=arguments[a];return function(a){return c.reduceRight(function(a,b){return b(a)},a)}};function n(b,a){return Object.keys(a).forEach(function(c){a[c]instanceof Object&&b[c]&&Object.assign(a[c],n(b[c],a[c]))}),s(s({},b),a)}var d,e,H=n,I={type:"cancelation",msg:"operation is manually canceled"},J=function(b){var c=!1,a=new Promise(function(d,a){b.then(function(b){return c?a(I):d(b)}),b.catch(a)});return a.cancel=function(){return c=!0},a},g=(d=({create:function(a){var c=arguments.length>1&& void 0!==arguments[1]?arguments[1]:{};A.initial(a),A.handler(c);var b={current:a},d=l(D)(b,c),e=l(C)(b),f=l(A.changes)(a),g=l(B)(b);return[function(){var a=arguments.length>0&& void 0!==arguments[0]?arguments[0]:function(a){return a};return A.selector(a),a(b.current)},function(a){(function(){for(var b=arguments.length,c=Array(b),a=0;a<b;a++)c[a]=arguments[a];return function(a){return c.reduceRight(function(a,b){return b(a)},a)}})(d,e,f,g)(a)}]}}).create({config:{paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs"}},isInitialized:!1,resolve:null,reject:null,monaco:null}),e=2,function b(a){if(Array.isArray(a))return a}(d)||function j(d,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(d)){var a=[],b=!0,f=!1,g=void 0;try{for(var h,c=d[Symbol.iterator]();!(b=(h=c.next()).done)&&(a.push(h.value),!e||a.length!==e);b=!0);}catch(i){f=!0,g=i}finally{try{b||null==c.return||c.return()}finally{if(f)throw g}}return a}}(d,e)||function d(a,c){if(a){if("string"==typeof a)return t(a,c);var b=Object.prototype.toString.call(a).slice(8,-1);if("Object"===b&&a.constructor&&(b=a.constructor.name),"Map"===b||"Set"===b)return Array.from(a);if("Arguments"===b||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(b))return t(a,c)}}(d,e)||function a(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),K=g[0],L=g[1];function M(a){return document.body.appendChild(a)}function N(e){var a,b,d=K(function(a){var b=a.config,c=a.reject;return{config:b,reject:c}}),c=(a="".concat(d.config.paths.vs,"/loader.js"),b=document.createElement("script"),a&&(b.src=a),b);return c.onload=function(){return e()},c.onerror=d.reject,c}function O(){var b=K(function(a){var b=a.config,c=a.resolve,d=a.reject;return{config:b,resolve:c,reject:d}}),a=window.require;a.config(b.config),a(["vs/editor/editor.main"],function(a){P(a),b.resolve(a)},function(a){b.reject(a)})}function P(a){K().monaco||L({monaco:a})}var Q=new Promise(function(a,b){return L({resolve:a,reject:b})}),R={config:function(b){var a=F.config(b),c=a.monaco,d=function(a,d){if(null==a)return{};var b,c,e=function(c,f){if(null==c)return{};var a,b,d={},e=Object.keys(c);for(b=0;b<e.length;b++)a=e[b],f.indexOf(a)>=0||(d[a]=c[a]);return d}(a,d);if(Object.getOwnPropertySymbols){var f=Object.getOwnPropertySymbols(a);for(c=0;c<f.length;c++)b=f[c],!(d.indexOf(b)>=0)&&Object.prototype.propertyIsEnumerable.call(a,b)&&(e[b]=a[b])}return e}(a,["monaco"]);L(function(a){return{config:H(a.config,d),monaco:c}})},init:function(){var a=K(function(a){var b=a.monaco,c=a.isInitialized,d=a.resolve;return{monaco:b,isInitialized:c,resolve:d}});if(!a.isInitialized){if(L({isInitialized:!0}),a.monaco)return a.resolve(a.monaco),J(Q);if(window.monaco&&window.monaco.editor)return P(window.monaco),a.resolve(window.monaco),J(Q);G(M,N)(O)}return J(Q)},__getMonacoInstance:function(){return K(function(a){return a.monaco})}},h=c(7294),o=c(5697),a=c.n(o);function S(){return(S=Object.assign||function(d){for(var a=1;a<arguments.length;a++){var b=arguments[a];for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(d[c]=b[c])}return d}).apply(this,arguments)}let T={display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"};var U=function({content:a}){return h.createElement("div",{style:T},a)},V={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}};function i({width:b,height:c,isEditorReady:a,loading:d,_ref:e,className:f,wrapperProps:g}){return h.createElement("section",S({style:{...V.wrapper,width:b,height:c}},g),!a&&h.createElement(U,{content:d}),h.createElement("div",{ref:e,style:{...V.fullWidth,...!a&&V.hide},className:f}))}i.propTypes={width:a().oneOfType([a().number,a().string]).isRequired,height:a().oneOfType([a().number,a().string]).isRequired,loading:a().oneOfType([a().element,a().string]).isRequired,isEditorReady:a().bool.isRequired,className:a().string,wrapperProps:a().object};var W=(0,h.memo)(i),X=function(a){(0,h.useEffect)(a,[])},Y=function(a,b,c=!0){let d=(0,h.useRef)(!0);(0,h.useEffect)(d.current||!c?()=>{d.current=!1}:a,b)};function b(){}function Z(a,c,d,b){return $(a,b)||_(a,c,d,b)}function $(a,b){return a.editor.getModel(aa(a,b))}function _(a,c,d,b){return a.editor.createModel(c,d,b&&aa(a,b))}function aa(a,b){return a.Uri.parse(b)}function j({original:b,modified:c,language:d,originalLanguage:e,modifiedLanguage:f,originalModelPath:j,modifiedModelPath:k,keepCurrentOriginalModel:w,keepCurrentModifiedModel:x,theme:g,loading:l,options:i,height:m,width:n,className:o,wrapperProps:p,beforeMount:q,onMount:r}){let[a,y]=(0,h.useState)(!1),[s,z]=(0,h.useState)(!0),A=(0,h.useRef)(null),B=(0,h.useRef)(null),t=(0,h.useRef)(null),C=(0,h.useRef)(r),D=(0,h.useRef)(q);X(()=>{let a=R.init();return a.then(a=>(B.current=a)&&z(!1)).catch(a=>(null==a?void 0:a.type)!=="cancelation"&&console.error("Monaco initialization: error:",a)),()=>A.current?E():a.cancel()}),Y(()=>{let a=A.current.getModifiedEditor();a.getOption(B.current.editor.EditorOption.readOnly)?a.setValue(c):c!==a.getValue()&&(a.executeEdits("",[{range:a.getModel().getFullModelRange(),text:c,forceMoveMarkers:!0}]),a.pushUndoStop())},[c],a),Y(()=>{A.current.getModel().original.setValue(b)},[b],a),Y(()=>{let{original:a,modified:b}=A.current.getModel();B.current.editor.setModelLanguage(a,e||d),B.current.editor.setModelLanguage(b,f||d)},[d,e,f],a),Y(()=>{B.current.editor.setTheme(g)},[g],a),Y(()=>{A.current.updateOptions(i)},[i],a);let u=(0,h.useCallback)(()=>{D.current(B.current);let a=Z(B.current,b,e||d,j),g=Z(B.current,c,f||d,k);A.current.setModel({original:a,modified:g})},[d,c,f,b,e,j,k]),v=(0,h.useCallback)(()=>{A.current=B.current.editor.createDiffEditor(t.current,{automaticLayout:!0,...i}),u(),B.current.editor.setTheme(g),y(!0)},[i,g,u]);function E(){var a,b;let c=A.current.getModel();w||null===(a=c.original)|| void 0===a||a.dispose(),x||null===(b=c.modified)|| void 0===b||b.dispose(),A.current.dispose()}return(0,h.useEffect)(()=>{a&&C.current(A.current,B.current)},[a]),(0,h.useEffect)(()=>{s||a||v()},[s,a,v]),h.createElement(W,{width:n,height:m,isEditorReady:a,loading:l,_ref:t,className:o,wrapperProps:p})}j.propTypes={original:a().string,modified:a().string,language:a().string,originalLanguage:a().string,modifiedLanguage:a().string,originalModelPath:a().string,modifiedModelPath:a().string,keepCurrentOriginalModel:a().bool,keepCurrentModifiedModel:a().bool,theme:a().string,loading:a().oneOfType([a().element,a().string]),options:a().object,width:a().oneOfType([a().number,a().string]),height:a().oneOfType([a().number,a().string]),className:a().string,wrapperProps:a().object,beforeMount:a().func,onMount:a().func},j.defaultProps={theme:"light",loading:"Loading...",options:{},keepCurrentOriginalModel:!1,keepCurrentModifiedModel:!1,width:"100%",height:"100%",wrapperProps:{},beforeMount:b,onMount:b};var ab=function(a){let b=(0,h.useRef)();return(0,h.useEffect)(()=>{b.current=a},[a]),b.current};let ac=new Map;function f({defaultValue:g,defaultLanguage:i,defaultPath:j,value:b,language:d,path:c,theme:e,line:k,loading:l,options:f,overrideServices:m,saveViewState:n,keepCurrentModel:A,width:o,height:p,className:q,wrapperProps:r,beforeMount:s,onMount:t,onChange:u,onValidate:v}){let[a,B]=(0,h.useState)(!1),[w,C]=(0,h.useState)(!0),D=(0,h.useRef)(null),E=(0,h.useRef)(null),x=(0,h.useRef)(null),F=(0,h.useRef)(t),G=(0,h.useRef)(s),H=(0,h.useRef)(null),y=(0,h.useRef)(b),I=ab(c);X(()=>{let a=R.init();return a.then(a=>(D.current=a)&&C(!1)).catch(a=>(null==a?void 0:a.type)!=="cancelation"&&console.error("Monaco initialization: error:",a)),()=>E.current?J():a.cancel()}),Y(()=>{let a=Z(D.current,g||b,i||d,c);a!==E.current.getModel()&&(n&&ac.set(I,E.current.saveViewState()),E.current.setModel(a),n&&E.current.restoreViewState(ac.get(c)))},[c],a),Y(()=>{E.current.updateOptions(f)},[f],a),Y(()=>{E.current.getOption(D.current.editor.EditorOption.readOnly)?E.current.setValue(b):b!==E.current.getValue()&&(E.current.executeEdits("",[{range:E.current.getModel().getFullModelRange(),text:b,forceMoveMarkers:!0}]),E.current.pushUndoStop())},[b],a),Y(()=>{D.current.editor.setModelLanguage(E.current.getModel(),d)},[d],a),Y(()=>{var a;void 0!==(a=k)&&E.current.revealLine(k)},[k],a),Y(()=>{D.current.editor.setTheme(e)},[e],a);let z=(0,h.useCallback)(()=>{G.current(D.current);let a=c||j,h=Z(D.current,b||g,i||d,a);E.current=D.current.editor.create(x.current,{model:h,automaticLayout:!0,...f},m),n&&E.current.restoreViewState(ac.get(a)),D.current.editor.setTheme(e),B(!0)},[g,i,j,b,d,c,f,m,n,e]);function J(){var a,b;null===(a=H.current)|| void 0===a||a.dispose(),A?n&&ac.set(c,E.current.saveViewState()):null===(b=E.current.getModel())|| void 0===b||b.dispose(),E.current.dispose()}return(0,h.useEffect)(()=>{a&&F.current(E.current,D.current)},[a]),(0,h.useEffect)(()=>{w||a||z()},[w,a,z]),y.current=b,(0,h.useEffect)(()=>{if(a&&u){var b,c;null===(b=H.current)|| void 0===b||b.dispose(),H.current=null===(c=E.current)|| void 0===c?void 0:c.onDidChangeModelContent(b=>{let a=E.current.getValue();y.current!==a&&u(a,b)})}},[a,u]),(0,h.useEffect)(()=>{if(a){let b=D.current.editor.onDidChangeMarkers(c=>{var a;let b=null===(a=E.current.getModel())|| void 0===a?void 0:a.uri;if(b){let d=c.find(a=>a.path===b.path);if(d){let e=D.current.editor.getModelMarkers({resource:b});null==v||v(e)}}});return()=>{null==b||b.dispose()}}},[a,v]),h.createElement(W,{width:o,height:p,isEditorReady:a,loading:l,_ref:x,className:q,wrapperProps:r})}f.propTypes={defaultValue:a().string,defaultPath:a().string,defaultLanguage:a().string,value:a().string,language:a().string,path:a().string,theme:a().string,line:a().number,loading:a().oneOfType([a().element,a().string]),options:a().object,overrideServices:a().object,saveViewState:a().bool,keepCurrentModel:a().bool,width:a().oneOfType([a().number,a().string]),height:a().oneOfType([a().number,a().string]),className:a().string,wrapperProps:a().object,beforeMount:a().func,onMount:a().func,onChange:a().func,onValidate:a().func},f.defaultProps={theme:"light",loading:"Loading...",options:{},overrideServices:{},saveViewState:!0,keepCurrentModel:!1,width:"100%",height:"100%",wrapperProps:{},beforeMount:b,onMount:b,onValidate:b};var ad=(0,h.memo)(f)},9239:function(a){"use strict";a.exports=b=>{let a=b.match(/^[ \t]*(?=\S)/gm);return a?a.reduce((a,b)=>Math.min(a,b.length),1/0):0}},2703:function(a,e,b){"use strict";var f=b(414);function c(){}function d(){}d.resetWarningCache=c,a.exports=function(){function a(c,d,e,g,h,b){if(b!==f){var a=Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function b(){return a}a.isRequired=a;var e={array:a,bigint:a,bool:a,func:a,number:a,object:a,string:a,symbol:a,any:a,arrayOf:b,element:a,elementType:a,instanceOf:b,node:a,objectOf:b,oneOf:b,oneOfType:b,shape:b,exact:b,checkPropTypes:d,resetWarningCache:c};return e.PropTypes=e,e}},5697:function(a,c,b){a.exports=b(2703)()},414:function(a){"use strict";a.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},1743:function(c,b,a){"use strict";a.d(b,{Z:function(){return e}});var d=a(9239);function e(a){let b=d(a);if(0===b)return a;let c=RegExp(`^[ \\t]{${b}}`,"gm");return a.replace(c,"")}}}])