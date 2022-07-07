import * as React from 'react';
import css from './FilterToolbarItemToggler.scss';
import cx from "classnames";
import { IHasCX, uuiElement, uuiMarkers, uuiMod } from "@epam/uui-core";
import { systemIcons } from "../../icons/icons";
import { IconContainer, FlexRow } from "@epam/uui-components";
import { Text, TextPlaceholder } from "../typography";
import { LOADING } from "./FiltersToolbarItem";


const defaultSize = "36";
const defaultWidth = "267";

export interface FilterToolbarItemTogglerProps {
    value: { prefix: string, selected: string | null };
    title?: string;
    size?: '24' | '30' | '36' | '42' | '48';
    isDisabled?: boolean;
    isReadonly?: boolean;
    onClick?: () => void;
    cx?: IHasCX;
    isOpen?: boolean;
    width?: string;
}

export const FilterToolbarItemToggler = React.forwardRef<HTMLDivElement, FilterToolbarItemTogglerProps>((props, ref) => {

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled || props.isReadonly) return;
        e.preventDefault();
        props.onClick?.();
    };

    return (
        <FlexRow
            { ...props }
            rawProps={ { style: { width: `${ (props.width || defaultWidth) + 'px' }` } } }
            cx={ cx(css.root,
                uuiElement.inputBox, uuiMarkers.clickable,
                props.isOpen && uuiMod.opened,
                ["size-" + (props.size || defaultSize)],
                props.cx) }
            onClick={ togglerPickerOpened }
            ref={ ref }
        >
            <FlexRow cx={ css.title }>
                <Text
                    color="gray60"
                    font="sans"
                    size={ props.size || defaultSize }
                    cx={ css.contextLeft }
                >
                    { `${ props.title }:` }
                </Text>
                { props.value?.selected
                    ? props.value?.selected === LOADING
                        ? <Text cx={ css.placeholder }>{ <TextPlaceholder color="gray40"/> }</Text>
                        : <Text
                            color="gray90"
                            font="sans"
                            size={ props.size || defaultSize }
                            cx={ css.contextRight }>&nbsp;&nbsp;{ props.value.selected }</Text>
                    : <Text
                        color="gray90"
                        font="sans"
                        size={ props.size || defaultSize }
                        cx={ css.contextRight }>&nbsp;&nbsp;{ props.value.prefix }</Text>
                }
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