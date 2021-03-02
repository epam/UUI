import { RenderBlockProps } from "slate-react";
import { Editor as CoreEditor } from "slate";
import * as css from './quote.scss';
import * as React from "react";
import * as quoteIcon from "../../icons/quote.svg";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { getBlockDesirialiser } from '../../helpers';

export const quotePlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'uui-richTextEditor-quote':
                return <blockquote { ...props.attributes } className={ css.quote }>{ props.children }</blockquote>;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
        const { value } = editor;

        if (event.ctrlKey && event.keyCode === 81) { //ctrl + q
            return isQuote(editor) ? editor.unwrapBlock('uui-richTextEditor-quote') : editor.wrapBlock('uui-richTextEditor-quote');
        }

        if ((event.keyCode === 13 || event.keyCode === 8) && isQuote(editor) && value.anchorBlock.text === '') {
            return editor.unwrapBlock('uui-richTextEditor-quote');
        }

        return next();
    };

    const isQuote = (editor: CoreEditor) => {
        return editor.value.anchorBlock && (editor.value.document.getParent(editor.value.anchorBlock.key) as any).type === 'uui-richTextEditor-quote';
    };

    return {
        renderBlock,
        onKeyDown,
        queries: {
            isQuote,
        },
        sidebarButtons: [QuoteButton],
        serializers: [quoteDesializer],
    };
};

const QuoteButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ (props.editor as any).isQuote() } icon={ quoteIcon } onClick={ () => (props.editor as any).isQuote() ? props.editor.unwrapBlock('uui-richTextEditor-quote') : props.editor.wrapBlock('uui-richTextEditor-quote') } />;
};

const QUOTE_TAG: any = {
    blockquote: 'uui-richTextEditor-quote',
};

const quoteDesializer = getBlockDesirialiser(QUOTE_TAG);