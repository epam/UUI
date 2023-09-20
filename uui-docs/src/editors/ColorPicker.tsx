import * as React from 'react';
import cx from 'classnames';
import css from './ColorPicker.module.scss';
import { IEditable } from '@epam/uui-core';
import { Tooltip } from '@epam/uui-components';

interface Color {
    value: string;
    hex: string;
}

interface ColorPickerProps extends IEditable<string> {
    colors: Color[];
}

export class ColorPicker extends React.Component<ColorPickerProps, any> {
    getUuiClass = (color: Color) => {
        switch (color.value) {
            case 'white': return 'var(--uui-neutral-0)';
            case 'neutral': return 'var(--uui-neutral-50)';
            default: return `var(--uui-${color.value}-50)`;
        }
    };

    render() {
        return (
            <div className={ css.container }>
                {this.props.colors.map((color: Color) => (
                    <Tooltip cx={ css.tooltip } renderContent={ () => <div className={ css.tooltipContent }>{color.value}</div> } key={ color.value }>
                        <div
                            className={ cx(css.colorItem) }
                            onClick={ () => this.props.onValueChange(color.value) }
                            style={ {
                                borderColor: (this.props.value === color.value && 'white') || color.hex || this.getUuiClass(color),
                                borderWidth: this.props.value === color.value && '2px',
                                backgroundColor: color.hex || this.getUuiClass(color),
                                width: this.props.value === color.value && '14px',
                                height: this.props.value === color.value && '14px',
                                boxShadow: this.props.value === color.value && `0 0 0 1px ${color.hex || this.getUuiClass(color)}`,
                            } }
                        />
                    </Tooltip>
                ))}
            </div>
        );
    }
}
