/* eslint-disable jest/no-done-callback */
import {mount} from '@shopify/react-testing';
import React, {useEffect} from 'react';
import {Language} from 'app/ui/components/Codeblock/interfaces';

import {
  useCodeLanguages,
  CodeLanguagesProvider,
  useActiveLanguage,
  compareLanguageStrings,
  stringifyLanguageArray,
} from './CodeLanguageProvider';

const testContents: Language[] = ['ruby', 'php', 'javascript'];

describe('CodeLanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('useActiveLanguage defaults to the first tab if storage is empty', (done) => {
    const callback = (result: any) => {
      expect(result).toStrictEqual(testContents[0]);
      done();
    };

    interface HookTesterProps {
      callback: (result: any) => void;
    }
    const HookTester = (props: HookTesterProps) => {
      const {callback} = props;
      callback(useActiveLanguage(testContents));
      return null;
    };

    mount(
      <CodeLanguagesProvider>
        <HookTester callback={callback} />
      </CodeLanguagesProvider>,
    );
  });

  it('useActiveLanguage defaults to the first tab if no matching entries exist in storage', (done) => {
    localStorage.setItem('CodeLanguages', '{"js,ts":"js"}');

    const callback = (result: any) => {
      expect(result).toStrictEqual(testContents[0]);
      done();
    };

    interface HookTesterProps {
      callback: (result: any) => void;
    }
    const HookTester = (props: HookTesterProps) => {
      const {callback} = props;
      callback(useActiveLanguage(testContents));
      return null;
    };

    mount(
      <CodeLanguagesProvider>
        <HookTester callback={callback} />
      </CodeLanguagesProvider>,
    );
  });

  it('useActiveLanguage reads from local storage', (done) => {
    localStorage.setItem('CodeLanguages', '{"javascript,php,ruby":"php"}');

    const callback = (result: any) => {
      expect(result).toStrictEqual(testContents[1]);
      done();
    };

    interface HookTesterProps {
      callback: (result: any) => void;
    }
    const HookTester = (props: HookTesterProps) => {
      const {callback} = props;
      callback(useActiveLanguage(testContents));
      return null;
    };

    mount(
      <CodeLanguagesProvider>
        <HookTester callback={callback} />
      </CodeLanguagesProvider>,
    );
  });

  it('useActiveLanguage() throws an error when CodeLanguagesProvider is not present', (done) => {
    const HookTester = () => {
      expect(() => {
        /* eslint-disable-next-line react-hooks/rules-of-hooks */
        useActiveLanguage(testContents);
      }).toThrow(
        'useActiveLanguage() can only be used in a child of <CodeLanguagesProvider>',
      );
      done();
      return null;
    };

    mount(<HookTester />);
  });

  it('setActiveLanguage persists state to local storage', (done) => {
    function callback() {
      expect(localStorage.getItem('CodeLanguages')).toStrictEqual(
        '{"javascript,php,ruby":"javascript"}',
      );
      done();
    }

    interface HookTesterProps {
      callback: () => void;
    }
    const HookTester = (props: HookTesterProps) => {
      const {callback} = props;
      const {setActiveLanguage} = useCodeLanguages();
      useEffect(() => {
        setActiveLanguage(testContents[2], testContents);
        callback();
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
      }, []);
      return null;
    };

    mount(
      <CodeLanguagesProvider>
        <HookTester callback={callback} />
      </CodeLanguagesProvider>,
    );
  });

  it('useCodeLanguages() throws an error when CodeLanguagesProvider is not present', (done) => {
    const HookTester = () => {
      expect(() => {
        /* eslint-disable-next-line react-hooks/rules-of-hooks */
        useCodeLanguages();
      }).toThrow(
        'useCodeLanguages() can only be used in a child of <CodeLanguagesProvider>',
      );
      done();
      return null;
    };

    mount(<HookTester />);
  });

  it('alphabetically sorts and removes non-alphabetical characters from language names', () => {
    const languageArray = [
      'node.js',
      'cURL',
      'ruby on rails',
      'trolo,,, lolo,,, lol',
    ];

    expect(stringifyLanguageArray(languageArray as Language[])).toStrictEqual(
      'curl,nodejs,rubyonrails,trololololol',
    );
  });

  it.each([
    {stringA: 'js,jsx,ts,tsx', stringB: 'tsx,ts,jsx,js', expected: true},
    {stringA: 'ruby,php,js', stringB: 'js,php,ruby', expected: true},
    {stringA: 'js,jsx', stringB: 'ruby,php,js', expected: false},
    {stringA: 'js,jsx,ts', stringB: 'js,jsx', expected: false},
  ])(
    'compareLanguageStrings returns true when both arguments contain the same languages, regardless of order',
    ({stringA, stringB, expected}) => {
      expect(compareLanguageStrings(stringA, stringB)).toStrictEqual(expected);
    },
  );
});
