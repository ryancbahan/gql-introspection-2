import React from 'react';
import {classNames} from '@shopify/css-utilities';
import {ActionButton} from 'app/ui/components/ActionButton';

import {CodeblockActionProps} from '../../interfaces';

import styles from './CodeblockActions.scss';

export interface CodeblockActionsProps {
  actions: CodeblockActionProps[];
  nested?: boolean;
}

export const CodeblockActions = ({nested, actions}: CodeblockActionsProps) => {
  return (
    <div className={styles.CodeblockActionsContainer}>
      {actions.map((action) => {
        const size = nested ? 'small' : 'large';
        return (
          <div
            key={action.id}
            className={classNames(styles.CodeblockActionsItem, {
              [styles.useNested]: nested,
            })}
          >
            <ActionButton action={action} size={size} />
          </div>
        );
      })}
    </div>
  );
};
