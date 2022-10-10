import { Page, Layout, Card } from "@shopify/polaris";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Editor from "@monaco-editor/react";
import { Canvas, Edge, ElkRoot } from "reaflow";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../utilities/fetch";

export const DataSetEditor = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const { schema, mutation, id } = useParams();
  const [dataset, setDataset] = useState();
  const editorRef = useRef(null);

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}/datasets/${id}`)
      .then((res) => res?.json())
      .then((json) => setDataset(json.data));
  }, []);

  if (!dataset) return <div>loading...</div>;

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.getAction("editor.action.formatDocument").run();
  }

  console.log(dataset?.data);

  // [
  //   {
  //     id: "1",
  //     text: "1",
  //   },
  //   {
  //     id: "2",
  //     text: "2",
  //   },
  // ]

  const formattedData = Object.keys(dataset.data).map((item) => ({
    id: Math.random().toString(),
    text: item,
  }));
  const initialEditorValue = JSON.stringify(dataset.data);
  console.log({ initialEditorValue });

  return (
    <Allotment>
      <Allotment.Pane minSize={200}>
        <Editor
          defaultLanguage="json"
          defaultValue={initialEditorValue}
          onMount={handleEditorDidMount}
          options={{
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: "hidden",
            },
            minimap: { enabled: false },
            overviewRulerBorder: false,
          }}
        />
      </Allotment.Pane>
      <Allotment.Pane snap>
        <Canvas
          nodes={formattedData}
          // edges={[
          //   {
          //     id: "1-2",
          //     from: "1",
          //     to: "2",
          //   },
          // ]}
        />
      </Allotment.Pane>
    </Allotment>
  );
};
