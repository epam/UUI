import * as React from 'react';
import { PickerTogglerRenderItemParams } from '@epam/uui-components';
import { Overwrite } from '@epam/uui-core';
import type { ControlSize } from '../types';
import { Tag, TagProps } from '../widgets/Tag';
import { Tooltip } from '../overlays';
import { TextPlaceholder } from '../typography';
import { settings } from '../../settings';

import css from './PickerTogglerTag.module.scss';

export interface PickerTogglerTagModsOverride {}

interface PickerTogglerTagMods {
    /** Defines component size */
    size?: ControlSize;
}

export interface PickerTogglerTagProps<TItem, TId> extends Overwrite<PickerTogglerTagMods, PickerTogglerTagModsOverride>, PickerTogglerRenderItemParams<TItem, TId>, Omit<TagProps, 'size'> {
    getName: (item: TItem) => string;
}

export const PickerTogglerTag = React.forwardRef((props: PickerTogglerTagProps<any, any>, ref: React.Ref<HTMLElement>) => {
    const tagProps = {
        ...props,
        tabIndex: -1,
        size: settings.pickerInput.sizes.toggler.tagMap[props.size],
        caption: props.rowProps?.isLoading ? <TextPlaceholder /> : props.caption,
    };

    if (props.isCollapsed) {
        const collapsedRows = props.collapsedRows.map((row) => props.getName(row.value)).join(', ');
        return (
            <Tooltip
                key="selected"
                content={ collapsedRows }
                closeDelay={ 150 }
                closeOnMouseLeave="boundary"
                cx={ css.tooltip }
            >
                <Tag ref={ ref } rawProps={ { role: 'option' } } { ...tagProps } cx={ css.noShrink } />
            </Tooltip>
        );
    } else {
        return <Tag ref={ ref } rawProps={ { role: 'option' } } { ...tagProps } />;
    }
});
