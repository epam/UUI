import * as React from 'react';
import * as clearIcon from "../icons/text-color-default.svg";
import * as h1Icon from "../icons/heading-H1.svg";
import * as h2Icon from "../icons/heading-H2.svg";
import * as h3Icon from "../icons/heading-H3.svg";
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
            <ToolbarButton isActive={ false } icon={ clearIcon } onClick={ this.clearHeaderStyle } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['uui-richTextEditor-header-1']) } icon={ h1Icon } onClick={ () => this.toggleBlock('uui-richTextEditor-header-1') } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['uui-richTextEditor-header-2']) } icon={ h2Icon } onClick={ () => this.toggleBlock('uui-richTextEditor-header-2') } />
            <ToolbarButton isActive={ (this.props.editor as any).hasBlock(['uui-richTextEditor-header-3']) } icon={ h3Icon } onClick={ () => this.toggleBlock('uui-richTextEditor-header-3') } />
        </FlexRow>;
    }

    render() {

        return this.renderHeaderMenu();
    }
}