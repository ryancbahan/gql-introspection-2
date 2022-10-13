import React from "react";
import { Card, TextContainer, Stack } from "@shopify/polaris";
import { FieldChildrenRow } from "./FieldChildrenRow";
import { FieldInfo } from "./FieldInfo";

export function NodeEditorPanel({
  selectedNode,
  setSelectedNode,
  nodeLookup,
  setNodeLookup,
  schema,
}) {
  const children = Object.values(nodeLookup).filter(
    (node) => node?.parentId === selectedNode.id
  );
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Card title={selectedNode.name.value}>
        <Card.Section>
          <FieldInfo
            schema={schema}
            field={selectedNode}
            nodeLookup={nodeLookup}
            setNodeLookup={setNodeLookup}
          />
        </Card.Section>
        {children?.length ? (
          <Card.Section title="Fields">
            <Stack vertical>
              {children?.map((child) => (
                <div key={child.id}>
                  <FieldChildrenRow
                    setSelectedNode={setSelectedNode}
                    field={child}
                    nodeLookup={nodeLookup}
                    setNodeLookup={setNodeLookup}
                  />
                </div>
              ))}
            </Stack>
          </Card.Section>
        ) : null}
      </Card>
      {/* <Editor
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
      /> */}
    </div>
  );
}
