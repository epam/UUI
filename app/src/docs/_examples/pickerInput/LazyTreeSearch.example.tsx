import React, { useState } from 'react';
import {
    DataPickerRow, FlexCell, FlexRow, PickerInput, PickerItem,
} from '@epam/promo';
import {
    DataQueryFilter, DataRowProps, DataSourceState, useLazyDataSource, useUuiContext,
} from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function LazyTreeSearch() {
    const svc = useUuiContext();
    const [value1, onValueChange1] = useState<string[]>();
    const [value2, onValueChange2] = useState<string[]>();

    const dataSource1 = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            cascadeSelection: false,
            flattenSearchResults: true,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );
    
    const dataSource2 = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
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
            cascadeSelection: false,
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
        <FlexCell width={ 612 }>
            <FlexRow spacing="12">

                <PickerInput
                    dataSource={ dataSource1 }
                    value={ value1 }
                    onValueChange={ onValueChange1 }
                    entityName="location"
                    selectionMode="multi"
                    valueType="id"
                    placeholder="Flatten search results"
                    renderRow={ (props: DataRowProps<Location, string>, dataSourceState) => (
                        <DataPickerRow
                            { ...props }
                            key={ props.rowKey }
                            padding="12"
                            renderItem={ (item) => (
                                <PickerItem
                                    { ...props }
                                    dataSourceState={ dataSourceState }
                                    title={ item.name }
                                    subtitle={ getSubtitle(props, dataSourceState) }
                                />
                            ) }
                        />
                    ) }
                />
                <PickerInput
                    dataSource={ dataSource2 }
                    value={ value2 }
                    onValueChange={ onValueChange2 }
                    entityName="location"
                    selectionMode="multi"
                    valueType="id"
                    placeholder="Tree search results"
                />
            </FlexRow>
        </FlexCell>
    );
}
