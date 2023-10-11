import React, { useRef, useContext, useState, HTMLAttributes } from 'react';
import {
    cx, IDropdownToggler, withMods, uuiMod, UuiContext, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, IHasCaption, IDisableable,
    IAnalyticableClick, IHasCX, IClickable, DropdownBodyProps, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer } from '@epam/uui-components';
import { DropdownContainer } from './DropdownContainer';
import { Switch } from '../inputs';
import { IconButton } from '../buttons';
import { systemIcons } from '../../icons/icons';
import css from './DropdownMenu.module.scss';

const icons = systemIcons['36'];
export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IDisableable, IAnalyticableClick, IDropdownToggler {
    isSelected?: boolean;
    isActive?: boolean;
    indent?: boolean;
}

export interface IDropdownMenuContainer extends VPanelProps, DropdownBodyProps {
    closeOnKey?: React.KeyboardEvent<HTMLElement>['key'];
}

export enum IDropdownControlKeys {
    ENTER = 'Enter',
    ESCAPE = 'Escape',
    LEFT_ARROW = 'ArrowLeft',
    RIGHT_ARROW = 'ArrowRight',
    UP_ARROW = 'ArrowUp',
    DOWN_ARROW = 'ArrowDown'
}

function DropdownMenuContainer(props: IDropdownMenuContainer) {
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
        } else if (e.key === IDropdownControlKeys.DOWN_ARROW) {
            changeFocus(currentlyFocused < lastMenuItemsIndex ? currentlyFocused + 1 : 0);
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
            lockProps={ { onKeyDown: handleArrowKeys } }
            cx={ css.root }
        />
    );
}

interface IDropdownMenuBody extends DropdownBodyProps, IHasCX, IHasChildren, IHasRawProps<HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    minWidth?: number;
    closeOnKey?: React.KeyboardEvent<HTMLElement>['key'];
}

export const DropdownMenuBody = withMods<IDropdownMenuBody>(
    DropdownMenuContainer,
    () => [css.bodyRoot],
    (props) => {
        const dropdownRawProps = props.minWidth ? { ...props.rawProps, style: { minWidth: `${props.minWidth}px` } } : null;
        return ({ closeOnKey: IDropdownControlKeys.ESCAPE, ...props, rawProps: dropdownRawProps || props.rawProps }) as IDropdownMenuBody;
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
                color={ isActive ? 'info' : 'neutral' }
                onClick={ onIconClick }
                isDisabled={ isDisabled }
                cx={ cx(css.root, css.icon, iconPosition === 'right' ? css.iconAfter : css.iconBefore) }
            />
        );

        return (
            <>
                {isIconBefore && iconElement}
                <Text cx={ props.indent && css.indent }>{caption}</Text>
                {isIconAfter && (
                    <>
                        <FlexSpacer />
                        {iconElement}
                    </>
                )}
            </>
        );
    };

    const isAnchor = Boolean(link || href);

    const itemClassNames = cx(css.root, props.cx, css.itemRoot, isDisabled && uuiMod.disabled, isActive && uuiMod.active, isOpen && uuiMod.opened);

    return isAnchor ? (
        <Anchor
            cx={ cx(css.link, itemClassNames) }
            link={ link }
            href={ href }
            rawProps={ { role: 'menuitem', tabIndex: isDisabled ? -1 : 0 } }
            onClick={ handleClick }
            isDisabled={ isDisabled }
            forwardedRef={ ref }
            target={ target }
        >
            {getMenuButtonContent()}
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
            {getMenuButtonContent()}
            {isSelected && <IconContainer icon={ icons.accept } cx={ cx(css.root, css.selectedCheckmark) } />}
        </FlexRow>
    );
});

DropdownMenuButton.displayName = 'DropdownMenuButton';

export function DropdownMenuSplitter(props: IHasCX) {
    return (
        <div className={ cx(css.root, props.cx, css.splitterRoot) }>
            <hr className={ css.splitter } />
        </div>
    );
}

interface IDropdownMenuHeader extends IHasCX, IHasCaption {}

export function DropdownMenuHeader(props: IDropdownMenuHeader) {
    return (
        <div className={ cx('uui-dropdown-menu-header', css.root, props.cx, css.headerRoot) }>
            <span className={ css.header }>{props.caption}</span>
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
                offset: ({ placement } : { placement:string }) => {
                    if (placement === 'right-start') {
                        return [-6, 0];
                    } else {
                        return [6, 0];
                    }
                },
            },
        },
    ];

    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            closeOnMouseLeave="boundary"
            openDelay={ 400 }
            closeDelay={ 400 }
            placement="right-start"
            modifiers={ subMenuModifiers }
            renderBody={ (dropdownProps) => <DropdownMenuBody closeOnKey={ IDropdownControlKeys.LEFT_ARROW } { ...props } { ...dropdownProps } /> }
            renderTarget={ ({ toggleDropdownOpening, ...targetProps }) => (
                <DropdownMenuButton
                    cx={ cx(css.root, css.submenuRootItem) }
                    icon={ icons.foldingArrow }
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
            {icon && <IconContainer icon={ icon } cx={ css.iconBefore } />}
            <Text>{caption}</Text>
            <FlexSpacer />
            <Switch value={ isSelected } tabIndex={ -1 } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
}
