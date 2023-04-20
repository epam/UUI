import React, { useState } from 'react';
import { Value } from 'slate';
import { useUuiContext } from '@epam/uui-core';
import { Panel } from '@epam/promo';
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

export default function WithInnerScrollExample() {
    const svc = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';
    const [value, setValue] = useState<Value>(Value.fromJSON(demoData.slateInitialValue));

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
        <Panel rawProps={ { style: { height: '350px' } } }>
            <SlateEditor
                value={ value }
                onValueChange={ setValue }
                isReadonly={ false }
                autoFocus={ true }
                plugins={ plugins }
                mode="form"
                placeholder="Add description"
                minHeight="none"
                fontSize="16"
                scrollbars
            />
        </Panel>
    );
}
