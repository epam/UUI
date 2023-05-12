import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

const items = Array(100).fill(0).map((_, index) => ({ id: index, name: `Parent ${index}` }));

export default function DatasourceStateVisibleCountExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        indexToScroll: 10,
    });
    const datasource1 = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DatasourceViewer
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
        />
    );
}
