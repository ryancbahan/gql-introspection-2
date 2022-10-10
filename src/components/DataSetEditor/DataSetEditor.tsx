import { Page, Layout, Card } from "@shopify/polaris";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}/datasets/${id}`)
      .then((res) => res?.json())
      .then((json) => setDataset(json.data));
  }, []);

  console.log({ dataset });

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
