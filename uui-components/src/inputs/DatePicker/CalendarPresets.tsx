import React from 'react';
import css from './CalendarPresets.scss';
import { IHasCX, cx, IHasRawProps, RangeDatePickerPresets, RangeDatePickerPresetValue } from "@epam/uui";

export const uuiPresets = {
    container: 'uui-presets-container',
    header: 'uui-presets-header',
    item: 'uui-presets-item',
};

export interface CalendarPresetsProps extends IHasCX, IHasRawProps<HTMLDivElement> {
    presets: RangeDatePickerPresets;
    onPresetSet: (nV: RangeDatePickerPresetValue) => any;
}

export class CalendarPresets extends React.Component<CalendarPresetsProps, any> {

    render() {
        let presets = [];
        for (let key in this.props.presets) {
            this.props.presets[key] && presets.push({...this.props.presets[key].getRange(), name: this.props.presets[key].name});
        }

        presets.sort((a: RangeDatePickerPresetValue, b: RangeDatePickerPresetValue) => {
            return a.order - b.order;
        });

        return (
            <div className={ cx(css.container, uuiPresets.container, this.props.cx) } { ...this.props.rawProps } >
                <div className={ uuiPresets.header }>Presets</div>
                { presets.map(item => <div key={ item.name } className={ uuiPresets.item } onClick={ () => this.props.onPresetSet(item) }>{ item.name }</div>) }
            </div>
        );
    }
}