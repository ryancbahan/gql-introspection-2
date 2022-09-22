import React, {useEffect, useRef, useState} from 'react';
import {
  useActiveLanguage,
  useCodeLanguages,
} from '../CodeLanguageProvider';

import type {
  CodeblockActionProps,
  CodeblockContentProps,
  CodeblockTitleBarProps,
  Language,
} from './interfaces';
import {useConsistentScrollPosition} from './hooks/useConsistentScrollPosition';

import {
  CardTitled,
  CodeblockContent,
  ControlledTabbedCodeblock,
  useCopyAction,
  getLinksAsActions,
} from '.';

export interface CodeblockProps {
  className?: string;
  title?: CodeblockTitleBarProps;
  selectorBarActions?: CodeblockActionProps[];
  selectorBarTitle?: string | React.ReactNode;
  contents: CodeblockContentProps[];
  nested?: boolean;
  initialLanguage?: Language;
  prefix?: string;
  forceTabs?: boolean;
}

export function notEmpty<T>(value: T): value is NonNullable<T> {
  if (value == null) {
    return false;
  }
  return typeof value === 'string' || Array.isArray(value)
    ? value.length > 0
    : true;
}


export function Codeblock({
  className,
  title,
  selectorBarActions,
  contents,
  nested,
  initialLanguage,
  prefix,
  forceTabs,
}: CodeblockProps) {
  if (contents.length <= 0) {
    throw new Error('Empty array provided for contents prop');
  }

  const wrapperRef = useRef<HTMLDivElement>(null);

  const {setActiveLanguage} = useCodeLanguages();

  const languages = getLanguages(contents);
  const activeLanguage = useActiveLanguage(languages, initialLanguage);

  const [selectedIndex, setSelectedIndex] = useState<number>(
    languages.indexOf(activeLanguage) || 0,
  );
  const [codeblockContent, setCodeblockContent] =
    useState<CodeblockContentProps>(
      () => getActiveContent(activeLanguage, contents) || contents[0],
    );

  const {updateScrollPosition} = useConsistentScrollPosition({
    ref: wrapperRef,
    selectedIndex,
  });

  useEffect(() => {
    setSelectedIndex(languages.indexOf(activeLanguage) || 0);
    setCodeblockContent(
      getActiveContent(activeLanguage, contents) || contents[0],
    );
  }, [activeLanguage, contents, languages]);

  let actions: CodeblockActionProps[] = [];
  if (selectorBarActions) {
    actions = selectorBarActions.reduce<CodeblockActionProps[]>(
      (accumulator, current) => {
        if (
          current.description === 'copy' &&
          typeof codeblockContent?.content === 'string'
        ) {
          return accumulator.concat(useCopyAction(codeblockContent?.content));
        } else if (current.description === 'link') {
          return accumulator.concat(getLinksAsActions([current]));
        }
        return accumulator;
      },
      [],
    );
  }

  const onSelect = (index: number) => {
    const language = languages[index];
    if (language) {
      setActiveLanguage(language, languages);
      updateScrollPosition();
    }
  };

  const tabs = contents.map(({title, content, language}, index) => ({
    title,
    key: `${index}_${title}_${language}`,
    content: <CodeblockContent content={content} language={language} />,
  }));

  return (
    <div ref={wrapperRef}>
      <CardTitled titleProps={{...title, className}}>
        <ControlledTabbedCodeblock
          nested={nested}
          onSelect={onSelect}
          selectedIndex={selectedIndex}
          actions={actions}
          tabs={tabs}
          prefix={prefix}
          forceTabs={forceTabs}
        />
      </CardTitled>
    </div>
  );
}

function getActiveContent(
  language: Language | undefined,
  contents: CodeblockContentProps[],
): CodeblockContentProps | undefined {
  return contents.find((content) => content.language === language);
}

function getLanguages(contents: CodeblockContentProps[]): Language[] {
  return contents.map((content) => content.language).filter(notEmpty);
}
