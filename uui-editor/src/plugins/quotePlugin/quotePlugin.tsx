import React from 'react';

import { ELEMENT_BLOCKQUOTE, createBlockquotePlugin } from '@udecode/plate-block-quote';
import { PlateEditor, PlatePluginComponent, focusEditor, isMarkActive, toggleNodeType } from '@udecode/plate-common';

import { isPluginActive } from '../../helpers';
import { ReactComponent as QuoteIcon } from '../../icons/quote.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import css from './quote.module.scss';

const QUOTE_PLUGIN_KEY = 'uui-richTextEditor-quote';

const Quote: PlatePluginComponent = (props) => {
    return <blockquote
        { ...props.attributes }
        className={ css.quote }
    >
        { props.children }
    </blockquote>;
};

export const quotePlugin = () => createBlockquotePlugin({
    overrideByKey: {
        [ELEMENT_BLOCKQUOTE]: {
            key: QUOTE_PLUGIN_KEY,
            type: QUOTE_PLUGIN_KEY,
            component: Quote,
            options: {
                hotkey: 'ctrl+q',
            },
        }
    }
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const QuoteButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(QUOTE_PLUGIN_KEY)) return null;

    const onQuoteButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleNodeType(editor, { activeType: type });
        focusEditor(editor);
    }

    return (
        <ToolbarButton
            onClick={ (e) => onQuoteButtonClick(e, QUOTE_PLUGIN_KEY) }
            icon={ QuoteIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, QUOTE_PLUGIN_KEY) }
        />
    );
};