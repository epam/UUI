import React, { useState } from 'react';
import { SuccessNotification, Text } from '@epam/uui';
import { DataSourceState, INotification, useArrayDataSource, useUuiContext } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceTextColumns } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '1.1', name: 'Child 1.1', parentId: '1' },
    { id: '1.2', name: 'Child 1.2', parentId: '1' },
    
    { id: '2', name: 'Parent 2' },
    { id: '2.1', name: 'Child 2.1', parentId: '2' },
    { id: '2.2', name: 'Child 2.2', parentId: '2' },
    
    { id: '3', name: 'Parent 3' },
    { id: '3.2', name: 'Child 3.2', parentId: '3' },
    { id: '3.1', name: 'Child 3.1', parentId: '3' },
];

export default function RowOptionsOnClickExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const { uuiNotifications } = useUuiContext();

    const handleClick = (name: string) => {
        uuiNotifications
            .show(
                (props: INotification) => (
                    <SuccessNotification { ...props }>
                        <Text fontSize="14">
                            {`${name} was clicked`}
                        </Text>
                    </SuccessNotification>
                ),
                { position: 'bot-right', duration: 3 },
            )
            .catch(() => null);
    };

    const dataSource1 = useArrayDataSource({
        items,
        rowOptions: {
            isSelectable: true,
            onClick: (rowProps) => {
                handleClick(rowProps.value.name);
            },
        },
    }, []);

    return (
        <DataSourceTableViewer
            exampleTitle="Handling click on the row"
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource1 }
            columns={ dataSourceTextColumns }
        />
    );
}
