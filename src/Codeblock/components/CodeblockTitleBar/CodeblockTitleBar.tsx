import React from 'react';
import {classNames} from '@shopify/css-utilities';

import {CodeblockActions} from '../CodeblockActions';
import {CodeblockTitleBarProps} from '../../interfaces';

import styles from './CodeblockTitleBar.scss';

export const CodeblockTitleBar = ({
  content,
  prefix,
  postfix,
  actions,
  className,
  nested,
}: CodeblockTitleBarProps) => {
  return (
    <div className={styles.CodeblockTitleBar}>
      {Boolean(content) && (
        <div className={classNames(styles.CodeblockTitle, className)}>
          {prefix && (
            <div className={styles.CodeblockTitlePrefix}>{prefix}</div>
          )}
          <div
            className={classNames(styles.CodeblockTitleContent, {
              [styles.BreakWords]: typeof content === 'string',
            })}
          >
            {content}
          </div>
          {postfix && (
            <div className={styles.CodeblockTitlePostfix}>{postfix}</div>
          )}
        </div>
      )}
      {!content && postfix && (
        <div className={styles.CodeblockTitlePostfix}>{postfix}</div>
      )}
      {actions && (
        <div className={styles.CodeblockTitleActions}>
          <CodeblockActions actions={actions} nested={nested} />
        </div>
      )}
    </div>
  );
};
