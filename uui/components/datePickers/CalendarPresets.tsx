import * as React from 'react';
import {
    IHasCX, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import { LinkButton } from '../buttons';

import css from './CalendarPresets.module.scss';

export const uuiPresets = {
    container: 'uui-presets-container',
    header: 'uui-presets-header',
    item: 'uui-presets-item',
} as const;

export type RangeDatePickerPresets = {
    /**
     * Preset config
     */
    [key: string]: {
        /**
         * Name of the preset to display in rangeDatePicker body
         */
        name: React.ReactNode;
        /**
         * A pure function that gets range value which will be applied by preset selection
         */
        getRange: () => RangeDatePickerPresetValue;
    };
};

/**
 * Represents RangeDatePickerPresetValue
 */
export interface RangeDatePickerPresetValue {
    /**
     * Range from value
     */
    from?: string;
    /**
     * Range to value
     */
    to?: string;
    /**
     * Preset order in presets list
     */
    order?: number;
}

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

export function CalendarPresets(props: CalendarPresetsProps): JSX.Element {
    return (
        <div
            ref={ props.forwardedRef }
            className={ cx(uuiPresets.container, css.root, props.cx) }
            { ...props.rawProps }
        >
            <div className={ uuiPresets.header }>Presets</div>
            {getPresets(props.presets).map((item) => (
                <LinkButton key={ item.key } caption={ item.name } onClick={ () => props.onPresetSet(item) } size="24" />
            ))}
        </div>
    );
}
