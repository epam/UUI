import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

const items = Array(100).fill(0).map((_, index) => ({ id: index, name: `Record ${index}` }));

export default function ArrayDataSourceDataExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DataSourceViewer
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
        />
    );
}
