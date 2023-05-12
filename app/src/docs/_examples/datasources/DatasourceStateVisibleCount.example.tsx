import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

const items = Array(100).fill(0).map((_, index) => ({ id: index, name: `Parent ${index}` }));

export default function DatasourceStateVisibleCountExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        topIndex: 10,
        visibleCount: 10,
    });
    const datasource1 = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DatasourceViewer
            exampleTitle="Without search"
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
        />
    );
}
