import React, { useState } from 'react';
import { FileUploadResponse, useUuiContext } from '@epam/uui-core';
import { Panel, FlexSpacer, FlexRow, Switch, MultiSwitch, ErrorNotification, Text } from '@epam/uui';
import { SlateEditor, defaultPlugins, imagePlugin, videoPlugin, attachmentPlugin, toDoListPlugin, baseMarksPlugin, linkPlugin,
    iframePlugin, notePlugin, separatorPlugin, uploadFilePlugin, tablePlugin, quotePlugin, colorPlugin, superscriptPlugin,
    headerPlugin, listPlugin, placeholderPlugin, EditorValue, codeBlockPlugin } from '@epam/uui-editor';
import { demoData } from '@epam/uui-docs';
import css from './SlateEditorBasicExample.module.scss';

type EditorFontSize = '14' | '16';
type EditorMode = 'form' | 'inline';

export default function SlateEditorBasicExample() {
    const svc = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';
    const [value, setValue] = useState<EditorValue>(demoData.slateInitialValue);
    const [isReadonly, setIsReadonly] = useState<boolean>(false);
    const [mode, setMode] = useState<EditorMode>('form');
    const [fontSize, setFontSize] = useState<EditorFontSize>('14');

    const uploadFile = (file: File): Promise<FileUploadResponse> => {
        return svc.uuiApi.uploadFile(ORIGIN.concat('/upload/uploadFileMock'), file, {})
            .catch((res) => {
                svc.uuiNotifications.show((props) =>
                    <ErrorNotification { ...props }><Text>{ res.error.message }</Text></ErrorNotification>).catch(() => {});
                return Promise.reject(res);
            });
    };

    const plugins = [
        ...defaultPlugins,
        ...baseMarksPlugin(),
        headerPlugin(),
        colorPlugin(),
        superscriptPlugin(),
        listPlugin(),
        toDoListPlugin(),
        quotePlugin(),
        linkPlugin(),
        notePlugin(),
        uploadFilePlugin({ uploadFile }),
        attachmentPlugin(),
        imagePlugin(),
        videoPlugin(),
        iframePlugin(),
        separatorPlugin(),
        tablePlugin(),
        placeholderPlugin({
            items: [
                {
                    name: 'Name',
                    field: 'name',
                }, {
                    name: 'Email',
                    field: 'email',
                },
            ],
        }),
        codeBlockPlugin(),
    ];

    return (
        <Panel cx={ css.root }>
            <FlexRow columnGap="18" vPadding="12">
                <MultiSwitch
                    items={ [{ id: '14', caption: '14' }, { id: '16', caption: '16' }] }
                    value={ fontSize }
                    onValueChange={ (v: EditorFontSize) => setFontSize(v) }
                    color="primary"
                />
                <FlexSpacer />
                <Switch value={ mode === 'inline' } onValueChange={ (val: boolean) => setMode(val ? 'inline' : 'form') } label="Inline mode" />
                <Switch value={ isReadonly } onValueChange={ setIsReadonly } label="View mode" />
            </FlexRow>

            <SlateEditor
                value={ value }
                onValueChange={ setValue }
                isReadonly={ isReadonly }
                plugins={ plugins }
                mode={ mode }
                placeholder="Add description"
                minHeight="none"
                fontSize={ fontSize }
            />
        </Panel>
    );
}
