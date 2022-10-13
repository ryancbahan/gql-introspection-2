import React from "react";
import { Card, TextContainer, Stack, Badge, Checkbox } from "@shopify/polaris";
import { Kind } from "graphql";

export function NodeEditorPanel({
  selectedNode,
  setSelectedNode,
  nodeLookup,
  setNodeLookup,
}) {
  const children = Object.values(nodeLookup).filter(
    (node) => node?.parentId === selectedNode.id
  );
  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Card title={selectedNode.name.value}>
        <Card.Section>
          <TextContainer>
            <p>{selectedNode.description?.value}</p>
          </TextContainer>
        </Card.Section>
        {children?.length ? (
          <Card.Section title="Fields">
            <Stack vertical>
              {children?.map((child) => (
                <div key={child.id}>
                  <Stack alignment="center">
                    <Checkbox
                      label={child.name.value}
                      checked={child.active}
                      onChange={() => {
                        const nextChild = { ...child, active: !child.active };
                        setNodeLookup({
                          ...nodeLookup,
                          [nextChild.id]: nextChild,
                        });
                      }}
                    />
                    {child.type.kind === Kind.NON_NULL_TYPE && (
                      <Badge>Required</Badge>
                    )}
                  </Stack>
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
