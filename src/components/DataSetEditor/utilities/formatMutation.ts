import { GraphQLSchema, Kind } from "graphql";
import { v4 as uuid } from "uuid";
import { getTypeName } from "../../../utilities/generateMutations";

export enum Internal {
  Root = "root",
}

export function formatMutation(mutation, schema: GraphQLSchema) {
  const nodeLookup = {};

  const formattedMutation = {
    id: uuid(),
    name: { ...mutation.name },
    type: { ...mutation.type },
    description: { ...mutation.description },
    kind: mutation.kind,
    value: Internal.Root,
    text: mutation.name.value,
    active: true,
    parentId: null,
  };

  nodeLookup[formattedMutation.id] = formattedMutation;

  mutation.arguments.forEach((argument) => {
    const formattedArgument = {
      id: uuid(),
      name: { ...argument.name },
      type: { ...argument.type },
      description: { ...argument.description },
      kind: argument.kind,
      value: null,
      text: argument.name.value,
      active: argument.type.kind === Kind.NON_NULL_TYPE,
      parentId: formattedMutation.id,
    };

    nodeLookup[formattedArgument.id] = formattedArgument;

    const typeName = getTypeName(argument.type);
    const fieldType = schema.getType(typeName);

    if (fieldType?.astNode) {
      iterateThroughNodes(
        schema,
        fieldType.astNode,
        formattedArgument,
        nodeLookup
      );
    }
  });

  return { nodeLookup };
}

const iterateThroughNodes = (schema, node, parentNode, nodeLookup) => {
  if (node.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
    node.fields.forEach((field) => {
      const formattedNode = {
        id: uuid(),
        name: { ...field.name },
        type: { ...field.type },
        description: { ...field.description },
        kind: field.kind,
        value: null,
        text: field.name.value,
        active: field.type.kind === Kind.NON_NULL_TYPE,
        parentId: parentNode.id,
      };

      nodeLookup[formattedNode?.id] = formattedNode;

      const typeName = getTypeName(field.type);
      const fieldType = schema.getType(typeName);

      if (fieldType?.astNode) {
        iterateThroughNodes(
          schema,
          fieldType.astNode,
          formattedNode,
          nodeLookup
        );
      }
    });
  } else {
    console.log(node);
  }
};
