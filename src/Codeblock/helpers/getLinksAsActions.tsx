import React, {FunctionComponent, SVGProps} from 'react';
import {
  ExternalMinorIcon,
  GithubMinorIcon,
  YoutubeMinorIcon,
  TwitterMinorIcon,
} from 'app/ui/icons';
import {Icon} from 'app/ui/components/Icon';
import utils from 'app/assets/javascripts/helpers/monorail-events';

import {CodeblockActionProps} from '../interfaces';

const ICONS: {[key: string]: FunctionComponent<SVGProps<SVGSVGElement>>} = {
  default: ExternalMinorIcon,
  'github.com': GithubMinorIcon,
  'youtube.com': YoutubeMinorIcon,
  'twitter.com': TwitterMinorIcon,
};

export function getLinksAsActions(
  links: CodeblockActionProps[],
): CodeblockActionProps[] {
  return links.reduce<CodeblockActionProps[]>((accumulator, current) => {
    const linkIcon = getLinkIcon(current.url || '');

    const linkAction = (_id: string, evt?: React.MouseEvent) => {
      dispatchLinkEvent(evt, current.url);
    };

    const action = {
      id: `link-${current.id}`,
      description: current.url || '',
      content: current.content || '',
      url: current.url,
      external: true,
      icon: <Icon source={linkIcon} accessibilityLabel="External Link" />,
      callback: linkAction,
    };
    return accumulator.concat(action);
  }, []);
}

export function getLinkIcon(url: string): any {
  const domain = new URL(url).hostname.replace('www.', '');
  return ICONS[domain] == null ? ICONS.default : ICONS[domain];
}

export function dispatchLinkEvent(evt?: React.MouseEvent, url?: string): void {
  if (!evt) return;
  const codeblocksOnPage = Array.from(document.querySelectorAll('.codeblock'));
  const currentCodeblock = evt.currentTarget.closest('.codeblock');
  let currentCodeblockIndex;
  codeblocksOnPage.some((codeblock, index) => {
    if (currentCodeblock?.isEqualNode(codeblock)) {
      currentCodeblockIndex = index.toString();
    }
  });
  const pageUrl = window.location.href;
  const linkUrl = url;
  const strippedPageUrl = window.location.pathname;
  const footerRootElement = document.getElementById('PageContainerFooter');
  const pageGid = footerRootElement?.dataset.gid || '';
  const clickType = 'link';
  utils.monorailEvent('codeblockClick', {
    pageUrl,
    linkUrl,
    strippedPageUrl,
    pageGid,
    clickType,
    numberCodeBlocksOnPage: codeblocksOnPage.length,
    codeBlockId: currentCodeblockIndex,
  });
}
