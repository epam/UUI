import React, { useState } from 'react';
import { DataSourceViewer } from '@epam/uui-docs';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';

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

export default function DataSourcePropsShowSelectedOnlyExample() {
    const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);

    const [value, onValueChange] = useState<DataSourceState>({ checked: ['1'] });
    const dataSource = useArrayDataSource({
        items,
        rowOptions: { checkbox: { isVisible: true } },
        showSelectedOnly,
    }, []);

    return (
        <DataSourceViewer
            exampleTitle={ showSelectedOnly ? 'Selected rows only.' : 'All rows.\nPress "Show only selected rows" to see selected ones.' }
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
            showSelectedOnly={ showSelectedOnly }
            onShowSelectedOnlyChange={ () => setShowSelectedOnly(!showSelectedOnly) }
        />
    );
}
