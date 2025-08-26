import React, { useState } from 'react';
import { Panel, Tree, VerticalTabButton } from '@epam/uui';
import { DataRowProps, DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { ReactComponent as FolderIcon } from '@epam/assets/icons/content-space-outline.svg';
import { ReactComponent as FileIcon } from '@epam/assets/icons/content-page-outline.svg';
import { treeData, ExampleTreeItem } from './treeData';

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
                key={ row.key }
                size="36"
                icon={ row.value.type === 'folder' ? FolderIcon : FileIcon }
                caption={ row.value.name }
                weight="regular"
                onClick={ row.onSelect ? () => row.onSelect(row) : undefined }
                onFold={ row.onFold ? () => row.onFold(row) : undefined }
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
