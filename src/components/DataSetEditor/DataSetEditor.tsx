import { Page, Layout, Card } from "@shopify/polaris";
import React from "react";
import { useLocation } from "react-router-dom";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Editor from "@monaco-editor/react";
import { Canvas, Edge, ElkRoot } from "reaflow";

export const DataSetEditor = () => {
  return (
    <Allotment>
      <Allotment.Pane minSize={200}>
        <Editor defaultLanguage="graphql" defaultValue="// some comment" />
      </Allotment.Pane>
      <Allotment.Pane snap>
        <Canvas
          nodes={[
            {
              id: "1",
              text: "1",
            },
            {
              id: "2",
              text: "2",
            },
          ]}
          edges={[
            {
              id: "1-2",
              from: "1",
              to: "2",
            },
          ]}
        />
      </Allotment.Pane>
    </Allotment>
  );
};
