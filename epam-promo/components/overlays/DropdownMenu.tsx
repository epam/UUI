import * as React from 'react';
import * as css from './DropdownMenu.scss';
import {  withMods, uuiMod, IHasDirection, IHasChildren, directionMode, VPanelProps, IHasIcon, ICanRedirect, UuiContext, IHasCaption, IDisableable, IAnalyticableClick,  IHasCX, Icon, IClickable } from '@epam/uui';
import { FlexRow, IconContainer, Dropdown, DropdownContainerProps, FlexSpacer, DropdownContainer } from '@epam/uui-components';
import { systemIcons } from '@epam/promo/icons/icons';
import cx from "classnames";
import { Switch } from '@epam/promo';

const icons = systemIcons["36"];

export interface IDropdownMenuItemMods {
    theme?: 'light' | 'dark';
}

export interface IDropdownMenuItemProps extends ICanRedirect, IHasCX, IHasCaption, IDisableable, IAnalyticableClick, IClickable {
    iconBefore?: Icon;
    iconAfter?: Icon;
    selectableType?: "check" | "switch"
    isSelected?: boolean;
    onSelectChange?: (val: boolean) => void;
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
        selectableType,
        isDisabled,
        isSelected,
        onClick,
        onSelectChange
    } = props;

    const handleClick = (event: React.SyntheticEvent<any, any>) => {
        if (isDisabled) return;
        onClick && onClick(event);
        props.hasOwnProperty("isSelected") && handleSelectChange(!isSelected)
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent)
    }

    const handleSelectChange = (value: boolean) => {
        if (isDisabled || !onSelectChange) return;
        onSelectChange(value);
    }

    const getSelectableNode = () => {
        switch (selectableType) {
            case "switch":
                return <Switch value={ isSelected }  onValueChange={ handleSelectChange }/>

            case "check":
                return isSelected && <IconContainer icon={ icons.accept } cx={css.iconCheck} />

            default:
                return;
        }
    }

    return (
        <FlexRow
            cx={cx(
                props.cx,
                css.itemRoot,
                isDisabled && uuiMod.disabled,
                isSelected && uuiMod.selected,
                selectableType && 'withSelectedType'
            )}
            onClick={handleClick}
        >
            { iconBefore && <IconContainer icon={ iconBefore } cx={css.iconBefore}/>}
            {caption}
            <FlexSpacer />
            { iconAfter && <IconContainer icon={ iconAfter } cx={css.iconAfter}/> }
            { getSelectableNode() }
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