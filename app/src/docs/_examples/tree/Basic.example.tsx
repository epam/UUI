import React, { useState } from 'react';
import { Panel, Tree } from '@epam/uui';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';

interface ExampleTreeItem {
    id: string;
    name: string;
    parentId?: string;
}

const treeData: ExampleTreeItem[] = [
    { id: '1', name: 'Documents', parentId: undefined },
    { id: '2', name: 'Getting Started', parentId: '1' },
    { id: '3', name: 'Components', parentId: '1' },
    { id: '4', name: 'Buttons', parentId: '3' },
    { id: '5', name: 'Inputs', parentId: '3' },
    { id: '6', name: 'Layout', parentId: '3' },
    { id: '7', name: 'Tree', parentId: '6' },
    { id: '8', name: 'VirtualList', parentId: '6' },
    { id: '9', name: 'Advanced', parentId: '1' },
    { id: '10', name: 'API Reference', parentId: '9' },
];

export default function BasicTreeExample() {
    const [value, setValue] = useState<DataSourceState>({
        selectedId: '7',
    });

    const dataSource = useArrayDataSource<ExampleTreeItem, string, unknown>(
        {
            items: treeData,
            getId: (item) => item.id,
            isFoldedByDefault: () => false,
        },
        [treeData],
    );

    const view = dataSource.useView(value, setValue, {
        getRowOptions: () => ({
            isSelectable: true,
            link: undefined, // No links in this example
        }),
        getSearchFields: (item) => [item.name],
    });

    return (
        <Panel background="surface-main" shadow rawProps={ { style: { width: '250px', height: '300px' } } }>
            <Tree<ExampleTreeItem>
                view={ view }
                size="36"
                value={ value }
                onValueChange={ setValue }
                getCaption={ (item) => item.name }
            />
        </Panel>
    );
}
