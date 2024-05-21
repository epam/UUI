import * as React from 'react';
import * as uui from '@epam/uui';
import { PickerTogglerTag, PickerTogglerTagProps, Tooltip } from '@epam/uui';

type TRenderTogglerParam = Parameters<uui.PickerInputProps<any, any>['renderToggler']>[0];

export const renderTogglerExamples = [
    {
        name: 'Button',
        value: (props: TRenderTogglerParam) => {
            return <uui.Button { ...props } caption={ props.selection.map((s) => s.value.name).join(', ') } />;
        },
    },
    {
        name: 'LinkButton',
        value: (props: TRenderTogglerParam) => {
            return <uui.LinkButton { ...props } caption={ props.selection.map((s) => s.value.name).join(', ') } />;
        },
    },
    {
        name: 'Search',
        value: (props: TRenderTogglerParam) => {
            return <uui.SearchInput value="" onValueChange={ null } { ...props } />;
        },
    },
];

export const renderTagExamples = [
    {
        value: (props: PickerTogglerTagProps<any, any>) => {
            if (props.isCollapsed) {
                // rendering '+ N items selected' Tag, tooltip is present here by default
                return <PickerTogglerTag { ...props } key="collapsed" />;
            } else {
                // rendering all other Tags with Tooltip
                const tooltipContent = props.rowProps?.value?.tz ? `${props.rowProps?.value?.tz}/${props.caption}` : `${props.caption}`;
                return (
                    <Tooltip key={ props.rowProps?.id } content={ tooltipContent }>
                        <PickerTogglerTag { ...props } />
                    </Tooltip>
                );
            }
        },
    },
];
