import React, { useContext } from 'react';
import FocusLock from 'react-focus-lock';
import * as css from './DropdownMenu.scss';
import { cx, withMods, uuiMod, IHasChildren, VPanelProps, IHasIcon, ICanRedirect, UuiContext, IHasCaption, IDisableable, IAnalyticableClick,  IHasCX, IClickable } from '@epam/uui';
import { Text, FlexRow, Anchor, IconContainer, Dropdown, FlexSpacer, DropdownContainer } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import { Switch } from "../inputs";

const icons = systemIcons["36"];

export interface IDropdownMenuItemProps extends IHasIcon, ICanRedirect, IHasCX, IHasCaption, IDisableable, IAnalyticableClick, IClickable {
    isSelected?: boolean;
}

const DropdownMenuContainer = (props: VPanelProps) => (
    <FocusLock as="menu" returnFocus>
        <DropdownContainer { ...props } />
    </FocusLock>
);

export const DropdownMenuBody = withMods<VPanelProps>(
    DropdownMenuContainer,
    () => [css.bodyRoot],
    (props) => ({ style: props.style }),
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
        target,
        onClick,
    } = props;

    const handleClick = (event: React.SyntheticEvent<any, any>) => {
        if (isDisabled || !onClick) return;
        onClick(event);
        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const getMenuButtonContent = () => {
        const isIconBefore = Boolean(icon && iconPosition !== "right");
        const isIconAfter = Boolean(icon && iconPosition === "right");

        const iconElement = <IconContainer icon={ icon } cx={ iconPosition === "right" ? css.iconAfter : css.iconBefore } />;

        return (
            <>
                { isIconBefore && iconElement }
                { <Text cx={ css.caption }>{ caption }</Text> }
                { isIconAfter && <>
                    <FlexSpacer />
                    { iconElement }
                </> }
            </>
        );
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
            onClick={ handleClick }
            isDisabled={ isDisabled }
        >
            { getMenuButtonContent() }
        </Anchor>
    ) : (
        <FlexRow rawProps={{ tabIndex: isDisabled ? - 1 : 0 }} cx={ itemClassNames } onClick={ handleClick }>
            { getMenuButtonContent() }
        </FlexRow>
    );
};

export const DropdownMenuSplitter = (props: IHasCX) => {
    return (
        <div className={ cx(props.cx, css.splitterRoot) }>
            <hr className={ css.splitter }/>
        </div>
    );
};

interface IDropdownMenuHeader extends IHasCX, IHasCaption {}

export const DropdownMenuHeader = (props: IDropdownMenuHeader) => {
    return (
        <div className={ cx(props.cx, css.headerRoot) }>
            <span className={ css.header }>{ props.caption }</span>
        </div>
    );
};

interface IDropdownSubMenu extends IHasChildren, IHasCaption, IHasIcon, IDropdownMenuItemProps {
    openOnHover?: boolean;
}

export const DropdownSubMenu = (props: IDropdownSubMenu) => {
    const menuItem = (
        <DropdownMenuButton
            cx={ cx(css.submenuRootItem) }
            icon={ icons.foldingArrow }
            iconPosition="right"
            { ... props }
        />
    );

    const dropdownBody = (
        <DropdownMenuBody { ...props }>
            { props.children }
        </DropdownMenuBody>
    );

    return (
        <Dropdown
            openOnHover={ props.openOnHover || true }
            closeOnMouseLeave="boundary"
            placement="right-start"
            renderBody={ () => dropdownBody }
            renderTarget={ () => menuItem }
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
            cx={ cx(
                props.cx,
                css.itemRoot,
                isDisabled && uuiMod.disabled,
            ) }
            onClick={ () => onHandleValueChange(!isSelected) }
        >
            { icon && <IconContainer icon={ icon } cx={ css.iconBefore } /> }
            <Text cx={ css.caption }>{ caption }</Text>
            <FlexSpacer />
            <Switch value={ isSelected } onValueChange={ onHandleValueChange } />
        </FlexRow>
    );
};
