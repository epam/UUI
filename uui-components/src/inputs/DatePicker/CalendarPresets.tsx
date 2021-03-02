import * as React from 'react';
import { IHasCX } from '@epam/uui';
import cx from 'classnames';
import * as css from './CalendarPresets.scss';

export const uuiPresets = {
    container: 'uui-presets-container',
    header: 'uui-presets-header',
    item: 'uui-presets-item',
};

type PresetValue = {
    from: string,
    to: string,
    order?: number,
};

export type Presets = {
    [key: string]: {
        name: string,
        getRange: () => PresetValue,
    },
};

export interface CalendarPresetsProps extends IHasCX {
    presets: Presets;
    onPresetSet: (nV: PresetValue) => any;
}

export class CalendarPresets extends React.Component<CalendarPresetsProps, any> {

    render() {
        let presets = [];
        for (let key in this.props.presets) {
            this.props.presets[key] && presets.push({...this.props.presets[key].getRange(), name: this.props.presets[key].name});
        }

        presets.sort((a: PresetValue, b: PresetValue) => {
            return a.order - b.order;
        });

        return (
            <div className={ cx(css.container, uuiPresets.container, this.props.cx) }>
                <div className={ uuiPresets.header }>Presets</div>
                { presets.map(item => <div key={ item.name } className={ uuiPresets.item } onClick={ () => this.props.onPresetSet(item) }>{ item.name }</div>) }
            </div>
        );
    }
}