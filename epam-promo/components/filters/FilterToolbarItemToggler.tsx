import * as React from 'react';
import css from './FilterToolbarItemToggler.scss';
import cx from "classnames";
import { IHasCX, uuiElement, uuiMarkers, uuiMod } from "@epam/uui-core";
import { systemIcons } from "../../icons/icons";
import { IconContainer, FlexRow } from "@epam/uui-components";
import { Text } from "../typography";

const defaultSize = "30";
const defaultWidth = "267";

export interface FilterToolbarItemTogglerProps {
    value: { prefix: string, selected: string };
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
                    fontSize="14"
                    lineHeight="18"
                    rawProps={ { style: { textOverflow: 'initial', overflow: 'visible' } } }
                >
                    { `${ props.title } ${ props.value?.prefix }` }
                </Text>
                { props.value?.selected && <Text color="gray90" font="sans" fontSize="14" lineHeight="18">&nbsp;{ props.value.selected }</Text> }
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

