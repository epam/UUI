import * as React from 'react';
import { Value } from 'slate';
import { cx, IEditableDebouncer } from '@epam/uui';
import { Blocker } from '@epam/loveship';
import { SlateEditor, basePlugins, toDoListPlugin, attachmentPlugin, imagePlugin, videoPlugin, linkPlugin, iframePlugin, notePlugin, separatorPlugin, headerPlugin, colorPlugin, superscriptPlugin, listPlugin, quotePlugin, tablePlugin, codeBlockPlugin,
} from "@epam/uui-editor";
import { svc } from '../../services';
import * as css from './EditableDocContent.scss';

export interface EditableDocContentProps {
    fileName: string;
    isWidthByContainer?: boolean;
    minHeight?: number | 'none';
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
    codeBlockPlugin(),
];

export class EditableDocContent extends React.Component<EditableDocContentProps, EditableDocContentState> {
    state: EditableDocContentState = {
        content: null,
        isLoading: true,
    };

    componentDidMount() {
        svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: this.props.fileName })
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
        const { isWidthByContainer, minHeight = 36 } = this.props;
        const { isLoading } = this.state;
        const widthByContainerModifier = isWidthByContainer ? css.widthByContainer : undefined;
        return (
            <div className={ cx(css.wrapper, widthByContainerModifier) } >
                <IEditableDebouncer
                    value={ this.state.content }
                    onValueChange={ this.saveDocContent }
                    render={ (props) => <SlateEditor
                        placeholder='Please type'
                        plugins={ plugins }
                        cx={ css.container }
                        mode='inline'
                        isReadonly={ !window.location.host.includes('localhost') }
                        minHeight={ minHeight }
                        fontSize="16"
                        { ...props }
                    /> }
                />
                <Blocker isEnabled={ isLoading } />
            </div>

        ) ;
    }
}
