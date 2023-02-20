import React, { useState } from 'react';
import { DataPickerRow, FlexRow, PickerInput, PickerItem } from '@epam/promo';
import { DataQueryFilter, DataRowProps, DataSourceState, useLazyDataSource, useUuiContext } from '@epam/uui';
import { Location } from '@epam/uui-docs';

export default function LazyTreePicker() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<string[]>();

    const dataSource = useLazyDataSource<Location, string, DataQueryFilter<Location>>(
        {
            api: (request, ctx) => {
                const { search } = request;
                // if search is specified, it is required to search over all the children,
                // and since parentId is meaningful value, it is required to exclude it from the filter.
                const filter = search ? {} : { parentId: ctx?.parentId };
                return svc.api.demo.locations({ ...request, search, filter });
            },
            getId: i => i.id,
            getParentId: i => i.parentId,
            getChildCount: l => l.childCount,
        },
        []
    );

    const getSubtitle = ({ path }: DataRowProps<Location, string>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => value?.name)
            .filter(Boolean)
            .join(' / ');
    };

    return (
        <FlexRow>
            <PickerInput
                dataSource={dataSource}
                value={value}
                onValueChange={onValueChange}
                entityName="location"
                selectionMode="multi"
                valueType="id"
                renderRow={(props: DataRowProps<Location, string>, dataSourceState) => (
                    <DataPickerRow
                        {...props}
                        key={props.rowKey}
                        padding="12"
                        renderItem={item => <PickerItem {...props} title={item.name} subtitle={getSubtitle(props, dataSourceState)} />}
                    />
                )}
            />
        </FlexRow>
    );
}
