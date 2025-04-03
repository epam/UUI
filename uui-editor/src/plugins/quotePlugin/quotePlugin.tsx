import React from 'react';

import { ELEMENT_BLOCKQUOTE, createBlockquotePlugin } from '@udecode/plate-block-quote';
import {
    PlateEditor, PlatePluginComponent, focusEditor, toggleNodeType, PlatePlugin, getBlockAbove,
} from '@udecode/plate-common';

import { useIsPluginActive } from '../../helpers';
import { ReactComponent as QuoteIcon } from '../../icons/quote.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import css from './quote.module.scss';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { QUOTE_PLUGIN_KEY, QUOTE_TYPE } from './constants';

const Quote: PlatePluginComponent = function QuoteComponent(props) {
    return (
        <blockquote
            { ...props.attributes }
            className={ css.quote }
        >
            { props.children }
        </blockquote>
    );
};

export const quotePlugin = (): PlatePlugin<WithToolbarButton> => createBlockquotePlugin<WithToolbarButton>({
    overrideByKey: {
        [ELEMENT_BLOCKQUOTE]: {
            key: QUOTE_PLUGIN_KEY,
            type: QUOTE_TYPE,
            component: Quote,
            options: {
                hotkey: 'ctrl+q',
                bottomBarButton: QuoteButton,
            },
        },
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function QuoteButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(QUOTE_PLUGIN_KEY)) return null;

    const block = getBlockAbove(editor);

    const onQuoteButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleNodeType(editor, { activeType: type });
        focusEditor(editor);
    };

    return (
        <ToolbarButton
            onClick={ (e) => onQuoteButtonClick(e, QUOTE_PLUGIN_KEY) }
            icon={ QuoteIcon }
            isActive={ !!editor?.selection && block?.length && block[0].type === QUOTE_TYPE }
        />
    );
}
