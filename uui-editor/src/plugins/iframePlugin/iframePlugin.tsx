import { RenderBlockProps, Editor } from "slate-react";
import * as React from "react";
import { IframeBlock } from "./IframeBlock";
import { UploadFileToggler } from '@epam/uui-components';
import * as pdfIcon from "../../icons/pdf.svg";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { parseStringToCSSProperties } from "@epam/uui";
import {isTextSelected} from "../../helpers";

export const iframePlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: Editor, next: () => any) => {
        switch (props.node.type) {
            case 'iframe':
                return <IframeBlock { ...props } />;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {

        if (event.keyCode == 13 && editor.value.focusBlock.type === 'iframe') {
            return (editor as any).insertEmptyBlock();
        }

        if ((event.key === 'Backspace' || event.key === 'Delete') && editor.value.focusBlock.type === 'iframe') {
            return editor.setBlocks('paragraph');
        }

        next();
    };

    return {
        renderBlock,
        onKeyDown,
        sidebarButtons: [FileUploadButton],
        serializers: [iframeDesializer],
    };
};

const FileUploadButton = (props: { editor: Editor }) => {
    return (
        <UploadFileToggler
            render={ toglerProps => <ToolbarButton { ...toglerProps } icon={ pdfIcon } isDisabled={ isTextSelected(props.editor) } /*cx={ css.pdfButton }*//> }
            onFilesAdded={ files => { files.map(file => (props.editor as any).handleUploadFile(file)); } }
            accept='.pdf'
        />
    );
};

const iframeDesializer = (el: any, next: any) => {
    if (el.tagName.toLowerCase() === 'iframe') {
        return {
            object: 'block',
            type: 'iframe',
            data: {
                src: el.getAttribute('src'),
                style: parseStringToCSSProperties(el.getAttribute('style')),
            },
        };
    }
};