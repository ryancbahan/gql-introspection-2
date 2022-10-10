import { Page, Layout, Card, Button } from "@shopify/polaris";
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
  const [mutationData, setMutationData] = useState();
  const editorRef = useRef(null);

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}/datasets/${id}`)
      .then((res) => res?.json())
      .then((json) => {
        setDataset(json.data);
        setMutationData(json.mutation);
      });
  }, []);

  if (!dataset) return <div>loading...</div>;

  console.log(mutationData);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.getAction("editor.action.formatDocument").run();
  }

  const getFormattedData = () => {
    const rootId = Math.random().toString();
    const rootNode = { id: rootId, text: mutation };
    const nodes = [rootNode];
    const edges = [];

    const iterate = (obj, parentId) => {
      const entries = Object.entries(obj);

      entries.forEach((entry) => {
        const [key, value] = entry;
        const id = Math.random().toString();

        const node = {
          id,
          text: key,
        };

        const edge = {
          id: Math.random().toString(),
          from: parentId,
          to: id,
        };

        nodes.push(node);
        edges.push(edge);

        if (typeof value === "object") {
          iterate(value, id);
        }
      });
    };

    iterate(dataset.data, rootId);

    return { nodes, edges };
  };

  const { nodes, edges } = getFormattedData();

  const initialEditorValue = JSON.stringify(dataset.data);

  return (
    <>
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
          <Canvas nodes={nodes} edges={edges} />
        </Allotment.Pane>
      </Allotment>
    </>
  );
};
