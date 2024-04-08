import React, { useState } from 'react';
import { DataSourceState, IImmutableMap, ItemsMap, SortingOption, useArrayDataSource, useForm } from '@epam/uui-core';
import { DataSourceTableViewer, sortableDataSourceColumns } from '@epam/uui-docs';

interface Item {
    id: string;
    name: string;
    parentId?: string;
}

interface FormState {
    items: IImmutableMap<string, Item>;
}

const items: Record<string, Item> = {
    1: { id: '1', name: 'Parent 1' },
    1.1: { id: '1.1', name: 'Child 1.1', parentId: '1' },
    1.2: { id: '1.2', name: 'Child 1.2', parentId: '1' },
    
    2: { id: '2', name: 'Parent 2' },
    2.1: { id: '2.1', name: 'Child 2.1', parentId: '2' },
    2.2: { id: '2.2', name: 'Child 2.2', parentId: '2' },
    
    3: { id: '3', name: 'Parent 3' },
    3.2: { id: '3.2', name: 'Child 3.2', parentId: '3' },
    3.1: { id: '3.1', name: 'Child 3.1', parentId: '3' },
};

const itemsMap = ItemsMap.fromObject<string, Item>(items, { getId: ({ id }) => id });

const defaultSorting: SortingOption<Item>[] = [{ field: 'name', direction: 'asc' }];

export default function DataSourcePropsPatchFixItemBetweenSortingsExample() {
    const { lens: lens1, value: formValue1 } = useForm<FormState>({
        value: { items: itemsMap },
        onSave: () => Promise.resolve(),
    });

    const { lens: lens2, value: formValue2 } = useForm<FormState>({
        value: { items: itemsMap },
        onSave: () => Promise.resolve(),
    });
    
    const { lens: lens3, value: formValue3 } = useForm<FormState>({
        value: { items: itemsMap },
        onSave: () => Promise.resolve(),
    });

    const [value1, onValueChange1] = useState<DataSourceState<any, string>>({ sorting: defaultSorting });
    const dataSource1 = useArrayDataSource({
        items: Object.values(items),
        patch: formValue1.items,
        getRowOptions: (item) => ({
            ...lens1.prop('items').key(item.id).toProps(),
        }),
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState<any, string>>({ sorting: defaultSorting });
    const dataSource2 = useArrayDataSource({
        items: Object.values(items),
        patch: formValue2.items,
        getRowOptions: (item) => ({
            ...lens2.prop('items').key(item.id).toProps(),
        }),
        fixItemBetweenSortings: true,
    }, []);

    const [value3, onValueChange3] = useState<DataSourceState<any, string>>({ sorting: defaultSorting });
    const dataSource3 = useArrayDataSource({
        items: Object.values(items),
        patch: formValue3.items,
        getRowOptions: (item) => ({
            ...lens3.prop('items').key(item.id).toProps(),
        }),
        fixItemBetweenSortings: false,
    }, []);

    return (
        <>
            <DataSourceTableViewer
                exampleTitle="With fixing rows between sortings by default"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
                columns={ sortableDataSourceColumns }
            />
            <DataSourceTableViewer
                exampleTitle="With fixing rows between sortings"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
                columns={ sortableDataSourceColumns }
            />
            <DataSourceTableViewer
                exampleTitle="Without fixing rows between sortings"
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
                columns={ sortableDataSourceColumns }
            />
        </>
    );
}
