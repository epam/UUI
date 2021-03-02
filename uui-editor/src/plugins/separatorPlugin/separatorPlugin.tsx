import {Editor, RenderBlockProps} from "slate-react";
import { Editor as CoreEditor } from "slate";
import * as React from "react";
import { Separator } from "./Separator";
import * as separateIcon from "../../icons/breakline.svg";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import {getBlockDesirialiser, isTextSelected} from '../../helpers';

export const separatorPlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'separatorBLock':
                return <Separator { ...props } />;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {

        if (event.keyCode == 13 && editor.value.focusBlock.type === 'separatorBLock') {
            return (editor as any).insertEmptyBlock(editor);
        }

        next();
    };

    return {
        renderBlock,
        onKeyDown,
        sidebarButtons: [SeparatorButton],
        serializers: [separatorDesializer],
    };
};

const SeparatorButton = (props: { editor: Editor }) => {
    return <ToolbarButton
        onClick={ () => props.editor.setBlocks((props.editor as any).createBlock({}, 'separatorBLock')) }
        icon={ separateIcon }
        isDisabled={ isTextSelected(props.editor) }
    />;
};

const SEPARATOR_TAG: any = {
    hr: 'separatorBLock',
};

const separatorDesializer = getBlockDesirialiser(SEPARATOR_TAG);