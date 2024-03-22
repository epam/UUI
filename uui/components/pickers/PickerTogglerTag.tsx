import * as React from 'react';
import * as types from '../types';
import { Tag, TagProps } from '../widgets';
import { Tooltip } from '../overlays';

export interface PickerTogglerTagProps extends TagProps {
    size?: types.ControlSize;
    collapsedNames?: string;
    isCollapsed?: boolean;
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

export function PickerTogglerTag(props: PickerTogglerTagProps) {
    const tagProps = {
        ...props,
        tabIndex: -1,
        size: getPickerTogglerButtonSize(props.size),
    };

    if (props.isCollapsed && props.collapsedNames?.length) {
        return (
            <Tooltip content={ props.collapsedNames } openDelay={ 400 }>
                <Tag { ...tagProps } />
            </Tooltip>
        );
    }

    return <Tag { ...tagProps } />;
}
