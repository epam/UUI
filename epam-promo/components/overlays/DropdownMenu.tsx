import React, { useContext, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import * as css from './DropdownMenu.scss';
import { cx, IDropdownToggler, withMods, uuiMod, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, UuiContext, IHasCaption, IDisableable, IAnalyticableClick,  IHasCX, IClickable } from '@epam/uui';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainer, DropdownBodyProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { Switch } from "../inputs";

const icons = systemIcons["36"];
export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IHasCaption, IDisableable, IAnalyticableClick, IClickable {
    isSelected?: boolean;
    toggleDropdownOpening?: (value: boolean) => void;
}

export interface IDropdownMenuContainer extends VPanelProps {
    onClose?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export enum IDropdownControlKeys {
    ENTER = 'Enter',
    ESCAPE = 'Escape',
    BACK_ARROW = 'ArrowLeft',
    FORWARD_ARROW = 'ArrowRight',
    UP_ARROW = 'ArrowUp',
    DOWN_ARROW = 'ArrowDown',
};

const DropdownMenuContainer = ({ onClose, ...props }: IDropdownMenuContainer) => {
    const menuRef = useRef<HTMLMenuElement>(null);
    const [currentlyFocused, setFocused] = useState<number>(0);

    const handleArrowKeys = (e: KeyboardEvent) => {
        const menuItems: HTMLElement[] = Array.from(menuRef.current.querySelectorAll(`[role="menuitem"]:not(.${uuiMod.disabled})`));

        if (menuItems.length > 0 && currentlyFocused === 0 && document.activeElement !== menuItems[currentlyFocused]) {
            menuItems[currentlyFocused].focus();
            return;
        }

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
        };
    };

    const handleMenuClose = (e: React.KeyboardEvent<HTMLMenuElement>) => {
        if (e.key === IDropdownControlKeys.ESCAPE && onClose) {
            onClose(e);
        };
    };

    return (
        <FocusLock
            as="menu"
            className={ css.menuRoot }
            returnFocus
            ref={ menuRef }
            lockProps={{ onKeyDown: handleMenuClose, onKeyUp: handleArrowKeys }}>
            <DropdownContainer { ...props } />
        </FocusLock>
    )
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
    } = props;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled || !onClick) return;
        onClick(event);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const handleOpenDropdown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === IDropdownControlKeys.FORWARD_ARROW) {
            toggleDropdownOpening(true);
        } else if (event.key === IDropdownControlKeys.BACK_ARROW) {
            toggleDropdownOpening(false);
        } else if (event.key === IDropdownControlKeys.ENTER) {
            onClick(event);
        }
    }

    const getMenuButtonContent = () => {
        const isIconBefore = Boolean(icon && iconPosition !== "right");
        const isIconAfter = Boolean(icon && iconPosition === "right");
        const iconElement = <IconContainer icon={ icon } cx={ iconPosition === "right" ? css.iconAfter : css.iconBefore } />;

        return <>
            { isIconBefore && iconElement }
            { <Text cx={ css.caption }>{ caption }</Text> }
            { isIconAfter && <>
                <FlexSpacer />
                { iconElement }
            </> }
        </>
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
            rawProps={{ role: 'menuitem', tabIndex: -1 }}
            onClick={ handleClick }
            isDisabled={ isDisabled }
        >
            { getMenuButtonContent() }
        </Anchor>
    ) : (
        <FlexRow
            rawProps={{
                tabIndex: -1,
                role: 'menuitem',
                onKeyDown: isDisabled ? null : handleOpenDropdown
            }}
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
    const MenuItem = ({ toggleDropdownOpening }: IDropdownToggler) => (
        <DropdownMenuButton
            cx={ cx(css.submenuRootItem) }
            icon={ icons.foldingArrow }
            iconPosition="right"
            toggleDropdownOpening={ toggleDropdownOpening }
            { ...props }
        />
    );

    const DropdownBody = ({ toggleDropdownOpening }: DropdownBodyProps) => (
        <DropdownMenuBody { ...props }>
            { React.Children.map(props.children, child => React.cloneElement(
                child, child.type.name === DropdownMenuButton.displayName ? { toggleDropdownOpening } : {})
            ) }
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            placement="right-start"
            renderBody={ props => <DropdownBody { ...props } /> }
            renderTarget={ props => <MenuItem { ...props } /> }
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
    }

    return (
        <FlexRow
            cx={ cx(props.cx, css.itemRoot, isDisabled && uuiMod.disabled) }
            onClick={ () => onHandleValueChange(!isSelected) }
            rawProps={{ tabIndex: -1, role: 'menuitem', onKeyDown: handleKeySelect }}
        >
            { icon && <IconContainer icon={ icon } cx={ css.iconBefore } /> }
            <Text cx={ css.caption }>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
};
