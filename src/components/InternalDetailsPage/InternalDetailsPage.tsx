import { Card, Layout, Page, IndexTable } from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { generateArgsMap } from "../../utilities/generateArgsMap";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../utilities/fetch";
import { Schema } from "../../types";

export const InternalDetailsPage = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const { schema, mutation } = useParams();

  const [mutationData, setMutationData] = useState();

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}`)
      .then((res) => res?.json())
      .then((json) => setMutationData(json.data));
  }, []);

  if (!mutationData) return <div>loading...</div>;
  // const { mutations: list, argMap } = generateArgsMap(schema);

  const args = mutationData.mutationInfo.args;
  const headings = ["Title", ...args.map((i) => ({ title: i.name.value }))];

  const rows = [
    [
      <Link
        to={`/internal/${Schema.AdminApi}/${mutationData.mutationInfo.name}/test-credit`}
      >
        Test credit
      </Link>,
      "$875.00",
      "custom description",
      "true",
    ],
    [
      <Link
        to={`/internal/${Schema.AdminApi}/${mutationData.mutationInfo.name}/real-credit`}
      >
        Real credit
      </Link>,
      "$875.00",
      "custom description",
      "false",
    ],
  ];

  const columnContentTypes = headings.map((item) => "text");

  const rowMarkup = rows.map((item, index) => (
    <IndexTable.Row
      id={index.toString()}
      key={index}
      selected={false}
      position={index}
    >
      {item.map((i) => (
        <IndexTable.Cell key={i.toString()}>{i}</IndexTable.Cell>
      ))}
    </IndexTable.Row>
  ));

  return (
    <Page
      breadcrumbs={[{ content: "Back", onAction: () => window.history.back() }]}
      fullWidth
    >
      <Layout>
        <Layout.Section>
          <Card title={mutationData.mutationInfo.name}>
            <Card.Section>
              <p>{mutationData.mutationInfo?.description.value}</p>
            </Card.Section>
            <Card.Section title="Data sets">
              <IndexTable
                headings={headings}
                itemCount={rows.length}
                resourceName={{
                  singular: "Data set",
                  plural: "Data sets",
                }}
              >
                {rowMarkup}
              </IndexTable>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
