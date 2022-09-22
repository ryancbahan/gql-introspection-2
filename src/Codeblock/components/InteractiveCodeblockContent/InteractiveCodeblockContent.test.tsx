import React from 'react';
import {mountWithAppContext} from 'app/ui/utilities/testing';
import utils from 'app/assets/javascripts/helpers/monorail-events';

import {
  createEditor,
  InteractiveCodeblockContent,
} from './InteractiveCodeblockContent';

jest.mock('app/assets/javascripts/helpers/monorail-events', () => ({
  monorailEvent: jest.fn(),
}));

const mockUpdate = jest.fn();
jest.useFakeTimers();

describe('createEditor', () => {
  const rangeRects = window.Range.prototype.getClientRects;

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    window.Range.prototype.getClientRects = rangeRects;
  });

  it('editor has intial text', () => {
    const parent = document.createElement('div');
    const editor = createEditor(
      'hello friends',
      'editable',
      'liquid',
      parent,
      mockUpdate,
    );

    expect(editor.contentDOM.textContent).toBe('hello friends');
  });

  it('calls updateFunction with debounce on changes', () => {
    window.Range.prototype.getClientRects = function () {
      return document.createElement('div').getClientRects();
    };

    const parent = document.createElement('div');
    const editor = createEditor(
      'hello friendship',
      'editable',
      'liquid',
      parent,
      mockUpdate,
    );

    editor.dispatch({
      changes: {from: 0, insert: 'meow'},
    });

    // editor changes but updateFunction has not been called
    expect(editor.contentDOM.textContent).toBe('meowhello friendship');
    expect(mockUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);

    // update function is called after debounce time
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('calls monorailEvent with debounce on first change', () => {
    window.Range.prototype.getClientRects = function () {
      return document.createElement('div').getClientRects();
    };

    const parent = document.createElement('div');
    const editor = createEditor(
      'hello friendship',
      'editable',
      'liquid',
      parent,
      mockUpdate,
    );

    editor.dispatch({
      changes: {from: 0, insert: 'meow'},
    });

    // editor changes but updateFunction has not been called
    expect(editor.contentDOM.textContent).toBe('meowhello friendship');
    expect(utils.monorailEvent).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);

    // update function is called after debounce time
    expect(utils.monorailEvent).toHaveBeenCalled();
  });

  it('does not call monorailEvent with debounce on second change', () => {
    window.Range.prototype.getClientRects = function () {
      return document.createElement('div').getClientRects();
    };

    const parent = document.createElement('div');
    const editor = createEditor(
      'hello friendship',
      'editable',
      'liquid',
      parent,
      mockUpdate,
    );

    editor.dispatch({
      changes: {from: 0, insert: 'meow'},
    });

    // editor changes but updateFunction has not been called
    expect(editor.contentDOM.textContent).toBe('meowhello friendship');

    jest.advanceTimersByTime(300);
    expect(utils.monorailEvent).toHaveBeenCalled();

    editor.dispatch({
      changes: {from: 0, insert: 'second change'},
    });

    jest.advanceTimersByTime(300);
    expect(utils.monorailEvent).toHaveBeenCalledTimes(1);
  });

  it('does not call updateFunction when there are no changes', () => {
    window.Range.prototype.getClientRects = function () {
      return document.createElement('div').getClientRects();
    };

    const parent = document.createElement('div');
    const editor = createEditor(
      'hello friendship',
      'editable',
      'liquid',
      parent,
      mockUpdate,
    );

    editor.dispatch({
      changes: {from: 0, insert: ''},
    });

    jest.advanceTimersByTime(300);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe('InteractiveCodeblockContent', () => {
  it('displays the content', () => {
    const wrapper = mountWithAppContext(
      <InteractiveCodeblockContent content="hi" />,
    );

    expect(wrapper).toContainReactText('hi');
  });

  it('calls the setCodeView function when it exists', () => {
    const setCodeView = jest.fn();

    mountWithAppContext(
      <InteractiveCodeblockContent content="hi" setCodeView={setCodeView} />,
    );

    expect(setCodeView).toHaveBeenCalledTimes(1);
  });

  it('does not call the unmountCallback when component has not been unmounted', () => {
    const unmountCallback = jest.fn();

    mountWithAppContext(
      <InteractiveCodeblockContent
        content="hi"
        unmountCallback={unmountCallback}
      />,
    );

    expect(unmountCallback).toHaveBeenCalledTimes(0);
  });

  it('calls the unmountCallback function when component unmounts', () => {
    const unmountCallback = jest.fn();

    const wrapper = mountWithAppContext(
      <InteractiveCodeblockContent
        content="hi"
        unmountCallback={unmountCallback}
      />,
    );

    wrapper.unmount();

    expect(unmountCallback).toHaveBeenCalledTimes(1);
  });
});
