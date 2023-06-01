import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource, useForm } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceTextColumns } from '@epam/uui-docs';

interface Item {
    id: string;
    name: string;
    parentId?: string;
}

interface FormState {
    items: Item[];
}

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '2', name: 'Parent 2' },
    { id: '3', name: 'Parent 3' },
];

export default function RowOptionsDndExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const {
        value, onValueChange,
    } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
    });

    const dataSource1 = useArrayDataSource({
        items: value.items,
        getRowOptions: (item, dstIndex) => ({
            dnd: {
                srcData: item,
                dstData: item,
                onDrop: (data) => {
                    const srcIndex = value.items.findIndex((i) => i === data.srcData);
                    const indexToPaste = data.position === 'top' ? dstIndex : dstIndex + 1;
                    const newItems = [...value.items];
                    const indexToRemove = srcIndex > indexToPaste ? srcIndex + 1 : srcIndex;
        
                    newItems.splice(indexToPaste, 0, data.srcData);
                    newItems.splice(indexToRemove, 1);

                    onValueChange({ items: newItems });
                },
                canAcceptDrop: () => ({
                    top: true,
                    bottom: true,
                }),
            },
    
        }),
    }, []);

    return (
        <DataSourceTableViewer
            exampleTitle="Drag'n'drop handling"
            value={ value1 }
            onValueChange={ onValueChange1 }
            dataSource={ dataSource1 }
            columns={ dataSourceTextColumns }
        />
    );
}
