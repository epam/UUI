import * as React from 'react';
import * as types from '../types';
import { Tag, TagProps } from '../widgets';
import { DataRowProps } from '@epam/uui-core';

export interface PickerTogglerTagProps<TItem, TId> extends TagProps {
    /** Defines component size */
    size?: types.ControlSize;
    /** If this is true, then the PickerTogglerTag will be an additional tag with the number of collapsed elements in the caption. */
    isCollapsed?: boolean;
    /** Defines row props (see more: uui-components/src/pickers/PickerToggler.tsx PickerTogglerProps<TItem = any, TId = any>) */
    rowProps?: DataRowProps<TItem, TId>;
}

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

export const PickerTogglerTag = React.forwardRef((props: PickerTogglerTagProps<any, any>, ref: React.Ref<HTMLElement>) => {
    const tagProps = {
        ...props,
        tabIndex: -1,
        size: getPickerTogglerButtonSize(props.size),
    };

    return <Tag ref={ ref } { ...tagProps } />;
});
