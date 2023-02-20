import * as React from 'react';
import { Editor } from 'slate-react';
import { DropdownBodyProps, uuiSkin } from '@epam/uui-core';
import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';
import { ReactComponent as NoteIconError } from '../icons/info-block-warning.svg';
import { ReactComponent as NoteIconWarning } from '../icons/info-block.svg';
import { ReactComponent as NoteIconLink } from '../icons/info-block-link.svg';
import { ReactComponent as NoteIconQuote } from '../icons/info-block-quote.svg';
import { ToolbarButton } from './ToolbarButton';

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
        return (
            <FlexRow rawProps={{ style: { background: '#303240' } }}>
                <ToolbarButton
                    isActive={false}
                    icon={ClearIcon}
                    onClick={() => {
                        this.props.editor.setBlocks('paragraph');
                        this.props.scheduleUpdate();
                    }}
                />
                <ToolbarButton
                    isActive={(this.props.editor as any).hasBlock(['note-quote'])}
                    icon={NoteIconQuote}
                    onClick={() => this.toggleBlock('note-quote')}
                    iconColor="gray60"
                />
                <ToolbarButton
                    isActive={(this.props.editor as any).hasBlock(['note-error'])}
                    icon={NoteIconError}
                    onClick={() => this.toggleBlock('note-error')}
                    iconColor="red"
                />
                <ToolbarButton
                    isActive={(this.props.editor as any).hasBlock(['note-warning'])}
                    icon={NoteIconWarning}
                    onClick={() => this.toggleBlock('note-warning')}
                    iconColor="amber"
                />
                <ToolbarButton
                    isActive={(this.props.editor as any).hasBlock(['note-link'])}
                    icon={NoteIconLink}
                    onClick={() => this.toggleBlock('note-link')}
                    iconColor="blue"
                />
            </FlexRow>
        );
    }

    render() {
        return this.renderHeaderMenu();
    }
}
