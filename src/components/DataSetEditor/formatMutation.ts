import { GraphQLSchema, Kind } from "graphql";
import { v4 as uuid } from "uuid";
import { getTypeName } from "../../utilities/generateMutations";

export enum Internal {
  Root = "root",
}

export function formatMutation(mutation, schema: GraphQLSchema) {
  const formattedMutation = {
    id: uuid(),
    children: [],
    name: { ...mutation.name },
    type: { ...mutation.type },
    description: { ...mutation.description },
    kind: mutation.kind,
    value: Internal.Root,
    text: mutation.name.value,
  };

  mutation.arguments.forEach((argument) => {
    const formattedArgument = {
      id: uuid(),
      children: [],
      name: { ...argument.name },
      type: { ...argument.type },
      description: { ...argument.description },
      kind: argument.kind,
      value: undefined,
      text: argument.name.value,
    };

    formattedMutation.children.push(formattedArgument);

    const typeName = getTypeName(argument.type);
    const fieldType = schema.getType(typeName);

    if (fieldType?.astNode) {
      iterateThroughNodes(schema, fieldType.astNode, formattedArgument);
    }
  });

  return formattedMutation;
}

const iterateThroughNodes = (schema, node, parentNode) => {
  if (node.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
    node.fields.forEach((field) => {
      const formattedNode = {
        id: uuid(),
        children: [],
        name: { ...field.name },
        type: { ...field.type },
        description: { ...field.description },
        kind: field.kind,
        value: undefined,
        text: field.name.value,
      };

      parentNode.children.push(formattedNode);

      const typeName = getTypeName(field.type);
      const fieldType = schema.getType(typeName);

      if (fieldType?.astNode) {
        iterateThroughNodes(schema, fieldType.astNode, formattedNode);
      }
    });
  } else {
    console.log(node);
  }
};
