import React from 'react';
import {AlertMinorIcon} from 'app/ui/icons';
import {Tooltip} from 'app/ui/components/Tooltip';
import {Icon} from 'app/ui/components/Icon';

import styles from './CodeblockInfo.scss';

interface Props {
  /** Tooltip content (must be a string so it can also be read by the screen reader) */
  content: string;
}

/** Intended for use in the "postfix" prop of a codeblock titlebar or tab bar,
 * to convey meta-information about the codeblock.
 */
export function CodeblockHeadingNotice({content}: Props) {
  return (
    <div className={styles.warningIconFill}>
      <Tooltip content={content}>
        <Icon source={AlertMinorIcon} accessibilityLabel={content} />
      </Tooltip>
    </div>
  );
}
