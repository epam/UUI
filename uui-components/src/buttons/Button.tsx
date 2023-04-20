import * as React from 'react';
import { ButtonCoreProps, Icon, uuiElement, uuiMarkers, CX, IHasRawProps, cx, IHasForwardedRef } from '@epam/uui-core';
import { IconContainer } from '../layout';
import { ButtonBase } from './ButtonBase';
import css from './Button.scss';

export interface ButtonProps
    extends ButtonCoreProps,
        IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>>,
        IHasForwardedRef<HTMLButtonElement | HTMLAnchorElement> {
    /** Icon for clear value button (usually cross) */
    clearIcon?: Icon;

    /** CSS classes to put on the caption */
    captionCX?: CX;
}

export class Button extends ButtonBase<ButtonProps> {
    constructor(props: ButtonProps) {
        super(props);
    }

    getClassName() {
        return [css.container];
    }

    getChildren() {
        return [
            this.props.isDropdown && this.props.dropdownIconPosition === 'left' && (
                <IconContainer key="dropdown-icon-left" icon={this.props.dropdownIcon} flipY={this.props.isOpen} />
            ),
            this.props.icon && this.props.iconPosition !== 'right' && (
                <IconContainer key="icon-left" icon={this.props.icon} onClick={!this.props.isDisabled ? this.props.onIconClick : undefined} />
            ),
            this.props.count !== undefined && this.props.count !== null && this.props.countPosition !== 'right' && (
                <div key="count" className={cx(uuiElement.count)}>
                    {this.props.count}
                </div>
            ),
            this.props.caption && (
                <div key="caption" className={cx(uuiElement.caption, this.props.captionCX)}>
                    {this.props.caption}
                </div>
            ),
            this.props.count !== undefined && this.props.count !== null && this.props.countPosition === 'right' && (
                <div key="count" className={cx(uuiElement.count)}>
                    {this.props.count}
                </div>
            ),
            !this.props.caption && this.props.placeholder && (
                <div key="placeholder" className={cx(uuiElement.caption, uuiElement.placeholder, this.props.captionCX)}>
                    {this.props.placeholder}
                </div>
            ),
            this.props.icon && this.props.iconPosition === 'right' && (
                <IconContainer key="icon-right" icon={this.props.icon} onClick={!this.props.isDisabled ? this.props.onIconClick : undefined} />
            ),
            this.props.isDropdown && this.props.dropdownIconPosition !== 'left' && (
                <IconContainer key="dropdown-icon-right" icon={this.props.dropdownIcon} flipY={this.props.isOpen} />
            ),
            this.props.onClear && !this.props.isDisabled && (
                <IconContainer key="clear-icon" cx={uuiMarkers.clickable} icon={this.props.clearIcon} onClick={this.props.onClear} />
            ),
        ];
    }
}
