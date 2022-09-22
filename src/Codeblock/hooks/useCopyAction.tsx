import React, {useCallback} from 'react';
import {useI18n} from '@shopify/react-i18n';
import {ClipboardMinorIcon} from 'app/ui/icons';
import {Icon} from 'app/ui/components/Icon';
import randomNumWithPrefix from 'app/ui/utilities/randomNumWithPrefix';
import {trimWhitespaceAddNewline} from 'app/ui/utilities/strings';
import utils from 'app/assets/javascripts/helpers/monorail-events';

import {CodeblockActionProps} from '../interfaces';

export const useCopyAction = (content: string): CodeblockActionProps => {
  const [i18n] = useI18n();
  const copyActionLabel = i18n.translate('copyAction.copy');
  const copyFeedbackLabel = i18n.translate('copyAction.feedback');

  const copyAction = useCallback(
    (_id, evt) => {
      navigator.clipboard.writeText(trimWhitespaceAddNewline(content));
      dispatchCopyEvent(evt);
    },
    [content],
  );

  return {
    id: randomNumWithPrefix('copy'),
    description: copyActionLabel,
    feedback: copyFeedbackLabel,
    content: '',
    icon: <Icon source={ClipboardMinorIcon} />,
    callback: copyAction,
  };
};

function dispatchCopyEvent(evt: React.MouseEvent<HTMLElement>): void {
  const codeblocksOnPage = document.querySelectorAll('.codeblock');
  const currentCodeblock = evt.currentTarget.closest('.codeblock');
  let currentCodeblockIndex;
  codeblocksOnPage.forEach((codeblock, index) => {
    if (currentCodeblock === codeblock) {
      currentCodeblockIndex = index.toString();
    }
  });
  const pageUrl = window.location.href;
  const strippedPageUrl = window.location.pathname;
  const footerRootElement = document.getElementById('PageContainerFooter');
  const pageGid = footerRootElement?.dataset.gid || '';
  const clickType = 'copy';
  utils.monorailEvent('codeblockClick', {
    pageUrl,
    strippedPageUrl,
    pageGid,
    clickType,
    numberCodeBlocksOnPage: codeblocksOnPage.length,
    codeBlockId: currentCodeblockIndex,
  });
}
