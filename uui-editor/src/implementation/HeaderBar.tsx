import * as React from 'react';
import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as H1Icon } from "../icons/heading-H1.svg";
import { ReactComponent as H2Icon } from "../icons/heading-H2.svg";
import { ReactComponent as H3Icon } from "../icons/heading-H3.svg";
import { ToolbarButton } from './ToolbarButton';
import { Editor } from 'slate-react';
import {DropdownBodyProps } from '@epam/uui-components';
import { uuiSkin } from "@epam/uui";

const { FlexRow } = uuiSkin;

interface HeaderBarProps extends DropdownBodyProps {
    editor: Editor;
}

export const headerBlocks = ['uui-richTextEditor-header-1', 'uui-richTextEditor-header-2', 'uui-richTextEditor-header-3', 'uui-richTextEditor-header-4', 'uui-richTextEditor-header-5', 'uui-richTextEditor-header-6'];

export class HeaderBar extends React.Component<HeaderBarProps> {
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

    clearHeaderStyle = () => {
        this.props.editor.setBlocks('paragraph'); this.props.scheduleUpdate();
    }

    renderHeaderMenu() {
        return <FlexRow rawProps={ {style: { background: '#303240' }} }>
            <ToolbarButton isActive={ false } icon={ ClearIcon } onClick={ this.clearHeaderStyle } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['uui-richTextEditor-header-1']) } icon={ H1Icon } onClick={ () => this.toggleBlock('uui-richTextEditor-header-1') } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['uui-richTextEditor-header-2']) } icon={ H2Icon } onClick={ () => this.toggleBlock('uui-richTextEditor-header-2') } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['uui-richTextEditor-header-3']) } icon={ H3Icon } onClick={ () => this.toggleBlock('uui-richTextEditor-header-3') } />
        </FlexRow>;
    }

    render() {

        return this.renderHeaderMenu();
    }
}