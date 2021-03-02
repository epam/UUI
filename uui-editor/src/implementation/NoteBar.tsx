import * as React from 'react';
import * as clearIcon from "../icons/text-color-default.svg";
import * as noteIconError from "../icons/info-block-warning.svg";
import * as noteIconWarning from "../icons/info-block.svg";
import * as noteIconLink from "../icons/info-block-link.svg";
import * as noteIconQuote from "../icons/info-block-quote.svg";
import { ToolbarButton } from './ToolbarButton';
import { Editor } from 'slate-react';
import {DropdownBodyProps } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui";

const { FlexRow } = uuiSkin;

interface NoteBarProps extends DropdownBodyProps {
    editor: Editor;
}

export const noteBlocks = ['note-error', 'note-warning', 'note-link', 'note-quote'];

export class NoteBar extends React.Component<NoteBarProps> {
    state: any = {
        isActive: false,
    };

    toggleBlock(blockType: string) {
        this.props.scheduleUpdate();

        if ((this.props.editor as any).hasBlock([blockType])) {
            this.props.editor.setBlocks('paragraph');
        } else {
            this.props.editor.setBlocks(blockType);
        }

    }

    renderHeaderMenu() {
        return <FlexRow rawProps={ { style: { background: '#303240' } } }>
            <ToolbarButton isActive={ false } icon={ clearIcon } onClick={ () => { this.props.editor.setBlocks('paragraph'); this.props.scheduleUpdate(); } } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['note-quote']) } icon={ noteIconQuote } onClick={ () => this.toggleBlock('note-quote') } iconColor='gray60'/>
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['note-error']) } icon={ noteIconError } onClick={ () => this.toggleBlock('note-error') } iconColor='red'/>
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['note-warning']) } icon={ noteIconWarning } onClick={ () => this.toggleBlock('note-warning') } iconColor='amber'/>
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['note-link']) } icon={ noteIconLink } onClick={ () => this.toggleBlock('note-link') } iconColor='blue'/>
        </FlexRow>;
    }

    render() {

        return this.renderHeaderMenu();
    }
}