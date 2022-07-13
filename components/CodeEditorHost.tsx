import React from "react";
import Editor  from "@monaco-editor/react";
import stripIndent from "strip-indent";
import * as monaco from "monaco-editor";

export default CodeEditorHost;

type CodeEditorProps = {
  children?: React.ReactNode,
  language: string,
  code?: string,
  className: string,
  onCodeUpdate?: (code: string | undefined, modelUpdateEvent: monaco.editor.IModelContentChangedEvent) => void
}

export function CodeEditorHost(props: CodeEditorProps) {
  const {
    children,
    code,
    onCodeUpdate,
    className,
      language
  } = props;

  const codeContent = typeof children === "string" ? children : code;

  return <div className={className}>
    <Editor
        defaultLanguage={language}
        defaultValue={stripIndent(codeContent || '').trim()}
        theme={"vs-dark"}
        onChange={onCodeUpdate}
        options={{
          minimap: {
            enabled: false
          }
        }}
    />;
  </div>
}
