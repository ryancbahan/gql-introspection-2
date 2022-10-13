import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Canvas, Edge, ElkRoot, Node, Port, PortProps } from "reaflow";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../utilities/fetch";
import { generateSchema } from "../../../server/generateSchema";
import adminApiIntrospection from "../../../graphql.schema.json";
import { formatMutation, Internal } from "./utilities/formatMutation";
import { getNodesAndEdges } from "./utilities/getNodesAndEdges";
import { NodeEditorPanel } from "./components/NodeEditorPanel";
import { from } from "@apollo/client";

export const DataSetEditor = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const { schema, mutation, id } = useParams();

  const [dataset, setDataset] = useState();
  const [nodeLookup, setNodeLookup] = useState();
  const [selectedNode, setSelectedNode] = useState();
  const [zoom, setZoom] = useState<number>(0.7);

  const ref = useRef(null);
  const validSchema = generateSchema(adminApiIntrospection);

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}/datasets/${id}`)
      .then((res) => res?.json())
      .then((json) => {
        const { nodeLookup } = formatMutation(json.mutationData, validSchema);

        setDataset(json.data);
        setNodeLookup(nodeLookup);
      });
  }, []);

  if (!dataset || !nodeLookup) return <div>loading...</div>;

  const { nodes, edges } = getNodesAndEdges(nodeLookup);

  if (!selectedNode) setSelectedNode(nodes[0]);

  const handleNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <>
      <Allotment>
        <Allotment.Pane minSize={200}>
          {selectedNode ? (
            <NodeEditorPanel
              setNodeLookup={setNodeLookup}
              nodeLookup={nodeLookup}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          ) : null}
        </Allotment.Pane>
        <Allotment.Pane snap>
          <pre
            style={{
              zIndex: 9,
              position: "absolute",
              top: 5,
              right: 15,
              background: "rgba(0, 0, 0, .5)",
              padding: 20,
              color: "white",
            }}
          >
            Zoom: {zoom}
            <br />
            <button
              style={{ display: "block", width: "100%", margin: "5px 0" }}
              onClick={() => ref?.current?.zoomIn()}
            >
              Zoom In
            </button>
            <button
              style={{ display: "block", width: "100%", margin: "5px 0" }}
              onClick={() => ref?.current?.zoomOut()}
            >
              Zoom Out
            </button>
            <button
              style={{ display: "block", width: "100%" }}
              onClick={() => ref?.current?.fitCanvas()}
            >
              Fit
            </button>
          </pre>
          <Canvas
            ref={ref}
            zoom={zoom}
            node={<Node selectable onClick={handleNodeClick} />}
            nodes={nodes}
            edges={edges}
            maxWidth={4000}
          />
        </Allotment.Pane>
      </Allotment>
    </>
  );
};
