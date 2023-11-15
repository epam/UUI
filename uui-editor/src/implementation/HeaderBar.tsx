import * as React from 'react';
import { PlateEditor, getBlockAbove, setElements } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { ToolbarButton } from './ToolbarButton';
import { PARAGRAPH_TYPE } from '../plugins/paragraphPlugin/paragraphPlugin';

import { ReactComponent as H1Icon } from '../icons/heading-H1.svg';
import { ReactComponent as H2Icon } from '../icons/heading-H2.svg';
import { ReactComponent as H3Icon } from '../icons/heading-H3.svg';
import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';

import css from './HeaderBar.module.scss';

interface HeaderBarProps extends DropdownBodyProps {
    editor: PlateEditor;
}

export class HeaderBar extends React.Component<HeaderBarProps> {
    toggleBlock(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, blockType: string) {
        event.preventDefault();
        const block = getBlockAbove(this.props.editor);

        if (block?.length && block[0].type === blockType) {
            setElements(this.props.editor, {
                data: {},
                type: PARAGRAPH_TYPE,
                children: [{ text: '' }],
            });
        } else {
            setElements(this.props.editor, { type: blockType });
        }
    }

    clearHeaderStyle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        setElements(this.props.editor, {
            data: {},
            type: PARAGRAPH_TYPE,
            children: [{ text: '' }],
        });
    }

    renderHeaderMenu() {
        const block = getBlockAbove(this.props.editor);

        return (
            <FlexRow cx={ css.wrapper }>
                <ToolbarButton
                    onClick={ (event) => this.clearHeaderStyle(event) }
                    icon={ ClearIcon }
                />
                <ToolbarButton
                    onClick={ (event) => this.toggleBlock(event, 'uui-richTextEditor-header-1') }
                    isActive={ block?.length && block[0].type === 'uui-richTextEditor-header-1' }
                    icon={ H1Icon }
                />
                <ToolbarButton
                    onClick={ (event) => this.toggleBlock(event, 'uui-richTextEditor-header-2') }
                    isActive={ block?.length && block[0].type === 'uui-richTextEditor-header-2' }
                    icon={ H2Icon }
                />
                <ToolbarButton
                    onClick={ (event) => this.toggleBlock(event, 'uui-richTextEditor-header-3') }
                    isActive={ block?.length && block[0].type === 'uui-richTextEditor-header-3' }
                    icon={ H3Icon }
                />
            </FlexRow>
        );
    }

    render() {
        return this.renderHeaderMenu();
    }
}
