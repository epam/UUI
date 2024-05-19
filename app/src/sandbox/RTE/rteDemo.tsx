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
import cx from 'classnames';
import css from './rteDemo.module.scss';

const getPlugins = () => {
    const uploadFile = (file: File, onProgress: (progress: number) => any): any => {
        return svc.uuiApi.uploadFile('/upload/uploadFileMock', file, {
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

    useEffect(() => {
        if (!contentName) return;
        svc.uuiApi.processRequest('/api/get-demo-doc-content', 'POST', { name: contentName }).then((res) => {
            setValue(res);
        });
    }, [contentName]);

    const contentsDataSource = useAsyncDataSource<string, string, any>({
        api: () => svc.uuiApi.processRequest('/api/get-contents-list', 'GET'),
        getId: (item: any) => {
            return item;
        },
    }, []);

    const onChange = React.useCallback((newValue: EditorValue) => {
        setValue(newValue);
    }, []);

    return (
        <div className={ cx(css.wrapper, css.uuiThemePromo) }>
            <FlexRow columnGap="12">
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
                    value={ isReadonly }
                    onValueChange={ setIsReadonly }
                    label="Readonly"
                />
            </FlexRow>
            <FlexCell grow={ 1 } style={ { marginTop: '12px' } }>
                <SlateEditor
                    // key={ contentName }
                    value={ value }
                    onValueChange={ onChange }
                    autoFocus={ true }
                    plugins={ getPlugins() }
                    isReadonly={ isReadonly }
                    placeholder="Add description"
                    minHeight={ 300 }
                />
            </FlexCell>
        </div>
    );
}
