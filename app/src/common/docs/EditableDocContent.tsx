import * as React from 'react';
import { Descendant } from 'slate';
import { IEditableDebouncer } from '@epam/uui';
import { Blocker } from '@epam/loveship';
import {
    SlateEditor,
    basePlugins,
    // toDoListPlugin,
    // attachmentPlugin,
    // imagePlugin,
    // videoPlugin,
    // linkPlugin,
    // iframePlugin,
    // notePlugin,
    // separatorPlugin,
    // headerPlugin,
    // colorPlugin,
    // superscriptPlugin,
    // listPlugin,
    // quotePlugin,
    // tablePlugin,
    // codeBlockPlugin,
} from "@epam/uui-editor";
import { svc } from '../../services';
import * as css from './EditableDocContent.scss';

export interface EditableDocContentProps {
    fileName: string;
}

interface EditableDocContentState {
    content: Descendant;
    isLoading: boolean;
}

const plugins = [
    ...basePlugins,
    // headerPlugin(),
    // colorPlugin(),
    // superscriptPlugin(),
    // listPlugin(),
    // toDoListPlugin(),
    // linkPlugin(),
    // quotePlugin(),
    // attachmentPlugin(),
    // imagePlugin(),
    // videoPlugin(),
    // iframePlugin(),
    // notePlugin(),
    // separatorPlugin(),
    // tablePlugin(),
    // codeBlockPlugin(),
];

export class EditableDocContent extends React.Component<EditableDocContentProps, EditableDocContentState> {
    state: EditableDocContentState = {
        content: null,
        isLoading: true,
    };

    componentDidMount() {
        svc.uuiApi.processRequest('/api/get-doc-content', 'POST', { name: this.props.fileName })
            .then(res => this.setState({ content: res.content && res.content, isLoading: !this.state.isLoading }));
    }

    saveDocContent = (content: any) => {
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
                    render={ (props) => <SlateEditor /> }
                />
                <Blocker isEnabled={ isLoading } />
            </div>

        ) ;
    }
}
