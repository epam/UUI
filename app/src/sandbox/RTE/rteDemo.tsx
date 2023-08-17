import * as React from 'react';
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
    codeBlockPlugin,
    EditorValue,
    createSerializer,
    migrateSchema,
    isEditorValueEmpty,
} from '@epam/uui-editor';
import { svc } from '../../services';
import { FlexCell, FlexRow, Switch, PickerInput, Button } from '@epam/promo';
import { useAsyncDataSource } from '@epam/uui-core';
import { useEffect } from 'react';
import { RichTextView } from '@epam/promo';

const getPlugins = () => {
    const uploadFile = (file: File, onProgress: (progress: number) => any): any => {
        return svc.uuiApi.uploadFile('/uploadFileMock', file, {
            onProgress,
        });
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
        uploadFilePlugin({ uploadFile: uploadFile }),
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

export function RichTextEditorDemo() {
    const [value, setValue] = React.useState<EditorValue>();
    const [contentName, setContentName] = React.useState<string>();
    const [isReadonly, setIsReadonly] = React.useState<boolean>();
    const [html, setHtml] = React.useState<string>();
    const [type, setType] = React.useState<'html' | 'edit'>('edit');

    useEffect(() => {
        if (!contentName) return;
        svc.uuiApi.processRequest('/api/get-demo-doc-content', 'POST', { name: contentName }).then((res) => {
            setValue(res);
        });
    }, [contentName]);

    const plugins = React.useMemo(() => getPlugins(), []);

    const serializeHTML = React.useMemo(() => {
        return createSerializer(plugins);
    }, [plugins]);

    const contentsDataSource = useAsyncDataSource<string, string, any>({
        api: () => svc.uuiApi.processRequest('/api/get-contents-list', 'GET'),
        getId: (item: any) => {
            return item;
        },
    }, []);

    const onChange = React.useCallback((newValue: EditorValue) => {
        setValue(newValue);
    }, []);

    const toggleFunction = React.useCallback(() => {
        if (type === 'edit') {
            setHtml(serializeHTML(value));
            setType('html');
        } else {
            setType('edit');
        }
    }, [serializeHTML, type, value]);

    return (
        <div style={ { flexGrow: 1, margin: '24px' } }>
            <FlexRow spacing="12">
                <FlexCell width={ 300 }>
                    <PickerInput<string, string>
                        value={ contentName }
                        onValueChange={ setContentName }
                        dataSource={ contentsDataSource }
                        getName={ (item) => item }
                        selectionMode="single"
                    />
                </FlexCell>
                <Switch
                    isDisabled={ type === 'html' }
                    value={ isReadonly }
                    onValueChange={ setIsReadonly }
                    label="Readonly"
                />
                <Button
                    caption={ type === 'html' ? 'Edit' : 'Serialize' }
                    onClick={ toggleFunction }
                    isDisabled={ isEditorValueEmpty(migrateSchema(value)) }
                    size="30"
                />
                {/* <Button
                    caption={ 'Deserialize' }
                    onClick={ onDeserialize }
                    isDisabled={ isEditorValueEmpty(migrateSchema(value)) }
                    size="30"
                /> */}
            </FlexRow>
            <FlexCell grow={ 1 } style={ { marginTop: '12px' } }>
                {
                    type === 'html'
                        ? (
                            <RichTextView htmlContent={ html } />
                        )
                        : (
                            <SlateEditor
                                value={ value }
                                onValueChange={ onChange }
                                key={ contentName }
                                autoFocus={ true }
                                plugins={ plugins }
                                isReadonly={ isReadonly }
                                placeholder="Add description"
                                minHeight={ 300 }
                            />
                        )
                }
            </FlexCell>
        </div>
    );
}
