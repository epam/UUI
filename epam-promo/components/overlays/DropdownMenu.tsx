import * as React from 'react';
import * as css from './DropdownMenu.scss';
import {  withMods, uuiMod, IHasDirection, IHasChildren, directionMode, VPanelProps, IHasIcon, ICanRedirect, UuiContext, IHasCaption, IDisableable, IAnalyticableClick,  IHasCX, Icon, IClickable } from '@epam/uui';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainer } from '@epam/uui-components';
import { systemIcons } from '@epam/promo/icons/icons';
import cx from "classnames";

const icons = systemIcons["36"];

export interface IDropdownMenuItemMods {
    theme?: 'light' | 'dark';
}

export interface IDropdownMenuItemProps extends ICanRedirect, IHasCX, IHasCaption, IDisableable, IAnalyticableClick, IClickable {
    iconBefore?: Icon;
    iconAfter?: Icon;
    isSelected?: boolean;
    onClick?: (event: any) => void;
    renderItem?: (props: IDropdownMenuItemProps) => React.ReactElement<any, any>;
}

export const DropdownMenuBody = withMods<VPanelProps, IDropdownMenuItemMods>(
    DropdownContainer,
    (mods: IDropdownMenuItemMods) => [
        css.bodyRoot,
        css['theme-' + (mods.theme || 'light')],
    ],
    (props) => ({
        style: props.style,
        theme: props.theme
    })
);

export const MenuItem = (props: IDropdownMenuItemProps) => {

    const context = React.useContext(UuiContext);

    const {
        iconBefore,
        iconAfter,
        caption,
        isDisabled,
        isSelected,
        link,
        href,
        target,
        onClick,
        renderItem
    } = props;

    const handleClick = (event: React.SyntheticEvent<any, any>) => {
        if (isDisabled || !onClick) return;
        onClick(event)
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent)
    }

    if (renderItem) {
        return (
            renderItem(props)
        )
    };

    const getMenuItemChildren = () => {
            const children = [];
            iconBefore && children.push(<IconContainer key="iconBefore" icon={ iconBefore } cx={css.iconBefore}/>)
            children.push(<Text cx={ css.caption } key="caption">{caption}</Text>)
            if (iconAfter) {
                children.push(<FlexSpacer key="flexSpacer"/>)
                children.push(<IconContainer key="iconAfter" icon={ iconAfter } cx={css.iconAfter}/>)
            }
            return children;
        }

    return (
            link || href ?
                <Anchor
                    cx={
                        cx(
                            css.link,
                            props.cx,
                            css.itemRoot,
                            isDisabled && uuiMod.disabled,
                            isSelected && uuiMod.selected
                        )
                    }
                    link={ link }
                    href={ href }
                    onClick={ handleClick }
                    isDisabled={ isDisabled }
                    target={ target || "_blank"}
                >
                    {...getMenuItemChildren()}
                </Anchor>
                :
                <FlexRow
                    cx={
                        cx(
                            props.cx,
                            css.itemRoot,
                            isDisabled && uuiMod.disabled,
                            isSelected && uuiMod.selected
                        )
                    }
                    onClick={handleClick}
                >
                    { ...getMenuItemChildren() }
                </FlexRow>


    )
}


interface IMenuItemsGroup extends IHasCaption, IHasChildren, IHasDirection {
    title?: string;
}

export const MenuItemsGroup = (props: IMenuItemsGroup) => {

    const { direction = "vertical", children, title } = props;

    return (
        <div className={cx(directionMode[direction], css.groupRoot)}>
            <div className={css.groupTitle}>{title}</div>
            <div className={directionMode[direction]}>
                {children}
            </div>
        </div>
    )
}

interface ISubMenu extends IHasChildren, IHasCaption, IHasIcon, IDropdownMenuItemProps {
    openOnHover?: boolean;
}

export const SubMenu = (props: ISubMenu & IDropdownMenuItemMods) => {

    const menuItem = (
        <MenuItem
            cx={cx(css.submenuRootItem)}
            iconAfter={ icons.foldingArrow }
            { ... props}
        />
        )
    const dropdownBody = (<DropdownMenuBody {...props}>{props.children}</DropdownMenuBody>)
    return (
            <Dropdown
                openOnHover={props.openOnHover || true}
                closeOnMouseLeave="boundary"
                placement="right-start"
                renderBody={ () => dropdownBody }
                renderTarget={ () => menuItem }
            />
    )
}