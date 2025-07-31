import React, { useState } from 'react';
import { Panel, Tree, VerticalTabButton } from '@epam/uui';
import { DataRowProps, DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { ReactComponent as FolderIcon } from '@epam/assets/icons/content-space-outline.svg';
import { ReactComponent as FileIcon } from '@epam/assets/icons/content-page-outline.svg';

interface ExampleTreeItem {
    id: string;
    name: string;
    parentId?: string;
    type: 'folder' | 'file';
}

const treeData: ExampleTreeItem[] = [
    { id: '1', name: 'Documents', parentId: undefined, type: 'folder' },
    { id: '2', name: 'Getting Started', parentId: '1', type: 'file' },
    { id: '3', name: 'Components', parentId: '1', type: 'folder' },
    { id: '4', name: 'Buttons', parentId: '3', type: 'file' },
    { id: '5', name: 'Inputs', parentId: '3', type: 'file' },
    { id: '6', name: 'Layout', parentId: '3', type: 'folder' },
    { id: '7', name: 'Tree', parentId: '6', type: 'file' },
    { id: '8', name: 'VirtualList', parentId: '6', type: 'file' },
    { id: '9', name: 'Advanced', parentId: '1', type: 'folder' },
    { id: '10', name: 'API Reference', parentId: '9', type: 'file' },
];

export default function CustomRowExample() {
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
        getRowOptions: (item) => ({
            isSelectable: item.type === 'file',
            link: undefined, // No links in this example
        }),
        getSearchFields: (item) => [item.name],
    });

    const renderRow = (row: DataRowProps<ExampleTreeItem, string>) => {
        return (
            <VerticalTabButton
                icon={ row.value.type === 'folder' ? FolderIcon : FileIcon }
                caption={ row.value.name }
                weight="regular"
                onClick={ row.onSelect ? () => row.onSelect(row) : undefined }
                onFold={ () => row.onFold(row) }
                isFolded={ row.isFolded }
                isFoldable={ row.isFoldable }
                indent={ row.indent }
                isActive={ row.isSelected }
            />
        );
    };

    return (
        <Panel background="surface-main" shadow rawProps={ { style: { width: '250px', height: '300px', padding: '6px 0' } } }>
            <Tree<ExampleTreeItem>
                view={ view }
                size="36"
                value={ value }
                onValueChange={ setValue }
                getCaption={ (item) => item.name }
                renderRow={ renderRow }
            />
        </Panel>
    );
}
