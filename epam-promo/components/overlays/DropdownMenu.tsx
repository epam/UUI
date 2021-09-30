import React, { useContext, useRef, useState, useEffect } from 'react';
import FocusLock from 'react-focus-lock';
import * as css from './DropdownMenu.scss';
import { cx, IDropdownToggler, withMods, uuiMod, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, UuiContext, IHasCaption, IDisableable, IAnalyticableClick, IHasCX, IClickable } from '@epam/uui';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainer } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { Switch } from "../inputs";

const icons = systemIcons["36"];
export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IDisableable, IAnalyticableClick, IDropdownToggler {
    isSelected?: boolean;
}

export interface IDropdownMenuContainer extends VPanelProps {
    onClose(): void;
    closeOnKey?: React.KeyboardEvent<HTMLElement>['key'];
}

export enum IDropdownControlKeys {
    ENTER = 'Enter',
    ESCAPE = 'Escape',
    LEFT_ARROW = 'ArrowLeft',
    RIGHT_ARROW = 'ArrowRight',
    UP_ARROW = 'ArrowUp',
    DOWN_ARROW = 'ArrowDown',
}

const DropdownMenuContainer = ({
    onClose,
    closeOnKey = IDropdownControlKeys.ESCAPE,
    ...props
}: IDropdownMenuContainer) => {
    const menuRef = useRef<HTMLMenuElement>(null);
    const [currentlyFocused, setFocused] = useState<number>(0);
    const menuItems: HTMLElement[] = menuRef.current ? Array.from(menuRef.current.querySelectorAll(`[role="menuitem"]:not(.${uuiMod.disabled})`)) : [];

    useEffect(() => {
        if (currentlyFocused === 0 && menuItems.length > 0 && !menuItems.includes(document.activeElement as HTMLElement)) {
            menuItems[currentlyFocused].focus();
        }
    }, [menuRef.current]);

    const handleArrowKeys = (e: React.KeyboardEvent<HTMLMenuElement>) => {
        e.stopPropagation();

        if (e.key === IDropdownControlKeys.UP_ARROW) {
            const nextFocusedIndex = currentlyFocused - 1;
            if (nextFocusedIndex < 0) return;
            setFocused(nextFocusedIndex);
            menuItems[nextFocusedIndex].focus();
        } else if (e.key === IDropdownControlKeys.DOWN_ARROW) {
            const nextFocusedIndex = currentlyFocused + 1;
            if (nextFocusedIndex >= menuItems.length) return;
            setFocused(nextFocusedIndex);
            menuItems[nextFocusedIndex].focus();
        } else if (e.key === closeOnKey && onClose) {
            onClose();
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
        if (event.key === IDropdownControlKeys.RIGHT_ARROW && isDropdown) {
            toggleDropdownOpening(true);
        } else if (event.key === IDropdownControlKeys.ENTER && onClick) {
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
            renderBody={ ({ onClose }) => (
                <DropdownMenuBody
                    { ...props }
                    closeOnKey={ IDropdownControlKeys.LEFT_ARROW }
                    onClose={ onClose }
                />
            ) }
            renderTarget={ ({ toggleDropdownOpening }: IDropdownToggler)  => (
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
            <Text cx={ css.caption }>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } tabIndex={ -1 } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
};
