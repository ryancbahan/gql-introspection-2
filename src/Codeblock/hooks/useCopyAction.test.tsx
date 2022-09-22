/* eslint-disable jest/no-done-callback */
import React from 'react';
import {mountWithAppContext} from 'app/ui/utilities/testing';
import utils from 'app/assets/javascripts/helpers/monorail-events';

import {useCopyAction} from './useCopyAction';

describe('useCopyAction', () => {
  it('trims leading and trailing whitespace from the provided content, but preserves internal whitespace', (done) => {
    // @ts-ignore jsdom doesn't include clipboard
    navigator.clipboard = {
      writeText: jest.fn(),
    };
    const mockEvent = {
      currentTarget: {
        closest: jest.fn(),
      },
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    function HookTester({callback}: any) {
      const action = useCopyAction(input);
      callback(action.callback('id', mockEvent));
      return null;
    }
    const input =
      '\n\n\n    function greet() {\n  const greeting = "hello";\n  console.log(greeting);\n}\n\n\n';
    const expected =
      'function greet() {\n  const greeting = "hello";\n  console.log(greeting);\n}\n';

    const assert = () => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expected);
      expect(mockEvent.currentTarget.closest).toHaveBeenCalledWith(
        '.codeblock',
      );
      done();
    };

    mountWithAppContext(<HookTester callback={assert} />);
  });

  it('sends a monorail event with the right payload', (done) => {
    jest.spyOn(utils, 'monorailEvent').mockImplementation();
    // @ts-ignore jsdom doesn't include clipboard
    navigator.clipboard = {
      writeText: jest.fn(),
    };
    const mockEvent = {
      currentTarget: {
        closest: jest.fn(),
      },
    } as unknown as React.MouseEvent<HTMLButtonElement>;
    function HookTester({callback}: any) {
      const action = useCopyAction(input);
      callback(action.callback('id', mockEvent));
      return null;
    }
    const input = 'test';

    const assert = () => {
      const expectedPayload = {
        clickType: 'copy',
        codeBlockId: undefined,
        numberCodeBlocksOnPage: 0,
        pageGid: '',
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
