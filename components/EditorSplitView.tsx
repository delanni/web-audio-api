import CodeEditorHost from "./CodeEditorHost";
import styles from "../styles/ModulePages.module.css";
import React, { useEffect, useState } from "react";

const APPLICATION_ROOT_ID = "application-root";

export function EditorSplitView({ code, html, runCodeOnLoad, children }: { code: string, html: string, runCodeOnLoad?: boolean, children?: React.ReactNode }) {
  const [htmlCode, setHtml] = useState<string>(html);
  const [javascriptCode, setJavascript] = useState<string>(code);


  useEffect(() => {
    if (runCodeOnLoad) {
      runCode(htmlCode, javascriptCode);
    }
  }, []);

  useEffect(() => {
    window.onkeydown = e => {
      if (e.metaKey && (e.key === 's' || e.key === "S")) {
        e.preventDefault();
        runCode(htmlCode, javascriptCode);
      }
    };
  }, [htmlCode, javascriptCode]);

  return <div className={styles.splitView}>
    <div className={styles.splitViewLeft}>

      <CodeEditorHost language={"html"}
                      code={html}
                      className={styles.splitViewVertical}
                      onCodeUpdate={code => setHtml(code || "")}>
        {html}
      </CodeEditorHost>

      <CodeEditorHost language={"typescript"}
                      className={styles.splitViewVertical}
                      onCodeUpdate={code => setJavascript(code || "")}>
        {code}
      </CodeEditorHost>

      <button className={styles.fullSizeButton}
              onClick={() => runCode(htmlCode, javascriptCode)}>Run (∂∫∂)!
      </button>
    </div>
    <div id="split-view-controllers" className={styles.splitViewRight}>
      <div className={styles.splitViewBaseContent}>
        {children}
        <div>&nbsp;</div>
      </div>
      <div id={APPLICATION_ROOT_ID}>
      </div>
    </div>
  </div>;
}

function tryRunCleanup() {
  if (eval("typeof window.cleanup !== 'undefined'")) {
    try {
      eval("try { window.cleanup() } catch (e) { console.error(e) }");
    } catch (e) {
      console.error("Error while running cleanup code: ", (window as any).cleanup, e);
    }
  }
}

function runCode(htmlCode: string, javascriptCode: string) {
  tryRunCleanup();

  document.getElementById(APPLICATION_ROOT_ID)!.innerHTML = htmlCode;

  const cleanupSectionIndex = javascriptCode.split("\n").findIndex(line => line.trim().includes("CLEANUP"));
  const runnableCode = javascriptCode.split("\n").slice(0, cleanupSectionIndex).join("\n");

  const cleanupJavascriptCode = javascriptCode.split("\n").slice(cleanupSectionIndex + 1).join("\n");
  const cleanupHook = `window.cleanup = () => {
${cleanupJavascriptCode}
    }`;

  const script = runnableCode + "\n" + cleanupHook;
  eval(script);
}

export default EditorSplitView;