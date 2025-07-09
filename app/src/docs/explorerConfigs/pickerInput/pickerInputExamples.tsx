import * as React from 'react';
import * as uui from '@epam/uui';
import { PickerInputProps, PickerTogglerTag, Tooltip } from '@epam/uui';
import { PickerTogglerRenderItemParams } from '@epam/uui-components';
import { IPropSamplesCreationContext } from '@epam/uui-docs';

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

export const renderTagExamples = (ctx: IPropSamplesCreationContext<PickerInputProps<any, any>>) => [
    {
        value: (props: PickerTogglerRenderItemParams<any, any>) => {
            if (props.isCollapsed) {
                // rendering '+ N items selected' Tag, tooltip is present here by default
                return <PickerTogglerTag { ...props } key="collapsed" getName={ (i) => ctx.getSelectedProps().getName(i) } />;
            } else {
                // rendering all other Tags with Tooltip
                const continent = props.rowProps?.value?.tz ? props.rowProps?.value?.tz.split('/')[0].concat('/') : '';
                const country = props.rowProps?.value?.countryName ? props.rowProps?.value?.countryName.concat('/') : '';
                const tooltipContent = `${continent}${country}${props.caption}`;
                return (
                    <Tooltip key={ props.rowProps?.id } content={ tooltipContent }>
                        <PickerTogglerTag { ...props } getName={ (i) => ctx.getSelectedProps().getName(i) } />
                    </Tooltip>
                );
            }
        },
    },
];
