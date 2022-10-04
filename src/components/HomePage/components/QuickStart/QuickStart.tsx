import React from "react";
import { Layout, Stack, TextContainer, Card, Button } from "@shopify/polaris";

export const QuickStart = () => {
  return (
    <>
      <Layout>
        <Layout.Section>
          <Stack spacing="loose">
            <Stack.Item>
              <TextContainer>
                <br />
                <p>
                  Generate common entities for your dev store. For more detailed
                  behaviors, browse all available mutations and modify the input
                  arguments to meet your needs.
                </p>
                <br />
              </TextContainer>
            </Stack.Item>
          </Stack>
        </Layout.Section>
      </Layout>
      <Layout>
        <Layout.Section oneThird>
          <Card title="5 customers, products, and orders">
            <Card.Section>
              <TextContainer>
                <p>
                  Generate products, customers, and orders for your dev store.
                </p>
                <Button primary>Select</Button>
              </TextContainer>
            </Card.Section>
          </Card>
          <Card title="Generate storefront token">
            <Card.Section>
              <TextContainer>
                <p>
                  Generate a storefront access token to use the Storefront API.
                </p>
                <Button primary>Select</Button>
              </TextContainer>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card title="Generate events">
            <Card.Section>
              <TextContainer>
                <p>
                  Generate events for Amazon Eventbridge, Google Pub/Sub, and
                  Flow.
                </p>
                <Button primary>Select</Button>
              </TextContainer>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card title="Generate discounts">
            <Card.Section>
              <TextContainer>
                <p>Generate an automatic discount.</p>
                <Button primary>Select</Button>
              </TextContainer>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};
