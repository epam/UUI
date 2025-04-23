import * as React from 'react';
import cx from 'classnames';
import type {
    IHasCX, IHasRawProps, IHasForwardedRef, RangeDatePickerPresets, RangeDatePickerPresetValue,
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

const getPresets = (presets: RangeDatePickerPresets) => {
    return Object.keys(presets).map((key) => ({
        ...presets[key].getRange(),
        name: presets[key].name,
        key,
    })).sort((a, b) => a.order - b.order);
};

export function CalendarPresets(props: CalendarPresetsProps) {
    return (
        <div
            ref={ props.forwardedRef }
            className={ cx(uuiPresets.container, props.cx) }
            { ...props.rawProps }
        >
            <div className={ uuiPresets.header }>Presets</div>
            {getPresets(props.presets).map((item) => (
                <div
                    key={ item.key }
                    className={ uuiPresets.item }
                    onClick={ () => props.onPresetSet(item) }
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}
