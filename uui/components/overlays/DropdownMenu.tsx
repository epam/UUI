import React, { useRef, useContext, useState } from 'react';
import {
    cx, withMods, uuiMod, UuiContext, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, IHasCaption, IDisableable,
    IAnalyticableClick, IHasCX, IClickable, DropdownBodyProps, IDropdownTogglerProps,
} from '@epam/uui-core';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainerProps, getHtmlDir } from '@epam/uui-components';
import { DropdownContainer } from './DropdownContainer';
import { Switch } from '../inputs/Switch';
import { IconButton } from '../buttons';
import { systemIcons } from '../../icons/icons';
import css from './DropdownMenu.module.scss';

export interface IDropdownMenuItemProps extends IDropdownTogglerProps, IHasCaption, IHasIcon, ICanRedirect, IHasCX, IDisableable, IAnalyticableClick {
    isSelected?: boolean;
    isActive?: boolean;
    indent?: boolean;
}

export interface DropdownMenuContainerProps extends VPanelProps, IHasChildren, DropdownBodyProps, Pick<DropdownContainerProps, 'focusLock'> {
    closeOnKey?: React.KeyboardEvent<HTMLElement>['key'];
    minWidth?: number;
}

export enum IDropdownControlKeys {
    ENTER = 'Enter',
    ESCAPE = 'Escape',
    LEFT_ARROW = 'ArrowLeft',
    RIGHT_ARROW = 'ArrowRight',
    UP_ARROW = 'ArrowUp',
    DOWN_ARROW = 'ArrowDown'
}

function DropdownMenuContainer(props: DropdownMenuContainerProps) {
    const menuRef = useRef<HTMLMenuElement>(null);
    const [currentlyFocused, setFocused] = useState<number>(0);
    const menuItems: HTMLElement[] = menuRef.current ? Array.from(menuRef.current.querySelectorAll(`[role="menuitem"]:not(.${uuiMod.disabled})`)) : [];

    const changeFocus = (nextFocusedIndex: number) => {
        if (menuItems.length > 0) {
            setFocused(nextFocusedIndex);
            menuItems[nextFocusedIndex].focus();
        }
    };

    const handleArrowKeys = (e: React.KeyboardEvent<HTMLMenuElement>) => {
        const lastMenuItemsIndex = menuItems.length - 1;

        if (e.key === IDropdownControlKeys.UP_ARROW) {
            changeFocus(currentlyFocused > 0 ? currentlyFocused - 1 : lastMenuItemsIndex);
            e.preventDefault();
        } else if (e.key === IDropdownControlKeys.DOWN_ARROW) {
            changeFocus(currentlyFocused < lastMenuItemsIndex ? currentlyFocused + 1 : 0);
            e.preventDefault();
        } else if (e.key === props.closeOnKey && props.onClose) {
            e.stopPropagation();
            props.onClose();
        }
    };

    return (
        <DropdownContainer
            { ...props }
            rawProps={ { ...props.rawProps, role: 'menu' } }
            ref={ menuRef }
            width={ props.minWidth }
            lockProps={ { onKeyDown: handleArrowKeys } }
            cx={ [props.cx] }
        />
    );
}

export const DropdownMenuBody = withMods<DropdownMenuContainerProps, DropdownMenuContainerProps>(
    DropdownMenuContainer,
    () => ['uui-dropdownMenu-body'],
    (props) => {
        return ({ closeOnKey: IDropdownControlKeys.ESCAPE, ...props });
    },
);

