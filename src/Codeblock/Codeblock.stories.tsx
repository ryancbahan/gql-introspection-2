import React from 'react';
import {Story, Meta} from '@storybook/react';
import {CodeLanguagesProvider} from 'app/ui/components/CodeLanguageProvider';
import {ThemeModeProvider} from 'app/ui/components/ThemeModeProvider';

import type {CodeblockContentProps} from './interfaces';
import {Codeblock, CodeblockProps} from './Codeblock';

export default {
  title: 'Codeblock/Codeblock',
  component: Codeblock,
  decorators: [
    (Story) => (
      <ThemeModeProvider mode="dim" style={{width: '500px'}}>
        <CodeLanguagesProvider>
          <Story />
        </CodeLanguagesProvider>
      </ThemeModeProvider>
    ),
  ],
} as Meta;

const Template: Story<CodeblockProps> = (args: CodeblockProps) => (
  <Codeblock {...args} />
);

const mockContents: CodeblockContentProps[] = [
  {
    title: 'javascript',
    language: 'javascript',
    content: `
function greet(greeting) {
  alert(greeting);
}
greet('hi!');`,
  },
  {
    title: 'typescript',
    language: 'typescript',
    content: `
function greet(greeting: string) {
  alert(greeting);
}
greet('hi!');`,
  },
];

export const Default = Template.bind({});
Default.args = {
  className: 'story-class1 story-class2',
  title: {
    content: 'Codeblock title',
  },
  contents: mockContents,
};

export const WithSelectorTitle = Template.bind({});
WithSelectorTitle.args = {
  className: 'story-class1 story-class2',
  title: {
    content: 'Codeblock title',
  },
  prefix: 'Story',
  contents: mockContents,
};
