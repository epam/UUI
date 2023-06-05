import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

const items = Array(100).fill(0).map((_, index) => ({ id: index, name: `Parent ${index}` }));

export default function DataSourceStateVisibleCountExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DataSourceViewer
            exampleTitle={ `visibleCount: ${value1.visibleCount}, topIndex: ${value1.topIndex}` }
            value={ value1 }
            onValueChange={ onValueChange1 }
            dataSource={ dataSource1 }
        />
    );
}
