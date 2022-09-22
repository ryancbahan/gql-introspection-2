import React from 'react';
import {Story, Meta} from '@storybook/react';

import {Chip} from '../../../Chip';
import {CodeblockTitleBarProps} from '../../interfaces';
import {mockActions} from '../../../../mocks/Codeblock';

import {CodeblockTitleBar} from './CodeblockTitleBar';

export default {
  title: 'Codeblock/CodeblockTitleBar',
  component: CodeblockTitleBar,
} as Meta;

const Template: Story<CodeblockTitleBarProps> = (
  args: CodeblockTitleBarProps,
) => <CodeblockTitleBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: 'Story title',
  postfix: <Chip label="test" />,
  actions: [],
};

export const WithHashPrefix = Template.bind({});
WithHashPrefix.args = {
  content: 'Story title',
  prefix: '#',
  postfix: <Chip label="test" />,
  actions: [],
};

export const WithPrefix = Template.bind({});
WithPrefix.args = {
  content: 'Story title',
  prefix: <Chip label="ruby" />,
  postfix: <Chip label="test" />,
  actions: [],
};

export const WithActions = Template.bind({});
WithActions.args = {
  content: 'Story title',
  prefix: <Chip label="ruby" />,
  postfix: <Chip label="test" />,
  actions: mockActions,
};
