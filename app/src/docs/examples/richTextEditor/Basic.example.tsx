import * as React from 'react';
import { Value } from 'slate';
import { Panel, FlexSpacer, FlexRow, Switch, MultiSwitch } from '@epam/promo';
import { SlateEditor, defaultPlugins, imagePlugin, videoPlugin, attachmentPlugin, toDoListPlugin, baseMarksPlugin,
    linkPlugin, iframePlugin, notePlugin, separatorPlugin, uploadFilePlugin, tablePlugin, quotePlugin, colorPlugin,
    superscriptPlugin, headerPlugin, listPlugin, placeholderPlugin } from '@epam/uui-editor';
import { svc } from '../../../services';
import { initialValue } from './state';
import * as css from './SlateEditorBasicExample.scss';


interface SlateEditorBasicExampleState {
    value: Value;
    isReadonly: boolean;
    mode: 'form' | 'inline';
    fontSize: '14' | '16';
    name: string;
}

export class SlateEditorBasicExample extends React.Component<any, SlateEditorBasicExampleState> {
    state: SlateEditorBasicExampleState = {
        value: initialValue,
        isReadonly: false,
        mode: 'form',
        fontSize: '14',
        name: '',
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
    ];

    render() {

        return (
            <Panel cx={ css.root }>
                <FlexRow spacing='18' vPadding='12'>
                    <MultiSwitch
                        items={ [{ id: '14', caption: '14' }, { id: '16', caption: '16' }] }
                        value={ this.state.fontSize }
                        onValueChange={ (val: any) => this.setState({ fontSize: val }) }
                        color='blue'
                    />
                    <FlexSpacer />
                    <Switch
                        value={ this.state.mode === 'inline' }
                        onValueChange={ (val: boolean) => this.setState({ mode: val ? 'inline' : 'form' }) }
                        label='Inline mode'
                    />
                    <Switch
                        value={ this.state.isReadonly }
                        onValueChange={ (val: boolean) => this.setState({ isReadonly: val }) }
                        label='View mode'
                    />
                </FlexRow>

                <SlateEditor
                    value={ this.state.value }
                    onValueChange={ this.onChange }
                    isReadonly={ this.state.isReadonly }
                    autoFocus={ true }
                    plugins={ this.plugins }
                    mode={ this.state.mode }
                    placeholder='Add description'
                    minHeight={ 'none' }
                    fontSize={ this.state.fontSize }
                />
            </Panel>
        );
    }
}
