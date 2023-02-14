import React from 'react';
import { UploadFileToggler } from '@epam/uui-components';

import {
    createPluginFactory,
    getBlockAbove,
    getPreventDefaultHandler,
    insertEmptyElement,
    PlateEditor,
    ToolbarButton as PlateToolbarButton,
} from '@udecode/plate';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as PdfIcon } from '../../../icons/pdf.svg';

import { isPluginActive, isTextSelected } from '../../../helpers';

import { IframeBlock } from './IframeBlock';

const KEY = 'iframe';

export const iframePlugin = () => {
    const createIframePlugin = createPluginFactory({
        key: KEY,
        isElement: true,
        isVoid: true,
        component: IframeBlock,
        handlers: {
            onKeyDown: (editor) => (event) => {
                const block = getBlockAbove(editor);
                const type = block?.length && block[0].type;

                if (event.keyCode == 13 && type === 'iframe') {
                    return insertEmptyElement(editor, 'paragraph');
                }

                if ((event.key === 'Backspace' || event.key === 'Delete') && type === 'iframe') {
                    return insertEmptyElement(editor, 'paragraph');
                }
            },
        },
    });

    return createIframePlugin();
};

interface IIframeButton {
    editor: PlateEditor;
}

export const IframeButton = ({ editor }: IIframeButton) => {

    if (!isPluginActive(KEY)) return null;

    return (
        <UploadFileToggler
            render={ (props) => (
                <PlateToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
                    active={ true }
                    onMouseDown={
                        editor
                            ? getPreventDefaultHandler()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        { ...props }
                        icon={ PdfIcon }
                        isDisabled={ isTextSelected(editor, true) }
                    /> }
                />
            ) }
            onFilesAdded={ (files) =>
                (editor as any).insertData({ getData: () => 'files', files })
            }
            accept='.pdf'
        />
    );
};

// import { RenderBlockProps, Editor } from "slate-react";
// import * as React from "react";
// import { IframeBlock } from "./IframeBlock";
// import { UploadFileToggler } from '@epam/uui-components';
// import { ReactComponent as PdfIcon } from "../../icons/pdf.svg";
// import { ToolbarButton } from '../../implementation/ToolbarButton';
// import { parseStringToCSSProperties } from "@epam/uui-core";
// import {isTextSelected} from "../../helpers";
//
// export const iframePlugin = () => {
//     const renderBlock = (props: RenderBlockProps, editor: Editor, next: () => any) => {
//         switch (props.node.type) {
//             case 'iframe':
//                 return <IframeBlock { ...props } />;
//             default:
//                 return next();
//         }
//     };Attachment Plugin
//  PDF plugin
// Placeholder Plugin
//
// Quote Plugin
//
// Separator Plugin
//
//     const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
//
//         if (event.keyCode == 13 && editor.value.focusBlock.type === 'iframe') {
//             return (editor as any).insertEmptyBlock();
//         }
//
//         if ((event.key === 'Backspace' || event.key === 'Delete') && editor.value.focusBlock.type === 'iframe') {
//             return editor.setBlocks('paragraph');
//         }
//
//         next();
//     };
//
//     return {
//         renderBlock,
//         onKeyDown,
//         sidebarButtons: [FileUploadButton],
//         serializers: [iframeDesializer],
//     };
// };
//
// const FileUploadButton = (props: { editor: Editor }) => {
//     return (
//         <UploadFileToggler
//             render={ toglerProps => <ToolbarButton { ...toglerProps } icon={ PdfIcon } isDisabled={ isTextSelected(props.editor) } /*cx={ css.pdfButton }*//> }
//             onFilesAdded={ files => { files.map(file => (props.editor as any).handleUploadFile(file)); } }
//             accept='.pdf'
//         />
//     );
// };
//
// const iframeDesializer = (el: any, next: any) => {
//     if (el.tagName.toLowerCase() === 'iframe') {
//         return {
//             object: 'block',
//             type: 'iframe',
//             data: {
//                 src: el.getAttribute('src'),
//                 style: parseStringToCSSProperties(el.getAttribute('style')),
//             },
//         };
//     }
// };