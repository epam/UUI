import React, { createRef, RefObject } from 'react';
import { IEditableDebouncer } from '@epam/uui-core';
import { Blocker } from '@epam/uui';
import { SlateEditor, toDoListPlugin, imagePlugin, videoPlugin, linkPlugin, iframePlugin,
    notePlugin, separatorPlugin, headerPlugin, colorPlugin, superscriptPlugin, listPlugin, quotePlugin, tablePlugin,
    codeBlockPlugin, EditorValue, baseMarksPlugin, defaultPlugins,
} from '@epam/uui-editor';
import { svc } from '../../services';
import css from './EditableDocContent.module.scss';
import { typeRefRTEPlugin } from '../apiReference/typeRefRTEPlugin';
import { FlexRow, IconButton } from '@epam/uui';
import { ReactComponent as AnchorIcon } from '@epam/assets/icons/common/action-external_link-18.svg';

export interface EditableDocContentProps {
    fileName: string;
    title?: string;
    id?: string;
}

interface EditableDocContentState {
    content: EditorValue;
    isLoading: boolean;
}

export class EditableDocContent extends React.Component<EditableDocContentProps, EditableDocContentState> {
    titleRef: RefObject<HTMLHeadingElement> = createRef();
    abortController: AbortController;

    state: EditableDocContentState = {
        content: null,
        isLoading: true,
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
        linkPlugin(),
        quotePlugin(),
        imagePlugin(),
        videoPlugin(),
        iframePlugin(),
        notePlugin(),
        separatorPlugin(),
        tablePlugin(),
        codeBlockPlugin(),
        typeRefRTEPlugin(),
    ];

    private scrollToView() {
        if (this.titleRef?.current && window.location?.hash?.includes(this.titleRef.current.id)) {
            this.titleRef.current.scrollIntoView(true);
        }
    }

    componentDidMount() {
        this.abortController = new AbortController();
        svc.uuiApi.processRequest(
            '/api/get-doc-content',
            'POST',
            { name: this.props.fileName },
            { fetchOptions: { signal: this.abortController.signal } },
        )
            .then((res) => {
                this.setState((prevState) => ({
                    content: res.content,
                    isLoading: !prevState.isLoading,
                }));
                this.scrollToView();
            }).catch(() => {});
    }

    componentWillUnmount(): void {
        if (!this.abortController.signal.aborted) {
            this.abortController.abort();
        }
    }

    saveDocContent = (content: any) => {
        this.setState({ content: content });
        svc.uuiApi.processRequest('/api/save-doc-content', 'POST', {
            name: this.props.fileName,
            content: content,
        });
    };

    render() {
        const { isLoading } = this.state;
        const titleId = this.props.id || this.props.title?.split(' ').join('_').toLowerCase();

        return (
            <article className={ css.wrapper }>
                {this.props.title && (
                    <FlexRow columnGap="6" cx={ css.titleRow }>
                        <h3
                            id={ titleId }
                            className={ css.title }
                            ref={ this.titleRef }
                        >
                            {this.props.title}
                        </h3>
                        <IconButton
                            cx={ css.anchor }
                            icon={ AnchorIcon }
                            color="primary"
                            href={ `#${titleId}` }
                            aria-label={ `Link to ${this.props.title} section` }
                        />
                    </FlexRow>
                )}
                <IEditableDebouncer
                    value={ this.state.content }
                    onValueChange={ this.saveDocContent }
                    render={ (props) => (
                        <SlateEditor
                            placeholder="Please type"
                            plugins={ this.plugins }
                            cx={ css.container }
                            mode="inline"
                            isReadonly={ !window.location.host.includes('localhost') }
                            minHeight={ 36 }
                            fontSize="16"
                            { ...props }
                        />
                    ) }
                />
                <Blocker isEnabled={ isLoading } />
            </article>
        );
    }
}
