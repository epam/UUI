import React, { useState } from 'react';
import {
    DataPickerRow, FlexCell, PickerInput, PickerItem,
} from '@epam/promo';
import {
    DataQueryFilter, DataRowProps, DataSourceState, useLazyDataSource, useUuiContext,
} from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function LazyTreePicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>();

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                if (search && ctx.parentId) { // >1 level, search
                    return Promise.resolve({ items: ctx.parent.children });
                } else if (search) {
                    const tree = svc.api.demo.locationsSearch({ ...request, search });
                    return tree;
                }

                const filter = { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, filter });
            },
            cascadeSelection: true,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );

    const getSubtitle = ({ path }: DataRowProps<Location, string>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => value?.name)
            .filter(Boolean)
            .join(' / ');
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
                cascadeSelection="explicit"
                renderRow={ (props: DataRowProps<Location, string>, dataSourceState) => (
                    <DataPickerRow
                        { ...props }
                        key={ props.rowKey }
                        padding="12"
                        renderItem={ (item) => <PickerItem { ...props } title={ item.name } subtitle={ getSubtitle(props, dataSourceState) } /> }
                    />
                ) }
            />
        </FlexCell>
    );
}
