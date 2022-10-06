import { Page, Layout, Card } from "@shopify/polaris";
import React from "react";
import { useLocation } from "react-router-dom";

export const DataSetEditor = () => {
  return (
    <Page
      breadcrumbs={[{ content: "Back", onAction: () => window.history.back() }]}
      fullWidth
    >
      <Layout>
        <Layout.Section>
          <Card>foo</Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
