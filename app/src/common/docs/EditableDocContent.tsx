import * as React from 'react';
import { Value } from 'slate';
import { IEditableDebouncer } from '@epam/uui';
import { Blocker } from '@epam/loveship';
import { SlateEditor, basePlugins, uploadFilePlugin, toDoListPlugin, attachmentPlugin, imagePlugin, videoPlugin,
    linkPlugin, iframePlugin, notePlugin, separatorPlugin, headerPlugin, colorPlugin, superscriptPlugin, listPlugin,
    quotePlugin, tablePlugin } from '@epam/uui-editor';
import { svc } from '../../services';
import * as css from './EditableDocContent.scss';

export interface EditableDocContentProps {
    fileName: string;
}

interface EditableDocContentState {
    content: Value;
    isLoading: boolean;
}

const plugins = [
    ...basePlugins,
    headerPlugin(),
    colorPlugin(),
    superscriptPlugin(),
    listPlugin(),
    toDoListPlugin(),
    linkPlugin(),
    quotePlugin(),
    attachmentPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    notePlugin(),
    separatorPlugin(),
    tablePlugin(),
];

export class EditableDocContent extends React.Component<EditableDocContentProps, EditableDocContentState> {
    state: EditableDocContentState = {
        content: null,
        isLoading: true,
    };

    constructor(props: EditableDocContentProps) {
        super(props);
        svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: props.fileName })
            .then(res => this.setState({ content: res.content && Value.fromJSON(res.content), isLoading: !this.state.isLoading }));
    }

    saveDocContent = (content: Value) => {
        this.setState({ content: content });
        svc.uuiApi.processRequest('/api/save-doc-content', 'POST', {
            name: this.props.fileName,
            content: content.toJSON(),
        });
    }

    render() {
        const { isLoading } = this.state;

        return (
            <div className={ css.wrapper } >
                <IEditableDebouncer
                    value={ this.state.content }
                    onValueChange={ this.saveDocContent }
                    render={ (props) => <SlateEditor
                        placeholder='Please type'
                        plugins={ plugins }
                        cx={ css.container }
                        mode='inline'
                        isReadonly={ !window.location.host.includes('localhost') }
                        minHeight={ 36 }
                        fontSize="16"
                        { ...props }
                    /> }
                />
                <Blocker isEnabled={ isLoading } />
            </div>

        ) ;
    }
}
