import * as React from 'react';
import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as H1Icon } from "../icons/heading-H1.svg";
import { ReactComponent as H2Icon } from "../icons/heading-H2.svg";
import { ReactComponent as H3Icon } from "../icons/heading-H3.svg";
import { ToolbarButton } from './ToolbarButton';
import {DropdownBodyProps } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui-core";

import {
    setElements,
    ToolbarButton as PlateToolbarButton,
    getBlockAbove,
    PlateEditor,
} from '@udecode/plate';

const { FlexRow } = uuiSkin;

interface HeaderBarProps extends DropdownBodyProps {
    editor: PlateEditor;
}
const noop = () => {};

export class HeaderBar extends React.Component<HeaderBarProps> {

    toggleBlock(blockType: string) {
        const block = getBlockAbove(this.props.editor);

        if (block.length && block[0].type === blockType) {
            setElements(this.props.editor, { type: 'paragraph' });
        } else {
            setElements(this.props.editor, { type: blockType });
        }
    }

    clearHeaderStyle = () => {
        setElements(this.props.editor, { type: 'paragraph' });
    }

    renderHeaderMenu() {
        const block = getBlockAbove(this.props.editor);

        return <FlexRow rawProps={ { style: { background: '#303240' }} }>
            <ToolbarButton
                isActive={ false }
                icon={ ClearIcon }
                onClick={ this.clearHeaderStyle }
            />
            <PlateToolbarButton
                styles={ { root: { width: 'auto', cursor: 'pointer' }} }
                onMouseDown={ () => this.toggleBlock('uui-richTextEditor-header-1') }
                icon={ <ToolbarButton
                    onClick={ noop }
                    isActive={ block.length && block[0].type === 'uui-richTextEditor-header-1' }
                    icon={ H1Icon }
                /> }
            />
            <PlateToolbarButton
                styles={ { root: { width: 'auto', cursor: 'pointer' }} }
                onMouseDown={ () => this.toggleBlock('uui-richTextEditor-header-2') }
                icon={ <ToolbarButton
                    onClick={ noop }
                    isActive={ block.length && block[0].type === 'uui-richTextEditor-header-2' }
                    icon={ H2Icon }
                /> }
            />
            <PlateToolbarButton
                styles={ { root: { width: 'auto', cursor: 'pointer' }} }
                onMouseDown={ () => this.toggleBlock('uui-richTextEditor-header-3') }
                icon={ <ToolbarButton
                    onClick={ noop }
                    isActive={ block.length && block[0].type === 'uui-richTextEditor-header-3' }
                    icon={ H3Icon }
                /> }
            />
        </FlexRow>;
    }

    render() {

        return this.renderHeaderMenu();
    }
}