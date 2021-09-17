import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import * as css from './DropdownMenu.scss';
import {  IDropdownToggler, cx, withMods, uuiMod, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, UuiContext, IHasCaption, IDisableable, IAnalyticableClick,  IHasCX, IClickable } from '@epam/uui';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainer, DropdownBodyProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { Switch } from "../inputs";

const icons = systemIcons["36"];
const ESCAPE = 'Escape';
const BACK_ARROW = 'ArrowLeft';
const FORWARD_ARROW = 'ArrowRight';
const UP_ARROW = 'ArrowUp';
const DOWN_ARROW = 'ArrowDown';

export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IHasCaption, IDisableable, IAnalyticableClick, IClickable {
    isSelected?: boolean;
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
}

export interface IDropdownMenuContainer extends VPanelProps {
    onClose?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const useArrowKeysNav = <T extends HTMLElement>(ref: React.RefObject<T>): void => {
    const [menuItems, setMenuItems] = useState<HTMLElement[]>([]);
    const [currentlyFocused, setFocused] = useState<number>(0);

    const handleArrowKeys = (e: KeyboardEvent) => {
        if (!ref.current || menuItems.length === 0) return;
        if (![UP_ARROW, DOWN_ARROW].includes(e.key)) return;

        if (e.key === UP_ARROW) {
            e.preventDefault();
            const nextFocusedIndex = currentlyFocused - 1;
            if (nextFocusedIndex < 0) return;
            setFocused(nextFocusedIndex);
            menuItems[nextFocusedIndex].focus();
        } else if (e.key === DOWN_ARROW) {
            e.preventDefault();
            const nextFocusedIndex = currentlyFocused + 1;
            if (nextFocusedIndex >= menuItems.length) return;
            setFocused(nextFocusedIndex);
            menuItems[nextFocusedIndex].focus();
        }
    };

    useEffect(() => {
        if (!ref.current) return;
        setMenuItems(Array.from(ref.current?.querySelectorAll(`[role="menuitem"]:not(.${uuiMod.disabled})`)));
        ref.current?.addEventListener('keydown', handleArrowKeys);
        return () => ref.current?.removeEventListener('keydown', handleArrowKeys);
    }, [ref.current, currentlyFocused]);
}

const DropdownMenuContainer = forwardRef(({ onClose, ...props }: IDropdownMenuContainer, ref: any) => {
    const menuRef = useRef(ref);
    useArrowKeysNav<HTMLMenuElement>(menuRef);

    return (
        <FocusLock
            as="menu"
            className={ css.menuRoot }
            returnFocus
            ref={menuRef}
            lockProps={{ onKeyDown: (e: React.KeyboardEvent<HTMLMenuElement>) => e.key === ESCAPE ? onClose(e) : null }}>
            <DropdownContainer { ...props } />
        </FocusLock>
    )
});

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
        onKeyDown,
    } = props;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (isDisabled || !onClick) return;
        onClick(event);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

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
            rawProps={{ role: 'menuitem', tabIndex: 0 }}
            onClick={ handleClick }
            isDisabled={ isDisabled }
        >
            { getMenuButtonContent() }
        </Anchor>
    ) : (
        <FlexRow
            rawProps={{
                tabIndex: !isDisabled ? 0 : -1,
                role: 'menuitem',
                onKeyDown: isDisabled ? null : e => onKeyDown && onKeyDown(e)
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
    const subMenuRef = useRef();
    useArrowKeysNav(subMenuRef);

    const MenuItem = ({ onKeyDown }: IDropdownToggler) => (
        <DropdownMenuButton
            cx={ cx(css.submenuRootItem) }
            icon={ icons.foldingArrow }
            iconPosition="right"
            onKeyDown={ onKeyDown }
            { ...props }
        />
    );

    const DropdownBody = ({ onKeyDown }: DropdownBodyProps) => (
        <DropdownMenuBody ref={subMenuRef} { ...props }>
            { React.Children.map(props.children, child => React.cloneElement(
                child, child.type.name === DropdownMenuButton.displayName ? { onKeyDown } : {})
            ) }
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            placement="right-start"
            renderBody={ props => <DropdownBody { ...props } /> }
            renderTarget={ props => <MenuItem { ...props } /> }
            keyToOpen={ FORWARD_ARROW }
            keyToClose={ BACK_ARROW }
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

    return (
        <FlexRow
            cx={ cx(props.cx, css.itemRoot, isDisabled && uuiMod.disabled) }
            onClick={ () => onHandleValueChange(!isSelected) }
            rawProps={{ tabIndex: 0, role: 'menuitem' }}
        >
            { icon && <IconContainer icon={ icon } cx={ css.iconBefore } /> }
            <Text cx={ css.caption }>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
};
