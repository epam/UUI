import * as React from 'react';
import * as types from '../types';
import { Tag, TagProps } from '../widgets';
import { PickerTogglerRenderItemParams } from '@epam/uui-components';

export interface PickerTogglerTagProps<TItem, TId> extends PickerTogglerRenderItemParams<TItem, TId>, TagProps {
    /** Defines component size */
    size?: types.ControlSize;
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

export const PickerTogglerTag = /* @__PURE__ */React.forwardRef((props: PickerTogglerTagProps<any, any>, ref: React.Ref<HTMLElement>) => {
    const tagProps = {
        ...props,
        tabIndex: -1,
        size: getPickerTogglerButtonSize(props.size),
    };

    return <Tag ref={ ref } { ...tagProps } />;
});
