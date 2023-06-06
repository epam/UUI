import { RenderBlockProps, Editor } from "slate-react";
import * as React from "react";
import { ImageBlock } from "./ImageBlock";
import css from './ImageBlock.module.scss';
import { useUuiContext } from "@epam/uui-core";
import {AddImageModal} from "./AddImageModal";
import { ReactComponent as ImageIcon } from "../../icons/image.svg";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { uuiSkin } from "@epam/uui-core";
import {isTextSelected} from "../../helpers";

export const imagePlugin = () => {
    const { Spinner } = uuiSkin;

    const renderBlock = (props: RenderBlockProps, editor: Editor, next: () => any) => {
        switch (props.node.type) {
            case 'loader':
                return <Spinner { ...props } cx={ css.spinner }/>;
            case 'image':
                return <ImageBlock { ...props } editor={ editor } />;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
        if (event.keyCode == 13 && editor.value.focusBlock.type === 'image') {
            return (editor as any).insertEmptyBlock(editor);
        }

        if ((event.key === 'Backspace' || event.key === 'Delete') && editor.value.focusBlock.type === 'image') {
            return editor.setBlocks('paragraph');
        }

        next();
    };

    return {
        renderBlock,
        onKeyDown,
        sidebarButtons: [ImageButton],
        serializers: [imageDesializer],
    };
};

export const ImageButton = (props: { editor: Editor }) => {
    const context = useUuiContext();
    return <ToolbarButton
        onClick={ () => context.uuiModals.show<string>(modalProps => <AddImageModal { ...modalProps } editor={ props.editor } />)
            .catch(() => null) }
        icon={ ImageIcon }
        isDisabled={ isTextSelected(props.editor) }
    />;
};

const imageDesializer = (el: any, next: any) => {
    if (el.tagName.toLowerCase() === 'img') {
        return {
            object: 'block',
            type: 'image',
            data: {
                src: el.getAttribute('src'),
            },
        };
    }
};
