import { EditorState, AtomicBlockUtils } from 'draft-js';
import EditorUtils from 'draft-js-plugins-utils';
import { IconButton } from '@epam/loveship';
import * as React from 'react';
import { UuiContexts, prependHttp, UuiContext } from '@epam/uui-core';
import { DraftButtonProps } from '../../../types';
import { getSelectionText } from '../../../utils';
import { ImageModalState, showImageModal } from '../modals/ImageModal';
import { ReactComponent as PhotoIcon } from '../../../icons/insert_photo.svg';

export class ImageButton extends React.Component<DraftButtonProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    isImageSelected = () => {
        return this.props.value && EditorUtils.hasEntity(
            this.props.value,
            'IMAGE',
        );
    }

    handleClick = (src: string, alt: string, width: number, height: number) => {
        const prependedSrc = prependHttp(src, { https: true });
        const editorState = this.props.value;
        const contentState = editorState.getCurrentContent();
        let newEditorState: EditorState;

        if (this.isImageSelected()) {
            const entityKey = EditorUtils.getCurrentEntityKey(editorState);
            const contentStateWithEntity = contentState.mergeEntityData(entityKey, { alt, width, height, src: prependedSrc });
            newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
        } else {
            const contentStateWithEntity = contentState.createEntity(
                'IMAGE',
                'IMMUTABLE',
                { alt, width, height, src: prependedSrc },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            newEditorState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
                ' ',
            );
        }

        this.props.onValueChange(EditorState.forceSelection(
            newEditorState,
            newEditorState.getCurrentContent().getSelectionAfter(),
        ));
    }

    render() {
        let modalInitialState: ImageModalState;

        if (this.isImageSelected()) {
            const data = EditorUtils.getCurrentEntity(this.props.value).getData();
            modalInitialState = {
                src: data.src,
                alt: data.alt,
                width: data.width,
                height: data.height,
            };
        } else {
            modalInitialState = {
                src: '',
                alt: getSelectionText(this.props.value.getCurrentContent(), this.props.value.getSelection()),
            };
        }

        return (
            <div
                onMouseDown={ this.onMouseDown }
            >
                <IconButton
                    icon={ PhotoIcon }
                    color={ this.isImageSelected() ? 'sky' : 'night600' }
                    onClick={ () => {
                        showImageModal(this.context, modalInitialState)
                            .then(data => { this.handleClick(data.src, data.alt, data.width, data.height); })
                            .catch(() => null);
                    } }
                />
            </div>
        );
    }
}