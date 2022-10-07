import { generateMutations } from "./generateMutations.ts";
import {
  buildClientSchema,
  printSchema,
  Source,
  buildSchema,
  getIntrospectionQuery,
  IntrospectionQuery,
  print,
  GraphQLSchema,
} from "graphql";

export function generateMutationsFromSchema(schema: IntrospectionQuery) {
  const builtSchema = buildClientSchema(schema);
  const schemaLanguage = printSchema(builtSchema);
  const source = new Source(schemaLanguage);
  const validSchema = buildSchema(source, { assumeValidSDL: true });
  const mutationList = generateMutations(validSchema);

  return mutationList;
}
