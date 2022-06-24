import * as React from 'react';
import { useRef } from "react";
import css from './FilterToolbarItemToggler.scss';
import cx from "classnames";
import { IHasCX, uuiElement, uuiMarkers, uuiMod } from "@epam/uui-core";
import { systemIcons } from "@epam/promo/icons/icons";
import { IconContainer } from "@epam/uui-components";

const defaultSize = "36";

interface FilterToolbarItemTogglerProps {
    value: string;
    title?: string;
    size?: '24' | '30' | '36' | '42' | '48';
    isDisabled?: boolean;
    isReadonly?: boolean;
    onClick?: () => void;
    cx?: IHasCX;
    isOpen?: boolean;
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
            <input
                type="text"
                className={ cx(uuiElement.input) }
                disabled={ props.isDisabled }
                readOnly={ true }
                value={ `${ props.title }: ${ props.value ?? '' }` }
            />
            <IconContainer
                icon={ systemIcons[props.size || defaultSize].foldingArrow }
                flipY={ props.isOpen }
                cx='uui-icon-dropdown'
            />
        </div>
    );
});

