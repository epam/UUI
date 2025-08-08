import React, { useState } from 'react';
import { Panel, Tree } from '@epam/uui';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { treeData, ExampleTreeItem } from './treeData';

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
        <Panel background="surface-main" shadow rawProps={ { style: { width: '250px', height: '300px', padding: '6px 0' } } }>
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
