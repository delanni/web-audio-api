(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[205],{1885:function(a,b,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/02-gain-and-filter",function(){return c(1201)}])},3116:function(d,b,a){"use strict";var e=a(5893);a(7294);var f=a(9604),g=a(1743);function c(a){var b=a.children,c=a.code,d=a.onCodeUpdate,h=a.className,i=a.language,j="string"==typeof b?b:c;return(0,e.jsxs)("div",{className:h,children:[(0,e.jsx)(f.ZP,{defaultLanguage:i,defaultValue:(0,g.Z)(j||"").trim(),theme:"vs-dark",onChange:d,options:{minimap:{enabled:!1}}}),";"]})}b.Z=c},8582:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),_CodeEditorHost__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(3116),_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(947),_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3__),react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(7294),APPLICATION_ROOT_ID="application-root";function EditorSplitView(a){var c=a.code,b=a.html,i=a.runCodeOnLoad,f=a.children,d=(0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(b),g=d[0],j=d[1],e=(0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(c),h=e[0],k=e[1];return(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function(){i&&runCode(g,h)},[]),(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function(){window.onkeydown=function(a){a.metaKey&&("s"===a.key||"S"===a.key)&&(a.preventDefault(),runCode(g,h))}},[g,h]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().splitView,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().splitViewLeft,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CodeEditorHost__WEBPACK_IMPORTED_MODULE_1__.Z,{language:"html",code:b,className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().splitViewVertical,onCodeUpdate:function(a){return j(a||"")},children:b}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CodeEditorHost__WEBPACK_IMPORTED_MODULE_1__.Z,{language:"typescript",className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().splitViewVertical,onCodeUpdate:function(a){return k(a||"")},children:c}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().fullSizeButton,onClick:function(){return runCode(g,h)},children:"Run (\u2202\u222B\u2202)!"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{id:"split-view-controllers",className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().splitViewRight,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:_styles_ModulePages_module_css__WEBPACK_IMPORTED_MODULE_3___default().splitViewBaseContent,children:[f,(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{children:"\xa0"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{id:APPLICATION_ROOT_ID})]})]})}function tryRunCleanup(){if(eval("typeof window.cleanup !== 'undefined'"))try{eval("try { window.cleanup() } catch (e) { console.error(e) }")}catch(e){console.error("Error while running cleanup code: ",window.cleanup,e)}}function runCode(htmlCode,javascriptCode){tryRunCleanup(),document.getElementById(APPLICATION_ROOT_ID).innerHTML=htmlCode;var cleanupSectionIndex=javascriptCode.split("\n").findIndex(function(a){return a.trim().includes("CLEANUP")}),runnableCode=javascriptCode.split("\n").slice(0,cleanupSectionIndex).join("\n"),cleanupJavascriptCode=javascriptCode.split("\n").slice(cleanupSectionIndex+1).join("\n"),cleanupHook="window.cleanup = () => {\n".concat(cleanupJavascriptCode,"\n    }"),script=runnableCode+"\n"+cleanupHook;eval(script)}__webpack_exports__.Z=EditorSplitView},1201:function(d,b,a){"use strict";a.r(b);var e=a(5893),f=a(8582),c=function(){var a='\n    <div>\n      <select id="waveform">\n        <option selected value="sine">Sine wave</input>\n        <option value="sawtooth">Sawtooth</input>\n        <option value="square">Square wave</input>\n        <option value="triangle">Triangle wave</input>\n      </select>\n    </div>\n\n    <div>\n      <input id="frequency-dial" type="range" min="1" max="4" step="0.001"\n             value="2.342422680822206" />\n      Output Frequency: <span id="frequency-indicator">440 Hz</span>\n    </div>\n\n    <div>\n      <input id="cutoff-dial" type="range" min="1" max="4" step="0.001" value="4" />\n      Cutoff: <span id="cutoff-indicator">20000 Hz</span>\n    </div>\n\n    <div>\n      <input id="q-dial" type="range" min="0" max="100" step="0.01" value="1" />\n      Q value: <span id="q-indicator">1</span>\n    </div>\n\n    <div>\n      <input id="gain-dial" type="range" min="0" max="3" step="0.01" value="1" />\n      Gain: <span id="gain-indicator">1</span>\n    </div>\n\n    <button id="btn">Beep!</button>\n  ',b="\n    const audioCtx = new AudioContext();\n    const oscillator = audioCtx.createOscillator();\n    const filterNode = audioCtx.createBiquadFilter();\n    const gainNode = audioCtx.createGain(); // create a gain node\n\n    oscillator.connect(filterNode); // connect the oscillator to the gain node\n    filterNode.connect(gainNode); // connect the gain node to the filter node\n    gainNode.connect(audioCtx.destination); // connect the filter node to the audio context destination (the speakers)\n\n    document.getElementById(\"gain-dial\").oninput = e => {\n      const v = parseFloat(e.target.value);\n      document.getElementById('gain-indicator').innerText = Math.round(v * 100) + '%';\n      gainNode.gain.value = v;\n    }\n\n    document.getElementById(\"q-dial\").oninput = e => {\n      const v = parseFloat(e.target.value);\n      document.getElementById('q-indicator').innerText = v.toFixed(2);\n      filterNode.Q.value = v;\n    }\n\n    [\"frequency\", \"cutoff\"].forEach(filterName => {\n      document.getElementById(filterName + \"-dial\").oninput = e => {\n        const v = parseFloat(e.target.value);\n        const filterValueHz = Math.round(2 * (10 ** v));\n        document.getElementById(filterName + \"-indicator\").innerText = filterValueHz + ' Hz';\n        \n        if (filterName === \"frequency\") {\n          oscillator.frequency.value = filterValueHz;\n        } else {\n          filterNode.frequency.value = filterValueHz;\n        }\n      }\n    })\n    \n    document.getElementById(\"waveform\").onchange = e => {\n        oscillator.type = e.target.value; // Set oscillator waveform\n    };\n    \n    ['frequency', 'cutoff', 'q', 'gain'].forEach(inputName => {\n      const inputDial = document.getElementById(inputName + \"-dial\");\n      inputDial.oninput({target: inputDial});\n    });\n\n    document.getElementById('btn').onclick = () => oscillator.start();\n\n    /* CLEANUP */\n    oscillator.stop();\n    audioCtx.close();\n  ";return(0,e.jsx)(f.Z,{code:b,html:a,runCodeOnLoad:!0})};b.default=c},947:function(a){a.exports={splitView:"ModulePages_splitView__2k9eX",splitViewLeft:"ModulePages_splitViewLeft__KnnTd",splitViewRight:"ModulePages_splitViewRight__UKfJG",splitViewVertical:"ModulePages_splitViewVertical__uHpn6",splitViewBaseContent:"ModulePages_splitViewBaseContent__yEx7x",fullSizeButton:"ModulePages_fullSizeButton__HPwUm"}}},function(a){var b=function(b){return a(a.s=b)};a.O(0,[551,774,888,179],function(){return b(1885)}),_N_E=a.O()}])