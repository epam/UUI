import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from '@epam/uui-docs';

const items = Array(100).fill(0).map((_, index) => ({ id: index, name: `Parent ${index}` }));

export default function DatasourceStateVisibleCountExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DatasourceViewer
            exampleTitle={ `visibleCount: ${value1.visibleCount}, topIndex: ${value1.topIndex}` }
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
        />
    );
}
