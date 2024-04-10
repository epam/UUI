import * as React from 'react';
import { CX, cx, devLogger, Icon, IDropdownToggler, IHasCaption, IHasIcon, uuiElement } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import * as types from '../types';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';
import css from './LinkButton.module.scss';

const DEFAULT_SIZE = '36';
const DEFAULT_COLOR = 'primary';

interface LinkButtonMods {
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'contrast';
}

/** Represents the Core properties of the LinkButton component. */
export type LinkButtonCoreProps = ClickableComponentProps & IDropdownToggler & IHasIcon & IHasCaption & {
    /**
     * CSS classes to put on the caption
     * @deprecated
     * */
    captionCX?: CX;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /**
     * Defines component size.
     * @default '36'
     */
    size?: types.ControlSize | '42';
};

/** Represents the properties of the LinkButton component. */
export type LinkButtonProps = LinkButtonCoreProps & LinkButtonMods;

function applyLinkButtonMods(mods: LinkButtonProps) {
    return [
        'uui-link_button',
        css.root,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
        ...getIconClass(mods),
        `uui-color-${mods.color || DEFAULT_COLOR}`,
    ];
}

export const LinkButton = /* @__PURE__ */React.forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkButtonProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('LinkButton: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    const styles = [applyLinkButtonMods(props), props.cx];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : systemIcons.foldingArrow;

    return (
        <Clickable
            { ...props }
            type="button"
            cx={ styles }
            ref={ ref }
        >
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ !props.isDisabled ? props.onIconClick : undefined }
                />
            ) }
            { props.caption && (
                <div className={ cx(uuiElement.caption, props.captionCX) }>
                    { props.caption }
                </div>
            ) }
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            ) }
        </Clickable>
    );
});
