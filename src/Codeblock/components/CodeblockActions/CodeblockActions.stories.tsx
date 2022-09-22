import React from 'react';
import {Story, Meta} from '@storybook/react';
import {ExternalMinorIcon, GithubMinorIcon} from 'app/ui/icons';

import {mockActions} from '../../../../mocks/Codeblock';
import {Icon} from '../../../Icon';

import {CodeblockActions, CodeblockActionsProps} from './CodeblockActions';

export default {
  title: 'Codeblock/CodeblockActions',
  component: CodeblockActions,
} as Meta;

const Template: Story<CodeblockActionsProps> = (
  args: CodeblockActionsProps,
) => (
  <div style={{padding: '50px'}}>
    <CodeblockActions {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  actions: mockActions,
};

export const MultipleActions = Template.bind({});
MultipleActions.args = {
  actions: [
    ...mockActions,
    {
      id: 'four',
      description: 'Action download',
      content: 'Just text',
      callback: (id: string) => {
        console.log(`{${id}} - Action download`);
      },
    },
  ],
};

export const LinkActions = Template.bind({});
LinkActions.args = {
  actions: [
    {
      id: 'link-1',
      description: 'https://www.github.com',
      content: 'Github',
      url: 'https://www.github.com',
      icon: (
        <Icon source={GithubMinorIcon} accessibilityLabel="External Link" />
      ),
      external: true,
      callback: (id: string) => {
        console.log(`{${id}} - Action external link`);
      },
    },
    {
      id: 'link-2',
      description: 'https://www.google.com',
      content: '',
      url: 'https://www.google.com',
      icon: (
        <Icon source={ExternalMinorIcon} accessibilityLabel="External Link" />
      ),
      external: true,
      callback: (id: string) => {
        console.log(`{${id}} - Action external link`);
      },
    },
  ],
};
