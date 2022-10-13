import React, { useState } from "react";
import { Stack, Checkbox, Badge, Toast, Button } from "@shopify/polaris";
import { Kind } from "graphql";

export function FieldChildrenRow({
  field,
  setNodeLookup,
  nodeLookup,
  setSelectedNode,
}) {
  const [active, setActive] = useState(false);

  const nonNullable = field.type.kind === Kind.NON_NULL_TYPE;

  const toastMarkup = active ? (
    <Toast
      content="Cannot remove required field"
      onDismiss={() => setActive(false)}
    />
  ) : null;

  return (
    <Stack alignment="center">
      <Stack.Item fill>
        <Stack alignment="center">
          <Stack.Item>
            <Checkbox
              label={field.name.value}
              checked={field.active}
              onChange={() => {
                if (nonNullable) {
                  setActive(true);
                } else {
                  const nextField = { ...field, active: !field.active };
                  setNodeLookup({
                    ...nodeLookup,
                    [nextField.id]: nextField,
                  });
                }
              }}
            />
          </Stack.Item>
          {nonNullable && (
            <Stack.Item>
              <Badge>Required</Badge>
            </Stack.Item>
          )}
        </Stack>
      </Stack.Item>
      {field.active && (
        <Stack.Item>
          <Button plain onClick={() => setSelectedNode(field)}>
            Go to field
          </Button>
        </Stack.Item>
      )}
      {toastMarkup}
    </Stack>
  );
}
