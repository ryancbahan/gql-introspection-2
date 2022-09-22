import React from 'react';
import type {Language as PrismLanguage} from 'prism-react-renderer';

export type Language =
  | PrismLanguage
  | 'liquid'
  | 'rb'
  | 'ruby'
  | 'php'
  | 'js'
  | 'ts'
  | 'plain';

export const PredefinedCopyAction: CodeblockActionProps = {
  id: '1',
  description: 'copy',
  callback: () => {},
};

export interface CodeblockActionProps {
  id: string;
  description: string;
  feedback?: string;
  content?: string | React.ReactNode;
  icon?: React.ReactNode;
  url?: string;
  external?: boolean;
  disabled?: boolean;
  callback: (id: string, event?: React.MouseEvent) => void;
}

export interface CodeblockTitleBarProps {
  content?: string | React.ReactNode;
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
  actions?: CodeblockActionProps[];
  className?: string;
  nested?: boolean;
}

export interface CodeblockContentProps {
  content: string;
  /**
   * Custom line prefixes need to be added to the regex in filterSelection(),
   * or they’ll be included when selecting + copying text from the code block.
   * */
  linePrefix?: string | ((i: number, content: string) => string);
  language?: Language;
  maxHeight?: string;
  minHeight?: string;
  hideLinePrefix?: boolean;
  nowrap?: boolean;
  title?: string;
}
