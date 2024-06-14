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
import { demoData } from '@epam/uui-docs';
import css from './RichTextEditorDemo.module.scss';

interface SlateEditorBasicExampleState {
    value: EditorValue;
}

export class RichTextEditorDemo extends React.Component<any, SlateEditorBasicExampleState> {
    state: SlateEditorBasicExampleState = {
        value: demoData.slateInitialValue,
    };

    onChange = (value: EditorValue) => {
        this.setState({ value: value });
    };

    uploadFile = (file: File, onProgress: (progress: number) => any): any => {
        return svc.uuiApi.uploadFile('/upload/uploadFileMock', file, {
            onProgress,
        });
    };

    plugins = [
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
        uploadFilePlugin({ uploadFile: this.uploadFile.bind(this) }),
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

    render() {
        return (
            <div className={ css.container }>
                <SlateEditor
                    value={ this.state.value }
                    onValueChange={ this.onChange }
                    autoFocus={ true }
                    plugins={ this.plugins }
                    placeholder="Add description"
                    minHeight="none"
                />
            </div>
        );
    }
}
