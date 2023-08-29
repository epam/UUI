import React, { Fragment, useState } from 'react';
import {
    CommonContexts,
    FileUploadResponse,
    useUuiContext,
} from '@epam/uui-core';
import { Panel, FlexRow, Button, RichTextView } from '@epam/promo';
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
    EditorValue,
    codeBlockPlugin,
    createSerializer,
    isEditorValueEmpty,
    migrateSchema,
    createDeserializer,
} from '@epam/uui-editor';
import { demoData } from '@epam/uui-docs';
import css from './SlateEditorBasicExample.module.scss';

const ORIGIN = process.env.REACT_APP_PUBLIC_URL || '';

const getAllPlugins = (svc: CommonContexts<any, any>) => {
    const uploadFile = (
        file: File,
        onProgress: (progress: number) => unknown,
    ): Promise<FileUploadResponse> => {
        return svc.uuiApi.uploadFile(
            ORIGIN.concat('/upload/uploadFileMock'),
            file,
            {
                onProgress,
            },
        );
    };

    return [
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
        codeBlockPlugin(),
    ];
};

const serializeHTML = createSerializer();
const deserializeHTML = createDeserializer();

export default function SlateEditorBasicExample() {
    const svc = useUuiContext();
    const [value, setValue] = useState<EditorValue>(demoData.slateInitialValue);

    const [html, setHtml] = React.useState<string>();
    const [type, setType] = React.useState<'html' | 'edit'>('edit');

    const onSerialize = React.useCallback(() => {
        const migratedValue = migrateSchema(value); // TODO: use migration on data receive only
        console.log('value', value, 'migratedValue', migratedValue);
        setHtml(serializeHTML(migratedValue));
        setType('html');
    }, [value]);

    const onBackToEdit = React.useCallback(() => setType('edit'), []);

    const onDeserialize = React.useCallback(() => {
        const deserialized = deserializeHTML(html);
        setValue(deserialized as any); // TODO: improve typing here
        setType('edit');
    }, [html]);

    return (
        <Panel cx={ css.root }>
            <FlexRow spacing="18" vPadding="12">
                {type === 'edit' && (
                    <Button
                        caption="Serialize"
                        onClick={ onSerialize }
                        isDisabled={ isEditorValueEmpty(migrateSchema(value)) }
                        size="30"
                    />
                )}
                {type === 'html' && (
                    <Fragment>
                        <Button
                            caption="Back to edit"
                            onClick={ onBackToEdit }
                            isDisabled={ html === '' }
                            size="30"
                        />
                        <Button
                            caption="Deserialize and edit"
                            onClick={ onDeserialize }
                            isDisabled={ html === '' }
                            size="30"
                        />
                    </Fragment>
                )}

            </FlexRow>
            {
                type === 'html'
                    ? (
                        <RichTextView htmlContent={ html } />
                    )
                    : (
                        <SlateEditor
                            value={ value }
                            onValueChange={ setValue }
                            isReadonly={ false }
                            plugins={ getAllPlugins(svc) }
                            mode="form"
                            placeholder="Add description"
                            minHeight="none"
                            fontSize="14"
                        />
                    )
            }
        </Panel>
    );
}
