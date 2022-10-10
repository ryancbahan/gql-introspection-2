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
  const [datasets, setDatasets] = useState();

  useEffect(() => {
    fetch(`/${schema}/mutations/${mutation}`)
      .then((res) => res?.json())
      .then((json) => setMutationData(json.data));

    fetch(`/${schema}/mutations/${mutation}/datasets`)
      .then((res) => res?.json())
      .then((json) => setDatasets(json.data));
  }, []);

  if (!mutationData) return <div>loading...</div>;
  // const { mutations: list, argMap } = generateArgsMap(schema);

  const headings = [{ title: "Title" }, { title: "Description" }];

  const rowMarkup = datasets?.map(({ id, title, description }, index) => (
    <IndexTable.Row id={id} key={id} selected={false} position={index}>
      <IndexTable.Cell key={Math.random().toString()}>
        <Link
          to={`/internal/${Schema.AdminApi}/${mutationData.mutationInfo.name}/${id}`}
        >
          {title}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell key={Math.random().toString()}>
        {description}
      </IndexTable.Cell>
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
                itemCount={datasets?.length ?? 0}
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
