import React, { useState } from 'react';
import { Value } from 'slate';
import { useUuiContext } from '@epam/uui-core';
import {
    Panel, FlexSpacer, FlexRow, Switch, MultiSwitch,
} from '@epam/promo';
import {
    SlateEditor,
    defaultPlugins,
    imagePlugin,
    videoPlugin,
    attachmentPlugin,
    toDoListPlugin,
    baseMarksPlugin,
    linkPlugin,
    iframePlugin,
    notePlugin,
    separatorPlugin,
    uploadFilePlugin,
    tablePlugin,
    quotePlugin,
    colorPlugin,
    superscriptPlugin,
    headerPlugin,
    listPlugin,
    placeholderPlugin,
} from '@epam/uui-editor';
import { demoData } from '@epam/uui-docs';
import css from './SlateEditorBasicExample.scss';

type EditorFontSize = '14' | '16';
type EditorMode = 'form' | 'inline';

export default function SlateEditorBasicExample() {
    const svc = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';
    const [value, setValue] = useState<Value>(Value.fromJSON(demoData.slateInitialValue));
    const [isReadonly, setIsReadonly] = useState<boolean>(false);
    const [mode, setMode] = useState<EditorMode>('form');
    const [fontSize, setFontSize] = useState<EditorFontSize>('14');

    const uploadFile = (file: File, onProgress: (progress: number) => unknown): unknown => {
        return svc.uuiApi.uploadFile(ORIGIN.concat('/uploadFileMock'), file, {
            onProgress,
        });
    };

    const plugins = [
        ...defaultPlugins,
        baseMarksPlugin(),
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
                },
                {
                    name: 'Email',
                    field: 'email',
                },
            ],
        }),
    ];

    return (
        <Panel cx={ css.root }>
            <FlexRow spacing="18" vPadding="12">
                <MultiSwitch
                    items={ [{ id: '14', caption: '14' }, { id: '16', caption: '16' }] }
                    value={ fontSize }
                    onValueChange={ (value: EditorFontSize) => setFontSize(value) }
                    color="blue"
                />
                <FlexSpacer />
                <Switch value={ mode === 'inline' } onValueChange={ (val: boolean) => setMode(val ? 'inline' : 'form') } label="Inline mode" />
                <Switch value={ isReadonly } onValueChange={ setIsReadonly } label="View mode" />
            </FlexRow>

            <SlateEditor
                value={ value }
                onValueChange={ setValue }
                isReadonly={ isReadonly }
                autoFocus={ true }
                plugins={ plugins }
                mode={ mode }
                placeholder="Add description"
                minHeight="none"
                fontSize={ fontSize }
            />
        </Panel>
    );
}
