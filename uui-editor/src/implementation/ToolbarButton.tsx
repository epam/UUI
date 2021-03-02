import * as React from 'react';
import { Editor } from "slate-react";
import { Button } from '@epam/uui-components';
import * as css from './ToolbarButton.scss';
import { Icon, cx } from '@epam/uui';

export interface ToolbarButtonProps  {
    isActive?: boolean;
    onClick?: () => any;
    icon?: Icon;
    iconColor?: 'red' | 'green' | 'amber' | 'blue' | 'gray60';
    editor?: Editor;
    isDisabled?: boolean;
    caption?: string;
}

export class ToolbarButton extends React.Component<ToolbarButtonProps> {
    render() {
        return <Button
            onClick={ (e) => { e.preventDefault(); this.props.onClick(); } }
            icon={ this.props.icon }
            caption={ this.props.caption }
            cx={ cx(css.toolbarButton, css['color-' + this.props.iconColor], css[this.props.isActive ? 'gray90' : 'gray80']) }
            isDisabled={ this.props.isDisabled }
        />;
    }
}