export const DropdownMenuButton = React.forwardRef<any, IDropdownMenuItemProps>((props, ref) => {
    const context = useContext(UuiContext);

    const {
        icon, iconPosition, onIconClick, caption, isDisabled, isSelected, isActive, link, href, onClick, toggleDropdownOpening, isDropdown, isOpen, target,
    } = props;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled || !onClick) return;
        onClick(event);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const handleOpenDropdown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === IDropdownControlKeys.RIGHT_ARROW && isDropdown) {
            toggleDropdownOpening(true);
        } else if (event.key === IDropdownControlKeys.ENTER && onClick) {
            onClick(event);
        }
    };

    const getMenuButtonContent = () => {
        const isIconBefore = Boolean(icon && iconPosition !== 'right');
        const isIconAfter = Boolean(icon && iconPosition === 'right');
        const iconElement = (
            <IconButton
                icon={ icon }
                color={ isActive ? 'primary' : 'neutral' }
                onClick={ onIconClick }
                isDisabled={ isDisabled }
                cx={ cx(css.icon, iconPosition === 'right' ? css.iconAfter : css.iconBefore) }
            />
        );

        return (
            <>
                { isIconBefore && iconElement }
                <Text cx={ props.indent && css.indent }>{ caption }</Text>
                { isIconAfter && (
                    <>
                        <FlexSpacer />
                        { iconElement }
                    </>
                ) }
            </>
        );
    };

    const isAnchor = Boolean(link || href);

    const itemClassNames = cx(props.cx, css.itemRoot, isDisabled && uuiMod.disabled, isActive && uuiMod.active, isOpen && uuiMod.opened);

    return isAnchor ? (
        <Anchor
            cx={ cx(css.link, itemClassNames) }
            link={ link }
            href={ href }
            rawProps={ { role: 'menuitem', tabIndex: isDisabled ? -1 : 0 } }
            onClick={ handleClick }
            isLinkActive={ isActive }
            isDisabled={ isDisabled }
            target={ target }
        >
            { getMenuButtonContent() }
        </Anchor>
    ) : (
        <FlexRow
            rawProps={ {
                tabIndex: isDisabled ? -1 : 0,
                role: 'menuitem',
                onKeyDown: isDisabled ? null : handleOpenDropdown,
            } }
            cx={ itemClassNames }
            onClick={ handleClick }
            ref={ ref }
        >
            { getMenuButtonContent() }
            { isSelected && (
                <>
                    <FlexSpacer />
                    <IconContainer icon={ systemIcons.accept } cx={ css.selectedMark } />
                </>
            ) }
        </FlexRow>
    );
});

export function DropdownMenuSplitter(props: IHasCX) {
    return (
        <div className={ cx(props.cx, css.splitterRoot) }>
            <hr className={ css.splitter } />
        </div>
    );
}

interface IDropdownMenuHeader extends IHasCX, IHasCaption {}

export function DropdownMenuHeader(props: IDropdownMenuHeader) {
    return (
        <div className={ cx('uui-dropdown-menu-header', props.cx, css.headerRoot) }>
            <span className={ css.header }>{ props.caption }</span>
        </div>
    );
}

interface IDropdownSubMenu extends IHasChildren, IHasCaption, IHasIcon, IDropdownMenuItemProps {
    openOnHover?: boolean;
}

export function DropdownSubMenu(props: IDropdownSubMenu) {
    const subMenuModifiers = [
        {
            name: 'offset',
            options: {
                offset: ({ placement }: { placement: string }) => {
                    if (placement === 'right-start') {
                        return [-6, 0];
                    } else {
                        return [6, 0];
                    }
                },
            },
        },
    ];

    const dir = getHtmlDir();

    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            closeOnMouseLeave="boundary"
            openDelay={ 400 }
            closeDelay={ 400 }
            placement={ dir === 'rtl' ? 'left-start' : 'right-start' }
            modifiers={ subMenuModifiers }
            renderBody={ (dropdownProps) => <DropdownMenuBody closeOnKey={ IDropdownControlKeys.LEFT_ARROW } { ...props } { ...dropdownProps } /> }
            renderTarget={ ({ toggleDropdownOpening, ...targetProps }) => (
                <DropdownMenuButton
                    cx={ cx(css.submenuRootItem) }
                    icon={ systemIcons.foldingArrow }
                    iconPosition="right"
                    isDropdown={ true }
                    toggleDropdownOpening={ toggleDropdownOpening }
                    { ...props }
                    { ...targetProps }
                />
            ) }
        />
    );
}

interface IDropdownMenuSwitchButton extends IHasCX, IHasCaption, IHasIcon, IDisableable, IAnalyticableClick, IClickable {
    onValueChange: (value: boolean) => void;
    isSelected: boolean;
}

export function DropdownMenuSwitchButton(props: IDropdownMenuSwitchButton) {
    const context = useContext(UuiContext);

    const {
        icon, caption, isDisabled, isSelected, onValueChange,
    } = props;

    const onHandleValueChange = (value: boolean) => {
        if (isDisabled || !onValueChange) return;
        onValueChange(value);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const handleKeySelect = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === IDropdownControlKeys.ENTER) {
            onHandleValueChange(!isSelected);
        }
    };

    return (
        <FlexRow
            cx={ cx(props.cx, css.itemRoot, isDisabled && uuiMod.disabled) }
            onClick={ () => onHandleValueChange(!isSelected) }
            rawProps={ { role: 'menuitem', onKeyDown: handleKeySelect, tabIndex: isDisabled ? -1 : 0 } }
        >
            { icon && <IconContainer icon={ icon } cx={ css.iconBefore } /> }
            <Text>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } tabIndex={ -1 } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
}
