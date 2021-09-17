import React, { useContext } from 'react';
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

export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IHasCaption, IDisableable, IAnalyticableClick, IClickable {
    isSelected?: boolean;
    onKeyDown?(e: React.KeyboardEvent<HTMLElement>): void;
}

export interface IDropdownMenuContainer extends VPanelProps {
    onClose?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const DropdownMenuContainer = ({ onClose, ...props }: IDropdownMenuContainer) => (
    <FocusLock
        as="menu"
        returnFocus
        lockProps={{ onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => e.key === ESCAPE ? onClose(e) : null }}>
        <DropdownContainer { ...props } />
    </FocusLock>
);

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
            rawProps={{ role: 'menuitem' }}
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
        <DropdownMenuBody { ...props }>
            { React.Children.map(props.children, child => React.cloneElement(
                child, child.type.name === DropdownMenuButton.displayName ? { onKeyDown } : {})
            ) }
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            closeOnMouseLeave="boundary"
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
        >
            { icon && <IconContainer icon={ icon } cx={ css.iconBefore } /> }
            <Text cx={ css.caption }>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
};
