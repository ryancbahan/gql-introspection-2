/* eslint-disable jest/no-done-callback */
import React from 'react';
import {ExternalMinorIcon, GithubMinorIcon} from 'app/ui/icons';
import {Icon} from 'app/ui/components/Icon';
import {mountWithAppContext} from 'app/ui/utilities/testing';
import utils from 'app/assets/javascripts/helpers/monorail-events';

import {CodeblockActionProps} from '..';

import {getLinksAsActions} from './getLinksAsActions';

describe('getLinkAction', () => {
  it('generates link actions correctly', () => {
    const input = [
      {
        id: '1',
        description: 'link',
        url: 'https://www.google.com',
        content: 'Google',
        callback: () => {},
      },
      {
        id: '2',
        description: 'link',
        url: 'https://www.github.com',
        content: 'Github',
        callback: () => {},
      },
    ];

    const output: CodeblockActionProps[] = [
      {
        id: 'link-1',
        description: 'https://www.google.com',
        content: 'Google',
        url: 'https://www.google.com',
        external: true,
        icon: (
          <Icon source={ExternalMinorIcon} accessibilityLabel="External Link" />
        ),
        callback: expect.anything(),
      },
      {
        id: 'link-2',
        description: 'https://www.github.com',
        content: 'Github',
        url: 'https://www.github.com',
        external: true,
        icon: (
          <Icon source={GithubMinorIcon} accessibilityLabel="External Link" />
        ),
        callback: expect.anything(),
      },
    ];

    const actions = getLinksAsActions(input);

    expect(actions).toStrictEqual(output);
  });

  it('sends a monorail event with the right payload', (done) => {
    jest.spyOn(utils, 'monorailEvent').mockImplementation();
    const input = [
      {
        id: '1',
        description: 'link',
        url: 'https://www.shopify.com',
        callback: () => {},
      },
    ];

    const mockEvent = {
      currentTarget: {
        closest: jest.fn(),
      },
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    function HookTester({callback}: any) {
      const action = getLinksAsActions(input);
      callback(action[0].callback('id', mockEvent));
      return null;
    }

    const assert = () => {
      const expectedPayload = {
        clickType: 'link',
        codeBlockId: undefined,
        numberCodeBlocksOnPage: 0,
        pageGid: '',
        linkUrl: input[0].url,
        pageUrl: 'http://localhost/',
        strippedPageUrl: '/',
      };
      expect(utils.monorailEvent).toHaveBeenCalledWith(
        'codeblockClick',
        expectedPayload,
      );
      done();
    };

    mountWithAppContext(<HookTester callback={assert} />);
  });
});
