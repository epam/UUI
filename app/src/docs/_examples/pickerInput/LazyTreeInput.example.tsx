import React, { useState } from 'react';
import { DataPickerRow, FlexCell, PickerInput, PickerItem } from '@epam/uui';
import { DataQueryFilter, DataRowProps, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Location } from '@epam/uui-docs';

export default function LazyTreePicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>([]);

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            cascadeSelection: true,
            flattenSearchResults: true,
            getId: (i) => i.id,
            getParentId: (i) => i.parentId,
            getChildCount: (l) => l.childCount,
        },
        [],
    );

    const getSubtitle = ({ path }: DataRowProps<Location, string>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value: v }) => v?.name)
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
                        renderItem={ (item, rowProps) => (
                            <PickerItem 
                                { ...props }
                                { ...rowProps } 
                                title={ item.name }
                                dataSourceState={ dataSourceState }
                                subtitle={ getSubtitle(props, dataSourceState) } 
                            />
                        ) }
                    />
                ) }
            />
        </FlexCell>
    );
}
