import * as React from 'react';
import { useRef } from "react";
import css from './FilterToolbarItemToggler.scss';
import cx from "classnames";
import { IHasCX, uuiElement, uuiMarkers, uuiMod } from "@epam/uui-core";
import { systemIcons } from "@epam/promo/icons/icons";
import { IconContainer } from "@epam/uui-components";

const defaultSize = "30";
const defaultWidth = "267";

interface FilterToolbarItemTogglerProps {
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

    const toggleContainer = useRef();
    React.useImperativeHandle(ref, () => toggleContainer.current, [toggleContainer.current]);

    const togglerPickerOpened = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.isDisabled || props.isReadonly) return;
        e.preventDefault();
        props.onClick?.();
    };

    return (
        <div
            style={ { width: (props.width || defaultWidth) + 'px' } }
            className={ cx(css.root,
                uuiElement.inputBox, uuiMarkers.clickable,
                props.isOpen && uuiMod.opened,
                props.isReadonly && uuiMod.readonly,
                props.isDisabled && uuiMod.disabled,
                ["size-" + (props.size || defaultSize)],
                props.cx) }
            onClick={ togglerPickerOpened }
            ref={ toggleContainer }
            { ...props }
        >
            <p className={ cx(uuiElement.input) }>
                <span className={ css.selectedTitle }>{ `${ props.title } ${ props.value?.prefix } ` }</span>
                <span className={ css.selected }>{ props.value?.selected ?? '' }</span>
            </p>
            {
                !props.isDisabled &&
                <IconContainer
                    icon={ systemIcons[props.size || defaultSize].foldingArrow }
                    flipY={ props.isOpen }
                    cx="uui-icon-dropdown"
                />
            }
        </div>
    );
});

