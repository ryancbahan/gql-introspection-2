import React from "react";
import enTranslations from "@shopify/polaris/locales/en.json";
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
                <Route path="/" element={<HomePage />} />
                <Route path="/:schema/:mutation" element={<DetailsPage />} />
                <Route
                  path="/internal/:schema/:mutation"
                  element={<InternalDetailsPage />}
                />
                <Route
                  path="/internal/:schema/:mutation/:dataSetId"
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
