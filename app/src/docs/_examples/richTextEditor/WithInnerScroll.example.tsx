import React, { useState } from 'react';
import { FileUploadResponse, useUuiContext } from '@epam/uui-core';
import { ErrorNotification, FlexRow } from '@epam/promo';
import { SlateEditor, defaultPlugins, imagePlugin, videoPlugin, attachmentPlugin, toDoListPlugin, baseMarksPlugin,
    linkPlugin, iframePlugin, notePlugin, separatorPlugin, uploadFilePlugin, tablePlugin, quotePlugin, colorPlugin,
    superscriptPlugin, headerPlugin, listPlugin, placeholderPlugin, EditorValue, codeBlockPlugin,
} from '@epam/uui-editor';
import { demoData } from '@epam/uui-docs';
import { Text } from '@epam/uui';

export default function WithInnerScrollExample() {
    const svc = useUuiContext();
    const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';
    const [value, setValue] = useState<EditorValue>(demoData.slateInitialValue);

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
                },
                {
                    name: 'Email',
                    field: 'email',
                },
            ],
        }),
        codeBlockPlugin(),
    ];

    return (
        <FlexRow rawProps={ { style: { width: '100%', height: '350px' } } }>
            <SlateEditor
                value={ value }
                onValueChange={ setValue }
                isReadonly={ false }
                plugins={ plugins }
                mode="form"
                placeholder="Add description"
                minHeight="none"
                fontSize="14"
                scrollbars
            />
        </FlexRow>
    );
}
