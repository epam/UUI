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
} from '@epam/uui-editor';
import { svc } from '../../services';
import { FlexCell, FlexRow, Switch, PickerInput } from '@epam/promo';
import { useAsyncDataSource } from '@epam/uui-core';
import { useEffect } from 'react';

export function RichTextEditorDemo() {
    const [value, setValue] = React.useState<EditorValue>();
    const [contentName, setContentName] = React.useState<string>();
    const [isReadonly, setIsReadonly] = React.useState<boolean>();

    const onChange = (newValue: EditorValue) => {
        setValue(newValue);
    };

    const uploadFile = (file: File, onProgress: (progress: number) => any): any => {
        return svc.uuiApi.uploadFile('/uploadFileMock', file, {
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

    const contentsDataSource = useAsyncDataSource<string, string, any>({
        api: () => svc.uuiApi.processRequest('/api/get-contents-list', 'GET'),
        getId: (item: any) => {
            return item;
        },
    }, []);

    useEffect(() => {
        if (!contentName) return;
        svc.uuiApi.processRequest('/api/get-demo-doc-content', 'POST', { name: contentName }).then((res) => {
            setValue(res);
        });
    }, [contentName]);

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
                <Switch value={ isReadonly } onValueChange={ setIsReadonly } label="Readonly" />
            </FlexRow>
            <FlexCell grow={ 1 } style={ { marginTop: '12px' } }>
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
            </FlexCell>
        </div>
    );
}
