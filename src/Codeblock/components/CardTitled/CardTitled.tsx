import React from 'react';
import {classNames} from '@shopify/css-utilities';
import {notEmpty} from 'app/ui/utilities';
import {
  CodeblockTitleBar,
  CodeblockTitleBarProps,
} from 'app/ui/components/Codeblock';

import styles from './CardTitled.scss';

interface CardTitledProps {
  children: React.ReactNode;
  titleProps?: CodeblockTitleBarProps;
  /** To minimize used space and condense to top right */
  compacted?: boolean;
  /** To set title spacing for a single line */
  oneLiner?: boolean;
}

export function CardTitled({
  children,
  titleProps,
  compacted,
  oneLiner,
}: CardTitledProps) {
  return (
    <Card
      className={classNames({
        [styles.CompactedContainer]: compacted,
        [styles.ActionPadding]: compacted && titleProps?.actions,
      })}
    >
      {Object.values(titleProps || {}).some(notEmpty) && (
        <div
          className={classNames({
            [styles.Floating]: compacted,
            [styles.Oneliner]: oneLiner,
          })}
        >
          <CodeblockTitleBar {...titleProps} />
        </div>
      )}
      {children}
    </Card>
  );
}

interface CardProps extends React.HTMLProps<HTMLDivElement> {}

function Card({children, className, ...props}: CardProps) {
  return (
    <div className={classNames(styles.Card, className)} {...props}>
      {children}
    </div>
  );
}
