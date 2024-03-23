import * as React from 'react';
import * as types from '../types';
import { Tag, TagProps } from '../widgets';
import { Tooltip } from '../overlays';
import { DataRowProps } from '@epam/uui-core';

export type PickerTogglerTagProps<TItem, TId> = TagProps & {
    /** Defines component size */
    size?: types.ControlSize;
    /** If this is true, then the PickerTogglerTag will be an additional tag with the number of collapsed elements in the caption. */
    isCollapsed?: boolean;
    /** Defines content for tooltip */
    tooltipContent?: string;
    /** Defines row props (see more: uui-components/src/pickers/PickerToggler.tsx PickerTogglerProps<TItem = any, TId = any>) */
    rowProps?: DataRowProps<TItem, TId>;
};

const getPickerTogglerButtonSize = (propSize?: types.ControlSize):TagProps['size'] => {
    switch (propSize) {
        case '48':
            return '42';
        case '42':
            return '36';
        case '36':
            return '30';
        case '30':
            return '24';
        case '24':
            return '18';
        default:
            return '30';
    }
};

export function PickerTogglerTag(props: PickerTogglerTagProps<any, any>): JSX.Element {
    const tagProps = {
        ...props,
        tabIndex: -1,
        size: getPickerTogglerButtonSize(props.size),
    };

    return (props.tooltipContent)
        ? (
            <Tooltip content={ props.tooltipContent } openDelay={ 400 }>
                <Tag { ...tagProps } />
            </Tooltip>
        )
        : <Tag { ...tagProps } />;
}
