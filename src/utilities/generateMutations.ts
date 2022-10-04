import {
  Kind,
  GraphQLSchema,
  OperationTypeNode,
  Location,
  DocumentNode,
  NameNode,
  FieldDefinitionNode,
  TypeNode,
  SelectionSetNode,
  InputObjectTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  ArgumentNode,
  VariableDefinitionNode,
  DefinitionNode,
} from "graphql";
import * as graphqlData from "../generated/graphql";
import * as graphqlDataTypes from "../generated/graphql";
import * as storefrontData from "../generated/storefront-graphql";

const FIELDS = ["firstName", "lastName", "title"];

function getName(name: string): NameNode {
  return {
    kind: Kind.NAME,
    value: name,
  };
}

// Default location
const loc: any = {
  start: 0,
  end: 0,
  startToken: null,
  endToken: null,
  source: null,
};

function getDocumentDefinition(definitions: any): DocumentNode {
  return {
    kind: Kind.DOCUMENT,
    definitions,
    loc,
  };
}

function getVariableDefinition(
  name: string,
  type: TypeNode
): VariableDefinitionNode {
  return {
    kind: Kind.VARIABLE_DEFINITION,
    type: type,
    variable: {
      kind: Kind.VARIABLE,
      name: getName(name),
    },
  };
}

function getVariable(argName: string, varName: string): ArgumentNode {
  return {
    kind: Kind.ARGUMENT,
    loc,
    name: getName(argName),
    value: {
      kind: Kind.VARIABLE,
      name: getName(varName),
    },
  };
}

export function getTypeName(type: TypeNode): string {
  if (type?.kind === Kind.NAMED_TYPE) {
    return type.name.value;
  } else if (type?.kind === Kind.LIST_TYPE) {
    return getTypeName(type.type);
  } else if (type?.kind === Kind.NON_NULL_TYPE) {
    return getTypeName(type.type);
  } else {
    throw new Error(`Cannot get name of type: ${type}`);
  }
}

function isListType(type: TypeNode): boolean {
  if (type.kind === "NamedType") {
    return false;
  } else {
    if (type.kind === "ListType") {
      return true;
    } else {
      return isListType(type.type);
    }
  }
}

const getScalarValue = (argTypeName: string) => {
  if (argTypeName === "String") {
    return "Placeholder";
  }
  if (argTypeName === "Boolean") {
    return true;
  }
  if (argTypeName === "ID") {
    return "Placeholder ID";
  }

  if (argTypeName === "Int") {
    return 10;
  }

  if (argTypeName === "Float") {
    return 10.0;
  }
};

const getCustomScalarValue = (argTypeName: string) => {
  if (argTypeName === "Decimal") {
    return "10.00";
  }

  if (argTypeName === "URL") {
    return "https://google.com";
  }

  if (argTypeName === "DateTime") {
    return new Date().toISOString();
  }

  return "todo: custom scalar value";
};

const getEnumTypeValue = (argTypeName: string) => {
  const lookup = graphqlData as any;
  const sfLookup = storefrontData as any;

  if (argTypeName === "CurrencyCode") {
    return graphqlData.CurrencyCode.Usd;
  }

  const value = lookup[argTypeName]
    ? Object.keys(lookup[argTypeName])[0]
    : Object.keys(sfLookup[argTypeName])[0];

  if (value) {
    return value;
  } else {
    throw new Error("can't find enum to seed");
  }
};

const getNestedObjectValues = (
  node: InputObjectTypeDefinitionNode,
  schema: GraphQLSchema
) => {
  const output: { [key: string]: any } = {};
  const fields = node.fields;

  fields?.forEach((field) => {
    const fieldTypeName = getTypeName(field.type);
    const fieldTyping = schema.getType(fieldTypeName);
    const nextNode = fieldTyping?.astNode;

    if (
      !isNonNullType(field.type) &&
      !FIELDS.find((f) => f.includes(field?.name?.value))
    )
      return;

    if (!nextNode) {
      output[field.name.value] = getScalarValue(fieldTypeName);
    }

    if (nextNode?.kind === Kind.SCALAR_TYPE_DEFINITION) {
      output[field.name.value] = getCustomScalarValue(fieldTypeName);
    }

    if (nextNode?.kind === Kind.ENUM_TYPE_DEFINITION) {
      output[field.name.value] = getEnumTypeValue(fieldTypeName);
    }

    if (nextNode?.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
      const { output: nextOutput } = getNestedObjectValues(nextNode, schema);
      output[field.name.value] = nextOutput;
    }
  });

  return { output };
};

function isNonNullType(type: TypeNode) {
  return type.kind === "NonNullType";
}

