import * as React from 'react';
import css from './FilterToolbarItemToggler.scss';
import cx from "classnames";
import { IDropdownToggler, IHasCX, uuiElement, uuiMarkers, uuiMod } from "@epam/uui-core";
import { systemIcons } from "../../icons/icons";
import { IconContainer, FlexRow } from "@epam/uui-components";
import { Text } from "../typography";


const defaultSize = "36";
const defaultWidth = "267";

export interface FilterToolbarItemTogglerProps extends IDropdownToggler {
    selection: string | null | JSX.Element;
    postfix?: string | null | JSX.Element;
    title?: string;
    maxWidth?: string;
    size?: '24' | '30' | '36' | '42' | '48';
    cx?: IHasCX;
}

export const FilterToolbarItemToggler = React.forwardRef<HTMLDivElement, FilterToolbarItemTogglerProps>((props, ref) => {

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled) return;
        e.preventDefault();
        props.onClick?.();
    };

    return (
        <FlexRow
            { ...props }
            rawProps={ { style: { maxWidth: `${ (props.maxWidth || defaultWidth) + 'px' }` } } }
            cx={ cx(css.root,
                uuiElement.inputBox, uuiMarkers.clickable,
                props.isOpen && uuiMod.opened,
                ["size-" + (props.size || defaultSize)],
                props.cx) }
            onClick={ togglerPickerOpened }
            ref={ ref }
        >
            <FlexRow cx={ css.titleWrapper }>
                <Text
                    color="gray60"
                    font="sans"
                    cx={ css.title }
                >
                    { `${ props.title }:` }
                </Text>
                { <div className={ cx(css.textWrapper) }>
                        <Text
                            color="gray90"
                            font="sans"
                            cx={ css.selection }
                        >
                            { props.selection }
                        </Text>
                        {
                            props.postfix &&
                            <Text
                                color="gray90"
                                font="sans"
                                cx={ css.postfix }
                            >
                                { props.postfix }
                            </Text>
                        }
                    </div> }
            </FlexRow>
            {
                !props.isDisabled &&
                <IconContainer
                    icon={ systemIcons[props.size || defaultSize].foldingArrow }
                    flipY={ props.isOpen }
                    cx="uui-icon-dropdown"
                />
            }
        </FlexRow>
    );
});