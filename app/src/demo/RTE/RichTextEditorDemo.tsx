import * as React from 'react';
import { Value } from 'slate';
import { SlateEditor, defaultPlugins, imagePlugin, videoPlugin, attachmentPlugin, toDoListPlugin, baseMarksPlugin,
    linkPlugin, iframePlugin, notePlugin, separatorPlugin, uploadFilePlugin, tablePlugin, quotePlugin, colorPlugin,
    superscriptPlugin, headerPlugin, listPlugin, placeholderPlugin, codeBlockPlugin,
} from "@epam/uui-editor";
import { svc } from '../../services';
import { initialValue } from './state';
import * as css from './RichTextEditorDemo.scss';


interface SlateEditorBasicExampleState {
    value: Value;
}

export class RichTextEditorDemo extends React.Component<any, SlateEditorBasicExampleState> {
    state: SlateEditorBasicExampleState = {
        value: Value.fromJSON(initialValue),
    };

    onChange = (value: Value) => {
        this.setState({ value: value });
    }

    uploadFile = (file: File, onProgress: (progress: number) => any): any => {
        return svc.uuiApi.uploadFile('/uploadFileMock', file, {
            onProgress,
        });
    }

    plugins = [
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
        uploadFilePlugin({
            uploadFile: this.uploadFile,
        }),
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
                    placeholder='Add description'
                    minHeight={ 'none' }
                />
            </div>
        );
    }
}