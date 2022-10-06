import { Card, Layout, Page, IndexTable } from "@shopify/polaris";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { generateArgsMap } from "../../utilities/generateArgsMap";

export const InternalDetailsPage = ({ schema }) => {
  const { mutation } = useParams();

  const { mutations: list, argMap } = generateArgsMap(schema);

  const mutationNode = list.find((item) => item.name === mutation);
  const args = argMap[mutation];

  const headings = ["Title", ...Object.keys(args)].map((i) => ({ title: i }));

  console.log({ mutationNode, args });

  const rows = [
    [
      <Link to={`/internal/${mutationNode?.name}/test-credit`}>
        Test credit
      </Link>,
      "$875.00",
      "custom description",
      "true",
    ],
    [
      <Link to={`/internal/${mutationNode?.name}/real-credit`}>
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
          <Card title={mutationNode?.name}>
            <Card.Section>
              <p>{mutationNode?.description}</p>
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
