import React, { useState, useEffect } from 'react';
import introspectionQuery from '../graphql.schema.json'
import { buildClientSchema, printSchema, Source, buildSchema, IntrospectionQuery, print } from 'graphql'
import enTranslations from '@shopify/polaris/locales/en.json';
import synthwave84 from 'prism-react-renderer/themes/synthwave84';
import Highlight, { defaultProps } from "prism-react-renderer";
import { MutationResourceItem } from './ResourceItem';
import {
  AppProvider,
  Page,
  ResourceList,
  ResourceItem,
  Stack,
  Filters,
  TextField,
  Frame,
  Pagination
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
  Link
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
  const [paginationIndex, setPaginationIndex] = useState(0)
  const [queryValue, setQueryValue] = useState("");
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    if (!list.length) {
      const builtSchema = buildClientSchema(introspectionQuery as IntrospectionQuery);
      const schemaLanguage = printSchema(builtSchema);
      const source = new Source(schemaLanguage);
      const validSchema = buildSchema(source, { assumeValidSDL: true });
      const mutationList: any[] = generateMutations(validSchema)!;
      setList(mutationList)
    }
  }, [])

  function renderItem(item: any) {
    const { mutationInfo, mutationDocument, variableValues } = item
    const { args } = mutationInfo

    return <MutationResourceItem {...item} />
  }

  const filters = [
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={"taggedWith"}
          onChange={() => { }}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      onQueryChange={setQueryValue}
      onQueryClear={() => setQueryValue("")}
      onClearAll={() => setQueryValue("")}
    />
  );

  const resourceName = {
    singular: "available mutations",
    plural: "available mutations",
  };


  const onPrevious = () => {
    if (paginationIndex === 0 || !filteredItems.length) {
      setPaginationIndex(0)
      return
    }
    setPaginationIndex(paginationIndex - 10)
  }

  const onNext = () => {
    if (!filteredItems.length) {
      setPaginationIndex(paginationIndex - 10)
      return
    }
    setPaginationIndex(paginationIndex + 10)
  }

  const filteredItems = list
    .filter(item => item.mutationInfo.name.toLowerCase().includes(queryValue.toLowerCase()))
    .slice(paginationIndex, paginationIndex + 10)

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
          <Router>
            <Routes>
              <Route path="/" element={<Frame>
                <Page title="Dev Portal">
                  <Stack distribution='center' alignment='center'>
                    <Pagination
                      hasPrevious={paginationIndex > 0}
                      onPrevious={onPrevious}
                      hasNext={filteredItems.length > 0}
                      onNext={onNext}
                    />
                  </Stack>
                  <ResourceList
                    resourceName={resourceName}
                    items={filteredItems!}
                    filterControl={filterControl}
                    renderItem={renderItem}
                  />
                  <Stack distribution='center' alignment='center'>
                    <Pagination
                      hasPrevious={paginationIndex > 0}
                      onPrevious={onPrevious}
                      hasNext={filteredItems.length > 0}
                      onNext={onNext}
                    />
                  </Stack>
                </Page>
              </Frame>} />
              <Route path="/:mutation" element={<DetailsPage list={list} />} />
            </Routes>
          </Router>
        </MyProvider>
      </AppBridgeProvider>
    </AppProvider >
  )
}

export default App
