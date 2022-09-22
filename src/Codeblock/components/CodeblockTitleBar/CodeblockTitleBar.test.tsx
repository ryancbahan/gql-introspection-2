import React from 'react';
import {mount} from '@shopify/react-testing';

import {CodeblockTitleBar} from './CodeblockTitleBar';

describe('CodeblockTitle component', () => {
  it('renders without error', () => {
    const wrapper = mount(
      <CodeblockTitleBar
        content="Codeblock title"
        prefix="123"
        postfix={<div>345</div>}
      />,
    );

    expect(wrapper).not.toBeNull();
  });
});
