import * as React from 'react';
import * as uui from '@epam/uui';

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
