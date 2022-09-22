import React from 'react';
import {classNames} from '@shopify/css-utilities';
import {ActionButton} from 'app/ui/components/ActionButton';

import {TabbedCodeblockProps} from './TabbedCodeblock';
import styles from './TabbedCodeblock.scss';

type TabbedCodeblockPostfixProps = Pick<
  TabbedCodeblockProps,
  'actions' | 'postfix' | 'nested'
>;

export function TabbedCodeblockPostfix({
  actions,
  postfix,
  nested,
}: TabbedCodeblockPostfixProps) {
  const postfixMarkup = postfix && (
    <div className={classNames(styles.Postfix)}>{postfix}</div>
  );
  const actionsMarkup = actions && actions.length > 0 && (
    <div className={styles.ActionsContainer}>
      {actions.map((action) => (
        <div
          key={action.id}
          className={classNames(styles.ActionsItem, {
            [styles.Small]: nested,
          })}
        >
          <ActionButton
            action={action}
            // eslint-disable-next-line @shopify/jsx-no-complex-expressions
            size={nested ? 'small' : 'large'}
          />
        </div>
      ))}
    </div>
  );

  return postfixMarkup || actionsMarkup ? (
    <>
      {postfixMarkup}
      {actionsMarkup}
    </>
  ) : null;
}
