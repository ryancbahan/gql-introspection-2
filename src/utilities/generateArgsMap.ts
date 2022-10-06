import { GraphQLSchema } from "graphql";
import { getTypeName } from "./generateMutations";

export function generateArgsMap(schema: GraphQLSchema) {
  const mutationType = schema.getMutationType();
  const mutations = Object.values(mutationType!.getFields());

  const typeMap = schema.getTypeMap();
  const inputs = Object.values(typeMap).filter((item) => {
    const type = schema.getType(item.name);

    return (
      type?.astNode?.kind === "InputObjectTypeDefinition" ||
      type?.astNode?.kind === "EnumTypeDefinition" ||
      type?.astNode?.kind === "ScalarTypeDefinition"
    );
  });

  const argMap = {};

  const test = [mutations[21]];

  mutations.forEach((mutation) => {
    const innerArgMap = {};
    const args = mutation.args;

    args.forEach((arg) => {
      const astNode = arg?.astNode;

      if (!astNode) {
        throw new Error(`no ast node for ${arg.name}`);
      }

      const argTypeName = getTypeName(astNode.type);
      const argType = schema.getType(argTypeName);

      innerArgMap[arg.name] = argType;
    });

    argMap[mutation.name] = innerArgMap;
  });

  console.log({ argMap });

  return { mutations, argMap };
}
