import * as React from 'react';
import cx from 'classnames';
import css from './ColorPicker.module.scss';
import { IEditable } from '@epam/uui-core';
import { Tooltip } from '@epam/uui-components';

interface Color {
    value: string;
    hex?: string;
}

interface ColorPickerProps extends IEditable<string> {
    colors: Color[];
}

export class ColorPicker extends React.Component<ColorPickerProps, any> {
    render() {
        return (
            <div className={ css.container }>
                {this.props.colors.map((color: Color) => (
                    <Tooltip cx={ css.tooltip } renderContent={ () => <div className={ css.tooltipContent }>{color.value}</div> } key={ color.value }>
                        <div
                            className={ cx(css.colorItem, `uui-color-${color.value}`) }
                            onClick={ () => this.props.onValueChange(color.value) }
                            style={ {
                                borderColor: (this.props.value === color.value && 'white') || color.hex || 'var(--uui-color-50)',
                                borderWidth: this.props.value === color.value && '2px',
                                backgroundColor: color.hex || 'var(--uui-color-50)',
                                width: this.props.value === color.value && '14px',
                                height: this.props.value === color.value && '14px',
                                boxShadow: this.props.value === color.value && `0 0 0 1px ${color.hex || 'var(--uui-color-50)'}`,
                            } }
                        />
                    </Tooltip>
                ))}
            </div>
        );
    }
}
