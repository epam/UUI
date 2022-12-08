import React, { useRef, useContext, useState, useEffect } from 'react';
import FocusLock from 'react-focus-lock';
import { cx, IDropdownToggler, withMods, uuiMod, UuiContext, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, IHasCaption,
    IDisableable, IAnalyticableClick, IHasCX, IClickable } from '@epam/uui-core';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainer, DropdownBodyProps } from '@epam/uui-components';
import { Switch } from '../inputs';
import { systemIcons } from '../../icons/icons';
import css from './DropdownMenu.scss';

const icons = systemIcons['36'];
export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IDisableable, IAnalyticableClick, IDropdownToggler {
    isSelected?: boolean;
}

export interface IDropdownMenuContainer extends VPanelProps, DropdownBodyProps {
    closeOnKey?: React.KeyboardEvent<HTMLElement>['key'];
}

export const DropdownControlKeys = {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    LEFT_ARROW: 'ArrowLeft',
    RIGHT_ARROW: 'ArrowRight',
    UP_ARROW: 'ArrowUp',
    DOWN_ARROW: 'ArrowDown',
};

const DropdownMenuContainer = (props: IDropdownMenuContainer) => {
    const menuRef = useRef<HTMLMenuElement>(null);
    const [currentlyFocused, setFocused] = useState<number>(-1);
    const menuItems: HTMLElement[] = menuRef.current ? Array.from(menuRef.current.querySelectorAll(`[role="menuitem"]:not(.${uuiMod.disabled})`)) : [];

    useEffect(() => {
        menuRef.current?.focus();
    }, [menuRef.current]);

    const changeFocus = (nextFocusedIndex: number) => {
        if (menuItems.length > 0) {
            setFocused(nextFocusedIndex);
            menuItems[nextFocusedIndex].focus();
        }
    };

    const handleArrowKeys = (e: React.KeyboardEvent<HTMLMenuElement>) => {
        e.stopPropagation();

        const lastMenuItemsIndex = menuItems.length - 1;

        if (e.key === DropdownControlKeys.UP_ARROW) {
            changeFocus(currentlyFocused > 0 ? currentlyFocused - 1 : lastMenuItemsIndex);
        } else if (e.key === DropdownControlKeys.DOWN_ARROW) {
            changeFocus(currentlyFocused < lastMenuItemsIndex ? currentlyFocused + 1 : 0);
        } else if (e.key === props.closeOnKey && props.onClose) {
            props.onClose();
        }
    };

    return (
        <FocusLock
            as="menu"
            className={ css.menuRoot }
            returnFocus
            autoFocus={ false }
            ref={ menuRef }
            lockProps={ { onKeyDown: handleArrowKeys, tabIndex: -1 } }>
            <DropdownContainer { ...props } rawProps={ { tabIndex: -1 } } />
        </FocusLock>
    );
};

export const DropdownMenuBody = withMods<IDropdownMenuContainer>(
    DropdownMenuContainer,
    () => [css.bodyRoot],
    ({ style }) => ({ style }),
);

export const DropdownMenuButton = (props: IDropdownMenuItemProps) => {
    const context = useContext(UuiContext);

    const {
        icon,
        iconPosition,
        caption,
        isDisabled,
        isSelected,
        link,
        href,
        onClick,
        toggleDropdownOpening,
        isDropdown,
    } = props;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled || !onClick) return;
        onClick(event);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const handleOpenDropdown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === DropdownControlKeys.RIGHT_ARROW && isDropdown) {
            toggleDropdownOpening(true);
        } else if (event.key === DropdownControlKeys.ENTER && onClick) {
            onClick(event);
        }
    };

    const getMenuButtonContent = () => {
        const isIconBefore = Boolean(icon && iconPosition !== "right");
        const isIconAfter = Boolean(icon && iconPosition === "right");
        const iconElement = <IconContainer icon={ icon } cx={ cx(css.icon, iconPosition === "right" ? css.iconAfter : css.iconBefore) } />;

        return <>
            { isIconBefore && iconElement }
            { <Text cx={ css.caption }>{ caption }</Text> }
            { isIconAfter && <>
                <FlexSpacer />
                { iconElement }
            </> }
        </>;
    };

    const isAnchor = Boolean(link || href);

    const itemClassNames = cx(
        props.cx,
        css.itemRoot,
        isDisabled && uuiMod.disabled,
        isSelected && uuiMod.selected,
    );

    return isAnchor ? (
        <Anchor
            cx={ cx(css.link, itemClassNames) }
            link={ link }
            href={ href }
            rawProps={ { role: 'menuitem', tabIndex: isDisabled ? -1 : 0 } }
            onClick={ handleClick }
            isDisabled={ isDisabled }
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
        >
            { getMenuButtonContent() }
        </FlexRow>
    );
};

DropdownMenuButton.displayName = 'DropdownMenuButton';

export const DropdownMenuSplitter = (props: IHasCX) => (
    <div className={ cx(props.cx, css.splitterRoot) }>
        <hr className={ css.splitter }/>
    </div>
);

interface IDropdownMenuHeader extends IHasCX, IHasCaption {}

export const DropdownMenuHeader = (props: IDropdownMenuHeader) => (
    <div className={ cx(props.cx, css.headerRoot) }>
        <span className={ css.header }>{ props.caption }</span>
    </div>
);

interface IDropdownSubMenu extends IHasChildren, IHasCaption, IHasIcon, IDropdownMenuItemProps {
    openOnHover?: boolean;
}

export const DropdownSubMenu = (props: IDropdownSubMenu) => {
    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            closeOnMouseLeave="boundary"
            placement="right-start"
            renderBody={ (props) => (
                <DropdownMenuBody
                    closeOnKey={ DropdownControlKeys.LEFT_ARROW }
                    { ...props }
                />
            ) }
            renderTarget={ ({ toggleDropdownOpening }) => (
                <DropdownMenuButton
                    cx={ cx(css.submenuRootItem) }
                    icon={ icons.foldingArrow }
                    iconPosition="right"
                    isDropdown={ true }
                    toggleDropdownOpening={ toggleDropdownOpening }
                    { ...props }
                />
            ) }
        />
    );
};

interface IDropdownMenuSwitchButton extends IHasCX, IHasCaption, IHasIcon, IDisableable, IAnalyticableClick, IClickable {
    onValueChange: (value: boolean) => void;
    isSelected: boolean;
}

export const DropdownMenuSwitchButton = (props: IDropdownMenuSwitchButton) => {
    const context = useContext(UuiContext);

    const {
        icon,
        caption,
        isDisabled,
        isSelected,
        onValueChange,
    } = props;

    const onHandleValueChange = (value: boolean) => {
        if (isDisabled || !onValueChange) return;
        onValueChange(value);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const handleKeySelect = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === DropdownControlKeys.ENTER) {
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
            <Text cx={ css.caption }>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } tabIndex={ -1 } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
};
