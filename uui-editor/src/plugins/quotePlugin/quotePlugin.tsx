import React from 'react';

import {
    createBlockquotePlugin,
    BlockToolbarButton,
    getPluginType,
    isMarkActive,
    PlateEditor,
    StyledElementProps,
} from '@udecode/plate';

import { isPluginActive } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as QuoteIcon } from '../../icons/quote.svg';

import css from './quote.module.scss';

const noop = () => {};
const KEY = 'uui-richTextEditor-quote';

const Quote = (props: StyledElementProps) => {
    return <blockquote
        { ...props.attributes }
        className={ css.quote }
    >
        { props.children }
    </blockquote>;
};

export const quotePlugin = () => createBlockquotePlugin({
    key: KEY,
    type: KEY,
    component: Quote,
    options: {
        hotkey: 'ctrl+q',
    },
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const QuoteButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(KEY)) return null;

    return (
        <BlockToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            type={ getPluginType(editor, KEY) }
            actionHandler='onMouseDown'
            icon={ <ToolbarButton
                onClick={ noop }
                icon={ QuoteIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, KEY!) }
            /> }
        />
    );
};