const generateArgsForMutation = (
  mutation: FieldDefinitionNode,
  schema: GraphQLSchema
) => {
  const mutationArgs = mutation.arguments;

  const output: { [key: string]: any } = {};

  mutationArgs?.forEach((argument) => {
    const varName = argument.name.value;
    const argTypeName = getTypeName(argument.type);
    const fieldTyping = schema.getType(argTypeName);
    const nextNode = fieldTyping?.astNode;
    const isList = isListType(argument.type);

    if (
      !isNonNullType(argument.type) &&
      !FIELDS.find((field) => field.includes(argument.name.value))
    )
      return;

    if (isList && !nextNode) {
      output[varName] = [getScalarValue(argTypeName)];
      return;
    }

    if (!nextNode) {
      output[varName] = getScalarValue(argTypeName);
      return;
    }

    if (nextNode?.kind === Kind.SCALAR_TYPE_DEFINITION) {
      output[varName] = getCustomScalarValue(argTypeName);
      return;
    }

    if (nextNode?.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
      const { output: nextOutput } = getNestedObjectValues(nextNode, schema);
      output[varName] = nextOutput;
      return;
    }

    if (nextNode?.kind === Kind.ENUM_TYPE_DEFINITION) {
      output[varName] = getEnumTypeValue(argTypeName);
      return;
    }
  });

  return { output };
};

let isFirst = true;

const generateFieldsAndVarsForMutation = ({
  node,
  parentNode = null,
  crossReferenceList = [],
  schema,
}) => {
  const mutationTypeName = getTypeName(node.type);
  const mutationFieldTyping = schema.getType(mutationTypeName) as any;
  const fields = mutationFieldTyping?.astNode?.fields;
  const selections: any[] = [];
  const args: ArgumentNode[] = [];
  const variableDefinitionsMap: {
    [varName: string]: VariableDefinitionNode;
  } = {};

  node?.arguments?.forEach((arg) => {
    // if (!isNonNullType(arg.type)) return

    const varName = arg.name.value;
    variableDefinitionsMap[varName] = getVariableDefinition(varName, arg.type);
    args.push(getVariable(arg.name.value, varName));
  });

  const selectionSet: { kind: Kind; selections: any[] } = {
    kind: Kind.SELECTION_SET,
    selections: [],
  };

  selections.push({
    kind: Kind.FIELD,
    name: getName(node.name.value),
    selectionSet,
    arguments: args,
  });

  const crossReferenceKey = `${parentNode?.name?.value}To${node?.name?.value}`;

  if (crossReferenceList.find((item) => item === crossReferenceKey))
    return { selections, variableDefinitionsMap };

  crossReferenceList.push(crossReferenceKey);

  fields?.forEach((field: FieldDefinitionNode) => {
    const fieldTypeName = getTypeName(field.type);
    const fieldTyping = schema.getType(fieldTypeName);

    if (!field.name.value.includes("userErrors") && isFirst) return;

    isFirst = false;

    // if (!isNonNullType(field.type)) return

    if (fieldTyping?.getFields) {
      const { selections: nextSelections } = generateFieldsAndVarsForMutation({
        node: field,
        parentNode: node,
        schema,
        crossReferenceList,
      });
      selectionSet.selections.push(nextSelections);
    } else {
      const selection = {
        kind: Kind.FIELD,
        name: getName(field.name.value),
        arguments: [],
      };

      selectionSet.selections.push(selection);
    }
  });

  isFirst = true;

  return { selections, variableDefinitionsMap };
};

export function generateMutations(schema: GraphQLSchema) {
  const mutationRoot = schema.getMutationType()!.astNode!;

  const queryRoot = schema.getQueryType()!.astNode!;

  // console.log({ queryRoot });

  // const testing = [mutationRoot.fields[21]];
  const real = mutationRoot?.fields;

  // console.log({ real });
  // console.log(real?.map((item) => item.name.value));

  const outputs = real?.map((field) => {
    const mutationInfo = {
      name: field.name.value,
      description: field.description,
      args: field.arguments,
    };
    const { output: variableValues } = generateArgsForMutation(field, schema);
    const { selections, variableDefinitionsMap } =
      generateFieldsAndVarsForMutation({ node: field, schema });

    const selectionSet = {
      kind: Kind.SELECTION_SET,
      selections,
    };

    const document = {
      kind: Kind.OPERATION_DEFINITION,
      operation: "mutation" as OperationTypeNode,
      selectionSet,
      variableDefinitions: Object.values(variableDefinitionsMap),
      loc,
      name: getName(field?.name?.value),
    };

    const definitions = [document];
    const mutationDocument = getDocumentDefinition(definitions);

    return {
      mutationInfo,
      mutationDocument,
      variableValues,
    };
  });

  return outputs;
}
