import React, {useEffect, useRef} from 'react';
import Highlight from 'prism-react-renderer';
import type {Language} from 'prism-react-renderer';
import Prism from 'prismjs';
import {classNames} from '@shopify/css-utilities';

import {CodeblockContentProps} from '../../interfaces';

import {prettifyCodeByLanguage} from './prettifyCodeByLanguage';
import styles from './CodeblockContent.scss';
import './syntax.css';

Prism.manual = true;

export function CodeblockContent({
  language,
  content,
  maxHeight,
  minHeight,
  hideLinePrefix,
  nowrap,
  linePrefix,
}: CodeblockContentProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const {current} = containerRef;
    current?.addEventListener('copy', filterSelection);
    return () => current?.removeEventListener('copy', filterSelection);
  }, [content]);

  const code = prettifyCodeByLanguage({language, content});
  const wrapStyle = nowrap ? styles.NoWrap : styles.Wrap;

  if (!language) {
    return (
      <div className={styles.CodeblockContent}>
        <pre className={styles.Pre}>
          <code
            className={classNames('language-plain', styles.Code, wrapStyle)}
          >
            {code}
          </code>
        </pre>
      </div>
    );
  }

  const lineContents = code.split('\n');
  const maxHeightValue =
    maxHeight ??
    `calc((50 * var(--size-base-lineheight-copy-sm)) + (var(--size-250) * 1.5)`;

  return (
    <div
      style={{
        maxHeight: maxHeightValue,
        minHeight,
      }}
      className={styles.CodeblockContent}
    >
      <Highlight
        Prism={Prism}
        theme={undefined}
        code={code}
        language={language as Language}
      >
        {({className, tokens, getLineProps, getTokenProps}) => (
          <pre className={classNames(styles.Pre)}>
            <code
              className={classNames(styles.Code, wrapStyle, className)}
              ref={containerRef}
            >
              {tokens.map((line, i) => {
                const lineIndent = indentLevel(line);

                const lineContent = line.map((token, index) => {
                  if (index === 0) {
                    token.content = token.content.replace(/^\s+/g, '');
                  }
                  return (
                    /* eslint-disable-next-line react/jsx-key */
                    <span
                      {...getTokenProps({
                        key: index,
                        token,
                        className: classNames({
                          [`keyword-${token.content}`]:
                            token.types.includes('keyword'),
                        }),
                      })}
                    />
                  );
                });

                const lineMarkup = lineIndent ? (
                  <span className={styles.IndentWrapper}>
                    <span className={styles.IndentWrapperRow}>
                      <span className={styles.Indent}>{lineIndent}</span>
                      <span className={styles.IndentContent}>
                        {lineContent}
                      </span>
                    </span>
                  </span>
                ) : (
                  lineContent
                );

                return (
                  /* eslint-disable-next-line react/jsx-key */
                  <div
                    {...getLineProps({
                      key: i,
                      line,
                      className: classNames(
                        styles.Line,
                        line[0].types.find((type) =>
                          type.includes('language-'),
                        ),
                      ),
                    })}
                  >
                    <LinePrefix
                      i={i}
                      hideLinePrefix={hideLinePrefix}
                      linePrefix={linePrefix}
                      lineContents={lineContents}
                      nowrap={nowrap}
                    />
                    <div className={styles.LineTokens}>{lineMarkup}</div>
                  </div>
                );
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

interface LinePrefixProps extends Partial<CodeblockContentProps> {
  i: number;
  lineContents: string[];
}

function LinePrefix({
  i,
  linePrefix,
  nowrap,
  lineContents,
  hideLinePrefix,
}: LinePrefixProps) {
  if (hideLinePrefix) {
    return null;
  }
  const linePrefixMarkup =
    typeof linePrefix === 'function'
      ? linePrefix(i, lineContents[i])
      : linePrefix ?? i + 1;
  return (
    <div
      aria-hidden="true"
      className={classNames(styles.LineNo, {[styles.Block]: nowrap})}
    >
      {linePrefixMarkup}
    </div>
  );
}

function indentLevel(line: any[]): string {
  if (line.length) {
    const content = line[0].content;
    if (content.startsWith(' ')) {
      const indexOfFirstNonWhitespaceCharacter = content.search(/\S|$/);
      return content.slice(0, indexOfFirstNonWhitespaceCharacter);
    }
  }
  return '';
}

export function filterSelection(event: any) {
  const selection = document.getSelection();
  if (selection) {
    const linePrefixesWithLineBreaks = /\n(\d+|\$)\t\n/g;
    const linePrefixes = /\n(\d+|\$)\t/g;
    const extraTabs = /(\s+)\t/g;

    const filteredSelection = selection
      .toString()
      .replace(linePrefixesWithLineBreaks, '\n')
      .replace(linePrefixes, '\n')
      .replace(extraTabs, '$1');

    event.clipboardData.setData('text/plain', filteredSelection);
    event.preventDefault();
  }
}
