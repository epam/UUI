import React from 'react';
import { UploadFileToggler } from '@epam/uui-components';

import {
    createPluginFactory,
    getBlockAbove,
    getEndPoint,
    getPluginType,
    insertEmptyElement,
    PlateEditor,
    ToolbarButton as PlateToolbarButton,
    selectEditor,
} from '@udecode/plate';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as PdfIcon } from '../../../icons/pdf.svg';

import { isPluginActive, isTextSelected } from '../../../helpers';

import { IframeBlock } from './IframeBlock';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';
import { getBlockAboveByType } from '../../utils/getAboveBlock';

export const IFRAME_PLUGIN_KEY = 'iframe';

export const iframePlugin = () => {
    const createIframePlugin = createPluginFactory({
        key: IFRAME_PLUGIN_KEY,
        isElement: true,
        isVoid: true,
        component: IframeBlock,
        // paste iframe from clipboard
        then: (editor, { type }) => ({
            deserializeHtml: {
                rules: [{ validNodeName: 'IFRAME' }],
                getNode: (el: HTMLElement) => {
                    const url = el.getAttribute('src');
                    if (url) {
                        return { type, url, src: url, data: { src: url } };
                    }
                },
            },
        }),
        handlers: {
            // move selection to the end of iframe for further new line render on Enter click
            onLoad: (editor) => (event) => {
                if (!getBlockAboveByType(editor, ['iframe'])) return;

                const videoEntry = getBlockAbove(editor, {
                    match: { type: getPluginType(editor, 'iframe') },
                });
                if (!videoEntry) return;

                const endPoint = getEndPoint(editor, videoEntry[1])
                selectEditor(editor, { at: endPoint.path, focus: true });
            },
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, ['iframe'])) return;

                if (event.keyCode == 13) {
                    return insertEmptyElement(editor, 'paragraph');
                }

                if ((event.key === 'Backspace' || event.key === 'Delete')) {
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
    if (!isPluginActive(IFRAME_PLUGIN_KEY)) return null;

    const onFilesAdded = useFilesUploader(editor);

    return (
        <UploadFileToggler
            render={ (props) => (
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        { ...props }
                        icon={ PdfIcon }
                        isDisabled={ isTextSelected(editor, true) }
                    /> }
                />
            ) }
            onFilesAdded={ onFilesAdded }
            accept='.pdf'
        />
    );
};