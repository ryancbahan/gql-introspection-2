import React, { useState, useEffect } from "react";
import introspectionQuery from "../graphql.schema.json";
import storefrontIntrospectionQuery from "../storefront-graphql.schema.json";
import {
  buildClientSchema,
  printSchema,
  Source,
  buildSchema,
  IntrospectionQuery,
  GraphQLSchema,
} from "graphql";
import enTranslations from "@shopify/polaris/locales/en.json";
import { addMocksToSchema, createMockStore } from "@graphql-tools/mock";
import {
  HomePage,
  DetailsPage,
  InternalDetailsPage,
  DataSetEditor,
} from "./components";
import { AppProvider, Frame } from "@shopify/polaris";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { userLoggedInFetch } from "./utilities/fetch";

import { generateMutations } from "./utilities/generateMutations";

function MyProvider({ children }: { children: React.ReactNode }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

function App() {
  const [list, setList] = useState<any[]>([]);
  const [sfList, setSfList] = useState<any[]>([]);
  const [mockSchema, setMockSchema] = useState<GraphQLSchema | undefined>();
  const [schema, setSchema] = useState<GraphQLSchema | undefined>();
  const [introspectionResult, setIntrospectionResult] = useState<
    GraphQLSchema | undefined
  >();

  useEffect(() => {
    if (!list.length) {
      const builtSchema = buildClientSchema(
        introspectionQuery as IntrospectionQuery
      );
      const schemaLanguage = printSchema(builtSchema);
      const source = new Source(schemaLanguage);
      const validSchema = buildSchema(source, { assumeValidSDL: true });
      const store = createMockStore({ schema: validSchema });
      const schemaWithMocks = addMocksToSchema({ schema: validSchema, store });
      const mutationList: any[] = generateMutations(validSchema)!;
      setSchema(validSchema);
      setMockSchema(schemaWithMocks);
      setIntrospectionResult(introspectionQuery);
      setList(mutationList);

      const storefrontSchema = buildClientSchema(
        storefrontIntrospectionQuery as IntrospectionQuery
      );
      const storefrontSchemaLanguage = printSchema(storefrontSchema);
      const storefrontSource = new Source(storefrontSchemaLanguage);
      const storefrontValidSchema = buildSchema(storefrontSource, {
        assumeValidSDL: true,
      });

      const storefrontMutations = generateMutations(storefrontValidSchema);
      setSfList(storefrontMutations);
    }
  }, []);

  return (
    <AppProvider i18n={enTranslations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY!,
          host: new URL(location.href).searchParams.get("host")!,
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <Frame>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage schema={schema} list={list} sfList={sfList} />
                  }
                />
                <Route
                  path="/:mutation"
                  element={
                    <DetailsPage
                      schema={introspectionResult}
                      list={list}
                      sfList={sfList}
                      mockSchema={mockSchema}
                    />
                  }
                />
                <Route
                  path="/internal/:mutation"
                  element={<InternalDetailsPage schema={schema} />}
                />
                <Route
                  path="/internal/:mutation/:dataSetId"
                  element={<DataSetEditor />}
                />
              </Routes>
            </Router>
          </Frame>
        </MyProvider>
      </AppBridgeProvider>
    </AppProvider>
  );
}

export default App;
