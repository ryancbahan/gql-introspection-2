import React, {useRef, useEffect} from 'react';
import debounce from 'lodash.debounce';
import {Extension, EditorState} from '@codemirror/state';
import {classHighlighter} from '@lezer/highlight';
import {
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  EditorView,
  rectangularSelection,
  lineNumbers,
  ViewUpdate,
} from '@codemirror/view';
import {
  indentOnInput,
  LRLanguage,
  LanguageSupport,
  bracketMatching,
  syntaxHighlighting,
} from '@codemirror/language';
import {defaultKeymap, history, historyKeymap} from '@codemirror/commands';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import {
  liquid,
  oobleckLanguage,
  oobleckTagLanguage,
  liquidHighLightStyle,
} from '@shopify/lang-liquid';
import {classNames} from '@shopify/css-utilities';
import utils from 'app/assets/javascripts/helpers/monorail-events';

import syntaxStyles from './InteractiveCodeblockContent.scss';

type VariantType = 'editable' | 'oneLine' | 'readOnly';

export interface InteractiveCodeblockContentProps {
  content: string;
  variant?: VariantType;
  language?: string;
  className?: string;
  updateFunction?: (arg: string) => void;
  setCodeView?: (arg: EditorView) => void;
  unmountCallback?: (arg: EditorView) => void;
  relatedItem?: string;
}

const laguageMap: {[key: string]: LRLanguage | LanguageSupport} = {
  liquid: liquid(),
  oobleck: oobleckLanguage,
  oobleckTag: oobleckTagLanguage,
};

const basicEditor: Extension = [
  lineNumbers(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  highlightActiveLine(),
  highlightActiveLineGutter(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...completionKeymap,
  ]),
];

const variantMap = (
  variant: VariantType,
  updateListenerExtension: Extension,
): Extension =>
  ({
    editable: [basicEditor, updateListenerExtension],
    readOnly: [
      basicEditor,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
    ],
    oneLine: [EditorState.readOnly.of(true), EditorView.editable.of(false)],
  }[variant]);

function monorailEvent(relatedItem?: string) {
  const [relatedEntity, subEntity, exampleName] = relatedItem?.split('-') ?? [];
  const anchorLink = relatedEntity
    ? `#${relatedEntity}${subEntity ? `-${subEntity}` : ''}`
    : '';
  const eventData = {
    actionType: 'interactiveCodeBlockEdit',
    pageUrl: window.location.pathname + anchorLink,
    strippedPageUrl: window.location.pathname,
    relatedEntity,
    subEntity,
    exampleName,
  };

  utils.monorailEvent('liquidInteractionEvent', eventData);
}

export const createEditor = (
  content: string,
  variant: VariantType,
  language: string,
  parent: HTMLDivElement,
  updateFunction?: (arg: string) => void,
  relatedItem?: string,
) => {
  let firstEdit = true;
  const debouncedfunction = debounce((update) => {
    if (firstEdit) {
      monorailEvent(relatedItem);
      firstEdit = false;
    }
    if (updateFunction) {
      updateFunction(update.state.doc.toString());
    }
  }, 300);

  const updateDoc = (update: ViewUpdate) => {
    if (update.docChanged) {
      debouncedfunction(update);
    }
  };

  const updateListenerExtension = EditorView.updateListener.of(updateDoc);

  return new EditorView({
    state: EditorState.create({
      doc: content,
      extensions: [
        EditorView.domEventHandlers({
          keydown(event) {
            event.stopImmediatePropagation();
          },
        }),
        laguageMap[language],
        variantMap(variant, updateListenerExtension),
        liquidHighLightStyle,
        syntaxHighlighting(classHighlighter),
        EditorView.lineWrapping,
      ],
    }),
    parent,
  });
};

export const InteractiveCodeblockContent = ({
  content,
  variant = 'editable',
  language = 'liquid',
  className,
  setCodeView,
  updateFunction,
  unmountCallback,
  relatedItem,
}: InteractiveCodeblockContentProps) => {
  const viewRef = useRef(null);

  useEffect(() => {
    const editorParent = viewRef?.current;
    if (!editorParent) {
      return;
    }

    const view = createEditor(
      content,
      variant,
      language,
      editorParent,
      updateFunction,
      relatedItem,
    );

    if (setCodeView) {
      setCodeView(view);
    }

    return () => {
      // saves the last state of the editor
      if (unmountCallback) {
        unmountCallback(view);
      }
      view.destroy();
    };
  }, [
    content,
    language,
    relatedItem,
    updateFunction,
    setCodeView,
    variant,
    unmountCallback,
  ]);

  return (
    <div className={classNames(syntaxStyles.Basics, className)} ref={viewRef} />
  );
};
