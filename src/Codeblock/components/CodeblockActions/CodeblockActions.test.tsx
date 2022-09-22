import React from 'react';
import {mount} from '@shopify/react-testing';

import {CodeblockActions} from './CodeblockActions';

describe('CodeblockActions component', () => {
  it('renders without error', () => {
    const testActions = [
      {
        id: 'one',
        description: 'Action one',
        content: 'Reset',
        callback: () => {},
      },
      {
        id: 'two',
        description: 'Action Two',
        content: 'Copy',
        callback: () => {},
      },
    ];

    const wrapper = mount(<CodeblockActions actions={testActions} />);

    expect(wrapper).not.toBeNull();
  });

  it('invokes action callback on click', () => {
    const mockCallback = jest.fn();
    const mockEvent = {
      stopPropagation: jest.fn(),
    };

    const testActions = [
      {
        id: 'testid',
        description: 'Action one',
        content: 'Reset',
        callback: (id: string) => {
          mockCallback(id);
        },
      },
    ];

    const wrapper = mount(<CodeblockActions actions={testActions} />);
    wrapper?.find('button')?.trigger('onClick', mockEvent);

    expect(mockCallback).toHaveBeenCalledWith('testid');
  });
});
