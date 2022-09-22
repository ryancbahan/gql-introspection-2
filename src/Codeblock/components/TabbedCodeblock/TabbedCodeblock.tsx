import React from 'react';
import {classNames} from '@shopify/css-utilities';
import type {TabsProps} from 'react-tabs';
import type {CodeblockActionProps} from 'app/ui/components/Codeblock';
import {Tabbed, TabbedProps} from 'app/ui/components/Tabbed';

import styles from './TabbedCodeblock.scss';
import {TabbedCodeblockPostfix} from './TabbedCodeblockPostfix';

export interface TabbedCodeblockProps extends TabbedProps {
  /** Codeblock actions eg: copy/links */
  actions?: CodeblockActionProps[];
  /** Add Nested style to compress titlebar height */
  nested?: boolean;
  /** Explicitly show the tab bar even though there is only one tab */
  forceTabs?: boolean;
}

type ControlledTabbedCodeblockProps = TabbedCodeblockProps &
  Required<Pick<TabsProps, 'onSelect' | 'selectedIndex'>>;

export const ControlledTabbedCodeblock = (
  props: ControlledTabbedCodeblockProps,
) => <TabbedCodeblock {...props} />;

export function TabbedCodeblock({
  tabs,
  prefix,
  actions,
  nested,
  postfix,
  forceTabs = false,
  ...props
}: TabbedCodeblockProps) {
  return (
    <Tabbed
      tabs={tabs}
      className={classNames({
        [styles.TabsContainerMargin]: nested,
      })}
      tabBarClassName={classNames({[styles.Small]: nested})}
      tabListClassName={classNames({
        [styles.HideTabs]: !forceTabs && tabs.length === 1,
      })}
      tabPanelContainerClassName={styles.ResetLineHeight}
      prefix={
        prefix && (
          <div
            className={classNames(
              {[styles.Expanded]: !forceTabs && tabs.length === 1},
              styles.Prefix,
            )}
          >
            {prefix}
          </div>
        )
      }
      postfix={
        <TabbedCodeblockPostfix
          actions={actions}
          postfix={postfix}
          nested={nested}
        />
      }
      {...props}
    />
  );
}
