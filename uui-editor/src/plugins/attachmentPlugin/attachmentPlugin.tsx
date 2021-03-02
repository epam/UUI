import { RenderBlockProps } from "slate-react";
import { Editor as CoreEditor } from "slate";
import * as React from "react";
import { AttachmentBlock } from './AttachmentBlock';

export const attachmentPlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'attachment':
                return <AttachmentBlock { ...props } />;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: any, next: () => any) => {

        if (event.key === 'Enter' && editor.value.focusBlock.type === 'attachment') {
            return editor.insertEmptyBlock();
        }

        if ((event.key === 'Backspace' || event.key === 'Delete') && editor.value.focusBlock.type === 'attachment') {
            return editor.setBlocks('paragraph');
        }

        next();
    };

    return {
        renderBlock,
        onKeyDown,
    };
};