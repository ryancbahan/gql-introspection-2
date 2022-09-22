import React from 'react';
import {Tabs} from 'react-tabs';
import {mountWithAppContext} from 'app/ui/utilities/testing';
import {
  CodeblockContent,
  PredefinedCopyAction,
  TabbedCodeblock,
} from 'app/ui/components/Codeblock';

import * as copy from './hooks/useCopyAction';
import type {CodeblockContentProps} from './interfaces';
import {Codeblock} from './Codeblock';

describe('Codeblock', () => {
  const mockContents: CodeblockContentProps[] = [
    {
      language: 'javascript',
      content: `
  function greet(greeting) {
    alert(greeting);
  }
  greet('hi!');`,
    },
    {
      language: 'typescript',
      content: `
  function greet(greeting: string) {
    alert(greeting);
  }
  greet('hi!');`,
    },
  ];

  const mockContext = {
    value: {},
    setActiveLanguage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('populates selector bar with predefined copy action', () => {
    jest.spyOn(copy, 'useCopyAction');

    mountWithAppContext(
      <Codeblock
        contents={mockContents}
        selectorBarActions={[PredefinedCopyAction]}
      />,
    );

    expect(copy.useCopyAction).toHaveBeenCalledWith(mockContents[0].content);
  });

  it('calls setActiveLanguage when selector items are clicked', () => {
    const wrapper = mountWithAppContext(<Codeblock contents={mockContents} />, {
      codeLanguages: mockContext,
    });

    const content = wrapper.find(CodeblockContent);

    expect(content).toContainReactText('function greet(greeting)');

    wrapper.find(Tabs)?.trigger('onSelect', 1);

    expect(mockContext.setActiveLanguage).toHaveBeenCalledWith('typescript', [
      'javascript',
      'typescript',
    ]);
  });

  it('reads active tab from CodeLanguagesContext', () => {
    const initialValue = {
      'javascript,typescript': 'typescript',
    };
    const wrapper = mountWithAppContext(<Codeblock contents={mockContents} />, {
      codeLanguages: {...mockContext, value: initialValue},
    });
    const content = wrapper.find(CodeblockContent);
    expect(content).toContainReactText('function greet(greeting: string)');
    expect(wrapper.find(TabbedCodeblock)).toHaveReactProps({
      selectedIndex: 1,
    });
  });

  it('updates content on content change', () => {
    const otherMockContents: CodeblockContentProps[] = [
      {
        language: 'javascript',
        content: 'other javascript',
      },
      {
        language: 'typescript',
        content: 'other typescript',
      },
    ];

    const wrapper = mountWithAppContext(<Codeblock contents={mockContents} />);

    expect(wrapper.find(CodeblockContent)).toContainReactText(
      'function greet(greeting)',
    );

    wrapper.setProps({
      contents: otherMockContents,
    });

    expect(wrapper.find(CodeblockContent)).toContainReactText(
      'other javascript',
    );
  });
});
