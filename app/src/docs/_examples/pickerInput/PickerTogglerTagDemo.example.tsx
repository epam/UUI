import React, { useState } from 'react';
import { DataQueryFilter, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { FlexCell, PickerInput, PickerTogglerTag, PickerTogglerTagProps, Tooltip } from '@epam/uui';
import { Location } from '@epam/uui-docs';

export default function PickerTogglerTagDemoExample() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>(['225284', '2747351', '3119841', '3119746']);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                // and since parentId is meaningful value, it is required to exclude it from the filter.
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
            selectAll: false,
        },
        [],
    );

    const renderTag = (props: PickerTogglerTagProps<Location, string>) => {
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
    };

    return (
        <FlexCell width={ 300 }>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                entityName="location"
                selectionMode="multi"
                valueType="id"
                maxItems={ 2 }
                renderTag={ (props) => renderTag(props) }
            />
        </FlexCell>
    );
}
