import * as React from 'react';
import cx from 'classnames';
import css from './ColorPicker.module.scss';
import { IEditable } from '@epam/uui-core';
import { Tooltip } from '@epam/uui-components';
import { Button } from '@epam/uui';

interface Color {
    value: string;
    hex?: string;
}

interface ColorPickerProps extends IEditable<string> {
    colors: Color[];
}

export function ColorPicker(props: ColorPickerProps) {
    const { colors, onValueChange, value } = props;

    const renderColor = (color: Color) => {
        const isSelectedColor = value === color.value;
        const isUnknownColor = typeof color.hex === 'undefined' || color.hex === '';
        const renderUnknownColor = () => {
            return (
                <Button
                    fill={ isSelectedColor ? 'solid' : 'outline' }
                    size="18"
                    cx={ css.colorItemUnknown }
                    caption={ color.value }
                    onClick={ () => onValueChange(color.value) }
                />
            );
        };
        const renderKnownColor = () => {
            const style: React.CSSProperties = {
                backgroundColor: color.hex,
            };
            if (isSelectedColor) {
                style.boxShadow = `0 0 0 1px ${color.hex}`;
            } else {
                style.borderColor = color.hex;
            }
            return (
                <div
                    className={ cx(css.colorItem, css.colorItemSelected, `uui-color-${color.value}`) }
                    onClick={ () => onValueChange(color.value) }
                    style={ style }
                />
            );
        };

        return (
            <Tooltip
                cx={ css.tooltip }
                renderContent={ () => <div className={ css.tooltipContent }>{ color.value }</div> }
                key={ color.value }
            >
                {
                    isUnknownColor ? renderUnknownColor() : renderKnownColor()
                }
            </Tooltip>
        );
    };

    return (
        <div className={ css.container }>
            {colors.map(renderColor)}
        </div>
    );
}
