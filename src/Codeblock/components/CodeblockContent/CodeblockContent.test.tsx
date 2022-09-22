import React from 'react';
import {mount} from '@shopify/react-testing';
import Highlight from 'prism-react-renderer';

import {CodeblockContent, filterSelection} from './CodeblockContent';

describe('CodeblockContent component', () => {
  it('renders string content without a language property without using Prism', () => {
    const wrapper = mount(<CodeblockContent content="plain texts" />);
    expect(wrapper).not.toContainReactComponent(Highlight);
    expect(wrapper).toContainReactHtml(
      '<pre class="Pre"><code class="language-plain Code Wrap">plain texts</code></pre>',
    );
  });

  it('renders string content with a language using Prism', () => {
    const wrapper = mount(
      <CodeblockContent content="java scripts" language="javascript" />,
    );
    expect(wrapper).toContainReactComponent(Highlight);
  });

  it('trims content without a language', () => {
    const wrapper = mount(<CodeblockContent content={'\njava scripts\n'} />);
    expect(wrapper).toContainReactHtml(
      '<pre class="Pre"><code class="language-plain Code Wrap">java scripts</code></pre>',
    );
  });

  describe('Indenting', () => {
    const indentedCode = 'if(true) {\n  indented\n}';

    it('separates indent whitespace characters into a separate element', () => {
      const wrapper = mount(
        <CodeblockContent content={indentedCode} language="javascript" />,
      );

      // prettier-ignore
      const indentedLine = [
        '<div class="token-line Line">',
          '<div aria-hidden="true" class="LineNo">2</div>',
            '<div class="LineTokens">',
            '<span class="IndentWrapper">',
              '<span class="IndentWrapperRow">',
                '<span class="Indent">  </span>',
                '<span class="IndentContent">',
                  '<span class="token plain">indented</span>',
                '</span>',
              '</span>',
            '</span>',
          '</div>',
        '</div>',
      ].join('');
      expect(wrapper).toContainReactHtml(indentedLine);
    });

    it('does not output whitespace div for non-indented lines', () => {
      const wrapper = mount(
        <CodeblockContent content={indentedCode} language="javascript" />,
      );

      // prettier-ignore
      const nonIndentedLine = [
        '<div class="token-line Line">',
          '<div aria-hidden="true" class="LineNo">3</div>',
          '<div class="LineTokens">',
            '<span class="token plain"></span>',
            '<span class="token punctuation">}</span>',
          '</div>',
        '</div>',
      ].join('');
      expect(wrapper).toContainReactHtml(nonIndentedLine);
    });
  });

  describe('filterSelection', () => {
    const getSelection = jest.spyOn(document, 'getSelection');

    it('identifies and removes line numbers + tabs', () => {
      const nodeSnippet = [
        "import Shopify, { DataType } from '@shopify/shopify-api';\n",
        '2\t\n',
        "3\tconst client = new Shopify.Clients.Rest('your-development-store.myshopify.com', accessToken);\n",
        '4\tconst data = await client.post({\n',
        "5\t\n    path: 'customers',\n",
        '6\t\n    body: {"customer":{"first_name":"Steve","last_name":"Lastnameson","email":"steve.lastnameson@example.com","phone":"+15142546011","verified_email":true,"addresses":[{"address1":"123 Oak St","city":"Ottawa","province":"ON","phone":"555-1212","zip":"123 ABC","last_name":"Lastnameson","first_name":"Mother","country":"CA"}]}},\n',
        '7\t\n',
        '    type: DataType.JSON,\n',
        '8\t});\n',
      ].join('');
      getSelection.mockImplementationOnce(() => {
        return {
          toString: () => nodeSnippet,
        } as Selection;
      });
      const mockEvent = {
        clipboardData: {
          setData: jest.fn(),
        },
        preventDefault: jest.fn(),
      };

      filterSelection(mockEvent);
      expect(mockEvent.clipboardData.setData).toHaveBeenCalledWith(
        'text/plain',
        [
          "import Shopify, { DataType } from '@shopify/shopify-api';\n",
          "const client = new Shopify.Clients.Rest('your-development-store.myshopify.com', accessToken);\n",
          'const data = await client.post({\n',
          "    path: 'customers',\n",
          '    body: {"customer":{"first_name":"Steve","last_name":"Lastnameson","email":"steve.lastnameson@example.com","phone":"+15142546011","verified_email":true,"addresses":[{"address1":"123 Oak St","city":"Ottawa","province":"ON","phone":"555-1212","zip":"123 ABC","last_name":"Lastnameson","first_name":"Mother","country":"CA"}]}},\n',
          '    type: DataType.JSON,\n',
          '});\n',
        ].join(''),
      );
    });

    it('also removes tabs used to indent code (don’t indent using tabs)', () => {
      const snippetIndentedWithTabs = [
        "import Shopify, { DataType } from '@shopify/shopify-api';\n",
        '2\t\n',
        "3\tconst client = new Shopify.Clients.Rest('your-development-store.myshopify.com', accessToken);\n",
        '4\tconst data = await client.post({\n',
        "5\t\n\tpath: 'customers',\n",
        '6\t\n\tbody: {"customer":{"first_name":"Steve","last_name":"Lastnameson","email":"steve.lastnameson@example.com","phone":"+15142546011","verified_email":true,"addresses":[{"address1":"123 Oak St","city":"Ottawa","province":"ON","phone":"555-1212","zip":"123 ABC","last_name":"Lastnameson","first_name":"Mother","country":"CA"}]}},\n',
        '7\t\n',
        '\ttype: DataType.JSON,\n',
        '8\t});\n',
      ].join('');

      getSelection.mockImplementationOnce(() => {
        return {
          toString: () => snippetIndentedWithTabs,
        } as Selection;
      });
      const mockEvent = {
        clipboardData: {
          setData: jest.fn(),
        },
        preventDefault: jest.fn(),
      };

      filterSelection(mockEvent);
      expect(mockEvent.clipboardData.setData).toHaveBeenCalledWith(
        'text/plain',
        [
          "import Shopify, { DataType } from '@shopify/shopify-api';\n",
          "const client = new Shopify.Clients.Rest('your-development-store.myshopify.com', accessToken);\n",
          'const data = await client.post({\n',
          "path: 'customers',\n",
          'body: {"customer":{"first_name":"Steve","last_name":"Lastnameson","email":"steve.lastnameson@example.com","phone":"+15142546011","verified_email":true,"addresses":[{"address1":"123 Oak St","city":"Ottawa","province":"ON","phone":"555-1212","zip":"123 ABC","last_name":"Lastnameson","first_name":"Mother","country":"CA"}]}},\n',
          'type: DataType.JSON,\n',
          '});\n',
        ].join(''),
      );
    });

    it('handles deep indentation and large line numbers', () => {
      const jsonSnippet = [
        'HTTP/1.1 201 Created\n',
        '2\t{\n',
        '3\t\n',
        '  \t"customer": {\n',
        '4\t\n',
        '    \t"addresses": [\n',
        '24\t\n',
        '      \t{\n',
        '25\t\n',
        '        \t"id": 1053317298,\n',
        '42000\t\n',
        '      \t}\n',
        '43\t\n',
        '    \t],\n',
        '666\t\n',
        '    \t}\n',
        '67\t\n',
        '  \t}\n',
        '68\t}\n',
      ].join('');

      getSelection.mockImplementationOnce(() => {
        return {
          toString: () => jsonSnippet,
        } as Selection;
      });
      const mockEvent = {
        clipboardData: {
          setData: jest.fn(),
        },
        preventDefault: jest.fn(),
      };

      filterSelection(mockEvent);
      expect(mockEvent.clipboardData.setData).toHaveBeenCalledWith(
        'text/plain',
        [
          'HTTP/1.1 201 Created\n',
          '{\n',
          '  "customer": {\n',
          '    "addresses": [\n',
          '      {\n',
          '        "id": 1053317298,\n',
          '      }\n',
          '    ],\n',
          '    }\n',
          '  }\n',
          '}\n',
        ].join(''),
      );
    });

    it('handles custom line prefix "$"', () => {
      const bashSnippet = [
        'brew tap shopify/shopify\n',
        '$	brew install shopify-cli\n',
        '$	  indented line\n',
        '$	line after indented line\n',
        'unprefixed line\n',
        '  indented unprefixed line',
      ].join('');

      getSelection.mockImplementationOnce(() => {
        return {
          toString: () => bashSnippet,
        } as Selection;
      });
      const mockEvent = {
        clipboardData: {
          setData: jest.fn(),
        },
        preventDefault: jest.fn(),
      };

      filterSelection(mockEvent);
      expect(mockEvent.clipboardData.setData).toHaveBeenCalledWith(
        'text/plain',
        [
          'brew tap shopify/shopify\n',
          'brew install shopify-cli\n',
          '  indented line\n',
          'line after indented line\n',
          'unprefixed line\n',
          '  indented unprefixed line',
        ].join(''),
      );
    });
  });
});
