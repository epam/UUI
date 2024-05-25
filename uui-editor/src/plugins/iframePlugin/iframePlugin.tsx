import {
    PlateEditor, createPluginFactory, getBlockAbove, getEndPoint, getPluginType, insertEmptyElement, selectEditor, PlatePlugin, isElement, TNodeEntry,
} from '@udecode/plate-common';
import React from 'react';

import { UploadFileToggler } from '@epam/uui-components';

import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as PdfIcon } from '../../icons/pdf.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { IframeBlock } from './IframeBlock';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { IFRAME_PLUGIN_KEY, IFRAME_TYPE } from './constants';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/constants';
import { normalizeIframeElement } from '../../migrations';

// TODO: implement iframe resize
export const iframePlugin = (): PlatePlugin => {
    const createIframePlugin = createPluginFactory<WithToolbarButton>({
        key: IFRAME_PLUGIN_KEY,
        type: IFRAME_TYPE,
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
                        return {
                            type,
                            url,
                        };
                    }
                },
            },
        }),
        handlers: {
            // move selection to the end of iframe for further new line render on Enter click
            onLoad: (editor) => () => {
                if (!getBlockAboveByType(editor, [IFRAME_TYPE])) return;

                const videoEntry = getBlockAbove(editor, {
                    match: { type: getPluginType(editor, IFRAME_TYPE) },
                });
                if (!videoEntry) return;

                const endPoint = getEndPoint(editor, videoEntry[1]);
                selectEditor(editor, {
                    at: endPoint.path,
                    focus: true,
                });
            },
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, [IFRAME_TYPE])) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }
            },
        },
        options: {
            bottomBarButton: IframeButton,
        },
        // move to common function / plugin
        withOverrides: (editor) => {
            const { normalizeNode } = editor;

            editor.normalizeNode = (entry) => {
                const [node] = entry;

                if (isElement(node) && node.type === IFRAME_TYPE) {
                    normalizeIframeElement(editor, entry);
                }

                normalizeNode(entry);
            };

            return editor;
        },
    });

    return createIframePlugin();
};

interface IIframeButton {
    editor: PlateEditor;
}

export function IframeButton({ editor }: IIframeButton) {
    const onFilesAdded = useFilesUploader(editor);

    if (!useIsPluginActive(IFRAME_PLUGIN_KEY)) return null;

    return (
        <UploadFileToggler
            render={ (props) => (
                <ToolbarButton
                    { ...props }
                    icon={ PdfIcon }
                    isDisabled={ isTextSelected(editor, true) }
                />
            ) }
            onFilesAdded={ onFilesAdded }
            accept=".pdf"
        />
    );
}
