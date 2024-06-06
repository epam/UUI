import * as React from 'react';
import { PlateEditor, getBlockAbove, setElements } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { ToolbarButton } from './ToolbarButton';

import { ReactComponent as H1Icon } from '../icons/heading-H1.svg';
import { ReactComponent as H2Icon } from '../icons/heading-H2.svg';
import { ReactComponent as H3Icon } from '../icons/heading-H3.svg';
import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';

import css from './HeaderBar.module.scss';
import { HEADER_TYPE_H1, HEADER_TYPE_H2, HEADER_TYPE_H3 } from '../plugins/headerPlugin';
import { PARAGRAPH_TYPE } from '../plugins/paragraphPlugin';

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
                    onClick={ (event) => this.toggleBlock(event, HEADER_TYPE_H1) }
                    isActive={ block?.length && block[0].type === HEADER_TYPE_H1 }
                    icon={ H1Icon }
                />
                <ToolbarButton
                    onClick={ (event) => this.toggleBlock(event, HEADER_TYPE_H2) }
                    isActive={ block?.length && block[0].type === HEADER_TYPE_H2 }
                    icon={ H2Icon }
                />
                <ToolbarButton
                    onClick={ (event) => this.toggleBlock(event, HEADER_TYPE_H3) }
                    isActive={ block?.length && block[0].type === HEADER_TYPE_H3 }
                    icon={ H3Icon }
                />
            </FlexRow>
        );
    }

    render() {
        return this.renderHeaderMenu();
    }
}
