import React from 'react';
import {Story, Meta} from '@storybook/react';

import {mock_paths} from '../../../../mocks/OASDocs';
import {CodeblockContentProps} from '../../interfaces';
import {ThemeModeProvider} from '../../../ThemeModeProvider';

import {CodeblockContent} from './CodeblockContent';

export default {
  title: 'Codeblock/CodeblockContent',
  component: CodeblockContent,
} as Meta;

const Template: Story<CodeblockContentProps> = (
  args: CodeblockContentProps,
) => (
  <ThemeModeProvider
    mode="dim"
    style={{
      backgroundColor: 'var(--codeblock-color-docs-background-default)',
    }}
  >
    <CodeblockContent {...args} />
  </ThemeModeProvider>
);

export const RawJSON = Template.bind({});
RawJSON.args = {
  language: 'json',
  content: `{
    "hello": "darkness my old friend",

    "I've": "come to talk with you again"
  }`,
};

export const RawJSONNoWrap = Template.bind({});
RawJSONNoWrap.args = {
  language: 'json',
  content: `{
    "hello": "darkness my old friend",

    "I've": "come to talk with you again and again and again and again and again and again and again and again and again and again and again and again and again"
  }`,
  nowrap: true,
};

export const ComplexJSON = Template.bind({});
ComplexJSON.args = {
  language: 'json',
  content: JSON.stringify(mock_paths),
  maxHeight: '400px',
};

export const Javascript = Template.bind({});
Javascript.args = {
  language: 'javascript',
  content: `
  import Shopify, { DataType } from '@shopify/shopify-api';

  const client = new Shopify.Clients.Rest('https://your-development-store.myshopify.com', accessToken);
  const data = await client.post({
    path: 'orders',
    body: {"order":{"line_items":[{"variant_id":447654529,"quantity":1}]}},
    type: DataType.JSON,
  });
  `,
};

export const Ruby = Template.bind({});
Ruby.args = {
  language: 'rb',
  content: `
class RegisterWebhooksForActiveShops < ApplicationJob
  queue_as :default

  def perform
    register_webhooks_for_active_shops
  end

  private

  def register_webhooks_for_active_shops
    Shop.find_each do |shop|
      ShopifyApp::WebhooksManagerJob.perform_now(
        shop_domain: shop.shopify_domain,
        shop_token: shop.shopify_token,
        webhooks: ShopifyApp.configuration.webhooks
      )
    end
  end
end
`,
};

export const Markdown = Template.bind({});
Markdown.args = {
  language: 'markdown',
  content: `
# Title

paragraph

\`\`\`ts
const foo: string = "bar";
\`\`\`
`,
};

export const HTML = Template.bind({});
HTML.args = {
  language: 'markup',
  content: `<html><head></head><body><div>hello</div></body></html>`,
};

export const Bash = Template.bind({});
Bash.args = {
  language: 'bash',
  linePrefix: '$',
  content: 'npm install foo',
};

export const ComplexBash = Template.bind({});
ComplexBash.args = {
  language: 'bash',
  linePrefix: (_, content) => (content.includes('#') ? '' : '$'),
  content:
    '# if ngrok is in your downloads folder:\n' +
    'cd ~/Downloads/\n' +
    '# start an HTTP tunnel on port 3000\n' +
    './ngrok http 3000',
};

export const JSX = Template.bind({});
JSX.args = {
  language: 'jsx',
  content: `import React from 'react';
  import ReactDOM from 'react-dom';
  import {Provider, Loading} from '@shopify/app-bridge-react';

  function MyApp() {
    const config = {apiKey: '12345', shopOrigin: shopOrigin};
    return (
      <Provider config={config}>
        <Loading />
      </Provider>
    );
  }

  const root = document.createElement('div');
  document.body.appendChild(root);
  ReactDOM.render(<MyApp />, root);
  `,
};

export const GraphQLQuery = Template.bind({});
GraphQLQuery.args = {
  language: 'graphql',
  content: `query getProductById($id: ID!) {
  product(id: $id) {
    title
    handle
    createdAt
  }
}
`,
};

export const GraphQLQueryShorthand = Template.bind({});
GraphQLQueryShorthand.args = {
  language: 'graphql',
  content: `{
  orders(id: 4, name: "foo") {
    edges {
      node {
        # Order fields
        # Query fields
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}`,
};

export const GraphQLMutation = Template.bind({});
GraphQLMutation.args = {
  language: 'graphql',
  content: `mutation orderUpdate($input: OrderInput!) {
  orderUpdate(input: $input) {
    order {
      # Order fields
    }
    userErrors {
      field
      message
    }
  }
}`,
};

export const GraphQLSchemaDefinition = Template.bind({});
GraphQLSchemaDefinition.args = {
  language: 'graphql',
  content: `type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
`,
};

export const Liquid = Template.bind({});
Liquid.args = {
  language: 'liquid',
  content: `
<style>
  .product-card {
    box-sizing: border-box;
    float: left;
    min-height: 1em;
    padding-left: 2em;
    vertical-align: top;
    width: 25%;
  }

  .visuallyhidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }
</style>

<h1>{{ collection.title }}</h1>

{%- if collection.description != blank -%}
  <p>{{ collection.description }}</p>
{%- endif -%}

<ul>
  {%- for product in collection.products -%}
    <li>
      <a class="product-card" href="{{ product.url | within: collection }}">
        <img src="{{ product.featured_image.src | img_url: '1024x' }}" alt="">
        {{ product.title }}
        <p>
          <span aria-hidden="true">—</span>
          {%- if product.price_varies -%}
            <span class="visuallyhidden">Starting at</span>
            {{ product.price_min | money_without_trailing_zeros }}
            <span aria-hidden="true">+</span>
          {%- else -%}
            {{ product.price | money_without_trailing_zeros }}
          {%- endif -%}
        </p>
        <p>
          <span class="visuallyhidden">by</span>
          {{ product.vendor }}
        </p>
      </a>
    </li>
  {%- endfor -%}
</ul>
  `,
};

export const YAML = Template.bind({});
YAML.args = {
  language: 'yaml',
  content: `---
version: 1 # Version number. Do not edit.
inputMode: single # Accept a single value (not a list)
title: Rename payment method
description:
fields:
  - type: text
    key: nameToMatch
    label: Payment method name
    placeholder: Cash on Delivery (COD)
    helpText: The payment method to rename
  - type: text
    key: renameTo
    label: Rename to
    placeholder: Hello Payments
    helpText: The new payment method name`,
};
