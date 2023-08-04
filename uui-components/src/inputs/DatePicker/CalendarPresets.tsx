import * as React from 'react';
import {
    IHasCX, cx, IHasRawProps, IHasForwardedRef, RangeDatePickerPresets, RangeDatePickerPresetValue,
} from '@epam/uui-core';

export const uuiPresets = {
    container: 'uui-presets-container',
    header: 'uui-presets-header',
    item: 'uui-presets-item',
} as const;

export interface CalendarPresetsProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    presets: RangeDatePickerPresets;
    onPresetSet: (nV: RangeDatePickerPresetValue) => void;
}

export class CalendarPresets extends React.Component<CalendarPresetsProps> {
    getPresets() {
        const presets = [];

        for (const key in this.props.presets) {
            if (this.props.presets[key]) {
                presets.push({
                    ...this.props.presets[key].getRange(),
                    name: this.props.presets[key].name,
                });
            }
        }

        return presets.sort((a, b) => a.order - b.order);
    }

    render() {
        return (
            <div ref={ this.props.forwardedRef } className={ cx(uuiPresets.container, this.props.cx) } { ...this.props.rawProps }>
                <div className={ uuiPresets.header }>Presets</div>
                {this.getPresets().map((item, index) => (
                    <div key={ index + 'preset' } className={ uuiPresets.item } onClick={ () => this.props.onPresetSet(item) }>
                        {item.name}
                    </div>
                ))}
            </div>
        );
    }
}
