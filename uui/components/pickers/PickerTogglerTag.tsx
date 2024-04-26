import * as React from 'react';
import { Tag, TagProps } from '../widgets';
import { Tooltip } from '../overlays';
import { PickerTogglerRenderItemParams } from '@epam/uui-components';
import css from './PickerTogglerTag.module.scss';

export interface PickerTogglerTagProps<TItem, TId> extends PickerTogglerRenderItemParams<TItem, TId>, TagProps {}

export const PickerTogglerTag = React.forwardRef((props: PickerTogglerTagProps<any, any>, ref: React.Ref<HTMLElement>) => {
    const tagProps = {
        ...props,
        tabIndex: -1,
    };

    if (props.isCollapsed) {
        const collapsedRows = props.collapsedRows.map((row) => row.value?.name).join(', ');
        return (
            <Tooltip
                key="selected"
                content={ collapsedRows }
                closeDelay={ 150 }
                closeOnMouseLeave="boundary"
                cx={ css.tooltip }
            >
                <Tag ref={ ref } { ...tagProps } size="inherit" />
            </Tooltip>
        );
    } else {
        return <Tag ref={ ref } { ...tagProps } size="inherit" />;
    }
});
