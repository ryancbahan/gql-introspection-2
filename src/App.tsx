import React, { useState, useEffect } from 'react';
import introspectionQuery from '../graphql.schema.json'
import { buildClientSchema, printSchema, Source, buildSchema, IntrospectionQuery, print, GraphQLSchema } from 'graphql'
import enTranslations from '@shopify/polaris/locales/en.json';
import { addMocksToSchema, createMockStore } from '@graphql-tools/mock'
import { HomePage } from './HomePage';
import {
  AppProvider,
  Frame,
} from '@shopify/polaris';
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
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { gql, useMutation } from "@apollo/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import {
  generateMutations,
} from "./generateMutations";
import { DetailsPage } from './DetailsPage';

export function userLoggedInFetch(app: any) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: any, options: any) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

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
  const [list, setList] = useState<any[]>([])
  const [mockSchema, setMockSchema] = useState<GraphQLSchema | undefined>()

  useEffect(() => {
    if (!list.length) {
      const builtSchema = buildClientSchema(introspectionQuery as IntrospectionQuery);
      const schemaLanguage = printSchema(builtSchema);
      const source = new Source(schemaLanguage);
      const validSchema = buildSchema(source, { assumeValidSDL: true });
      const store = createMockStore({ schema: validSchema })
      const schemaWithMocks = addMocksToSchema({ schema: validSchema, store })
      const mutationList: any[] = generateMutations(validSchema)!;
      setMockSchema(schemaWithMocks)
      setList(mutationList)
    }
  }, [])

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
                <Route path="/" element={<HomePage list={list} />} />
                <Route path="/:mutation" element={<DetailsPage list={list} mockSchema={mockSchema} />} />
              </Routes>
            </Router>
          </Frame>
        </MyProvider>
      </AppBridgeProvider>
    </AppProvider >
  )
}

export default App
