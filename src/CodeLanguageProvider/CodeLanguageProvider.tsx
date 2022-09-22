import React, {useCallback, useContext, useMemo} from 'react';
import type {ReactNode} from 'react';
import {Language} from '../Codeblock/interfaces';
import {useLocalStorage} from '../useLocalStorage';

const LOCAL_STORAGE_KEY = 'CodeLanguages';

interface CodeblockLanguages {
  [key: string]: string;
}

export interface CodeLanguagesContextData {
  value: CodeblockLanguages;
  setActiveLanguage: (activeLanguage: Language, languages: Language[]) => void;
}

export const CodeLanguagesContext = React.createContext<
  CodeLanguagesContextData | undefined
>(undefined);

interface CodeLanguagesProviderProps {
  children: ReactNode;
}

export function CodeLanguagesProvider({children}: CodeLanguagesProviderProps) {
  const [currentValue, setValue] = useLocalStorage<CodeblockLanguages>(
    LOCAL_STORAGE_KEY,
    {},
  );

  const setActiveLanguage = useCallback(
    (activeLanguage: Language, languages: Language[]) => {
      const languagesString = stringifyLanguageArray(languages);
      setValue({
        ...currentValue,
        [languagesString]: activeLanguage,
      });
    },
    [currentValue, setValue],
  );

  const value = useMemo(
    () => ({
      value: currentValue,
      setActiveLanguage,
    }),
    [currentValue, setActiveLanguage],
  );

  return (
    <CodeLanguagesContext.Provider value={value}>
      {children}
    </CodeLanguagesContext.Provider>
  );
}

export function useCodeLanguages(): CodeLanguagesContextData {
  const context = useContext(CodeLanguagesContext);
  if (context === undefined) {
    throw new Error(
      'useCodeLanguages() can only be used in a child of <CodeLanguagesProvider>',
    );
  }
  return context;
}

export function useActiveLanguage(
  languages: Language[],
  initialLanguage?: Language,
): Language {
  const context = useContext(CodeLanguagesContext);

  if (context === undefined) {
    throw new Error(
      'useActiveLanguage() can only be used in a child of <CodeLanguagesProvider>',
    );
  }
  const languagesString = stringifyLanguageArray(languages);

  if (context.value[languagesString]) {
    const found = languages.find(
      (language) =>
        normalize(language || '') === context.value[languagesString],
    );
    if (found) {
      return found;
    }
  }

  return initialLanguage ?? languages[0];
}

export function stringifyLanguageArray(array: Language[]): string {
  return array.map(normalize).sort().join(',');
}
function normalize(input: string): string {
  return input.replace(/\W/gi, '').toLowerCase();
}
function splitLanguageString(str: string): string[] {
  return str.split(',');
}

// codeblock tabs should always be alphabetized - for consistency.
// this is in case they're not.
export function compareLanguageStrings(str1: string, str2: string): boolean {
  const array1 = splitLanguageString(str1);
  const array2 = splitLanguageString(str2);

  if (array1.length !== array2.length) {
    return false;
  }

  for (let index = array1.length - 1; index >= 0; index--) {
    const item = array1[index];
    if (array2.includes(item)) {
      array1.pop();
    }
  }
  return array1.length === 0;
}
