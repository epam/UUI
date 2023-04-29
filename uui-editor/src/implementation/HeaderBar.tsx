import * as React from 'react';
import { DropdownBodyProps, uuiSkin } from "@epam/uui-core";

import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as H1Icon } from "../icons/heading-H1.svg";
import { ReactComponent as H2Icon } from "../icons/heading-H2.svg";
import { ReactComponent as H3Icon } from "../icons/heading-H3.svg";

import { ToolbarButton } from './ToolbarButton';

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
            setElements(this.props.editor, {
                data: {},
                type: "p",
                children: [{ "text": "" }],
            });
        } else {
            setElements(this.props.editor, { type: blockType });
        }
    }

    clearHeaderStyle() {
        setElements(this.props.editor, {
            data: {},
            type: "p",
            children: [{ "text": "" }],
        });
    }

    renderHeaderMenu() {
        const block = getBlockAbove(this.props.editor);

        return (
            <FlexRow rawProps={ { style: { height: 42, background: '#303240' } } }>
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: '100%', padding: 0, cursor: 'pointer' } } }
                    onMouseDown={ () => this.clearHeaderStyle() }
                    icon={
                        <ToolbarButton
                            onClick={ noop }
                            isActive={ block.length && block[0].type === 'uui-richTextEditor-header-1' }
                            icon={ ClearIcon }
                        />
                    }
                />
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: '100%', padding: 0, cursor: 'pointer' } } }
                    onMouseDown={ () => this.toggleBlock('uui-richTextEditor-header-1') }
                    icon={
                        <ToolbarButton
                            onClick={ noop }
                            isActive={ block.length && block[0].type === 'uui-richTextEditor-header-1' }
                            icon={ H1Icon }
                        />
                    }
                />
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: '100%', padding: 0, cursor: 'pointer' } } }
                    onMouseDown={ () => this.toggleBlock('uui-richTextEditor-header-2') }
                    icon={
                        <ToolbarButton
                            onClick={ noop }
                            isActive={ block.length && block[0].type === 'uui-richTextEditor-header-2' }
                            icon={ H2Icon }
                        />
                    }
                />
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', height: '100%', padding: 0, cursor: 'pointer' } } }
                    onMouseDown={ () => this.toggleBlock('uui-richTextEditor-header-3') }
                    icon={
                        <ToolbarButton
                            onClick={ noop }
                            isActive={ block.length && block[0].type === 'uui-richTextEditor-header-3' }
                            icon={ H3Icon }
                        />
                    }
                />
            </FlexRow>
        );
    }

    render() {

        return this.renderHeaderMenu();
    }
}