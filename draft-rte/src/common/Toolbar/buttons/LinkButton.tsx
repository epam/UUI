import { EditorState, Modifier, SelectionState, ContentState } from 'draft-js';
import EditorUtils from 'draft-js-plugins-utils';
import { IconButton } from '@epam/loveship';
import * as React from 'react';
import { UuiContexts, UuiContext, prependHttp } from '@epam/uui-core';
import { ReactComponent as LinkIcon } from '../../../icons/insert_link.svg';
import { DraftButtonProps } from '../../../types';
import { getEntityRange, getSelectionText } from '../../../utils';
import { LinkModalState, showLinkModal } from '../modals/LinkModal';

export class LinkButton extends React.Component<DraftButtonProps> {

    static contextType = UuiContext;
    context: UuiContexts;

    onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    isLinkSelected = () => {
        return this.props.value && EditorUtils.hasEntity(
            this.props.value,
            'LINK',
        );
    }

    handleClick = (href: string, displayText: string, isRemove: boolean = false) => {
        if (isRemove) {
            this.props.onValueChange(EditorUtils.removeLinkAtSelection(this.props.value));
            return;
        }
        const prependedHref = prependHttp(href, { https: false });
        const selection = this.props.value.getSelection();
        const contentState = this.props.value.getCurrentContent();
        let newEditorState: EditorState;
        if (this.isLinkSelected()) {
            const entityKey = EditorUtils.getCurrentEntityKey(this.props.value);
            const anchorBlockKey = selection.getAnchorKey();
            const entityRange = getEntityRange(this.props.value);
            const linkSelection = SelectionState.createEmpty(anchorBlockKey).merge({
                anchorOffset: entityRange.startOffset,
                focusOffset: entityRange.endOffset,
            });
            const contentStateWithLink = contentState.mergeEntityData(entityKey, { displayText, href: prependedHref });
            const newContentState = Modifier.replaceText(contentStateWithLink, linkSelection as SelectionState, displayText, undefined, entityKey);
            newEditorState = EditorState.set(this.props.value, { currentContent: newContentState });
        } else {
            const contentStateWithEntity = contentState.createEntity('LINK', 'IMMUTABLE', { displayText, href: prependedHref });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            let contentStateWithLink: ContentState;

            if (selection.getAnchorOffset() === selection.getFocusOffset()) {
                const contentStateWithText = Modifier.insertText(contentState, selection, displayText, undefined, entityKey);
                contentStateWithLink = Modifier.applyEntity(contentStateWithText, selection, entityKey);
            } else {
                contentStateWithLink = Modifier.applyEntity(contentStateWithEntity, selection, entityKey);
            }
            newEditorState = EditorState.set(this.props.value, { currentContent: contentStateWithLink });
        }
        this.props.onValueChange(newEditorState);
    }

    render() {
        let modalInitialState: LinkModalState;

        if (this.isLinkSelected()) {
            const data = EditorUtils.getCurrentEntity(this.props.value).getData();
            modalInitialState = {
                href: data.href,
                displayText: data.displayText,
                isLinkSelected: !!this.isLinkSelected(),
            };
        } else {
            modalInitialState = {
                href: '',
                displayText: getSelectionText(this.props.value.getCurrentContent(), this.props.value.getSelection()),
                isLinkSelected: !!this.isLinkSelected(),
            };
        }

        return (
            <div
                onMouseDown={ this.onMouseDown }
            >
                <IconButton
                    color={ this.isLinkSelected() ? 'sky' : 'night600' }
                    onClick={ () => {
                        showLinkModal(this.context, modalInitialState)
                            .then(data => { this.handleClick(data.href, data.displayText, data.isRemove); })
                            .catch(() => null);
                    } }
                    icon={ LinkIcon }
                />
            </div>
        );
    }
}
