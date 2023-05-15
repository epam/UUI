import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { FlexRow, Panel, TextInput } from '@epam/promo';
import { DatasourceViewer } from './DatasourceViewer';

const items = Array(100).fill(0).map((_, index) => ({
    id: index,
    name: `Record ${index}`,
    description: `Description ${index}`,
}));

export default function ArrayDatasourceSearchExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const datasource = useArrayDataSource({
        items,
        getSearchFields: ({ name, description }) => [name, description],
    }, []);
    
    return (
        <Panel>
            <FlexRow>
                <TextInput
                    placeholder="Search"
                    value={ value.search }
                    onValueChange={ (search) => {
                        onValueChange((state) => ({ ...state, search }));
                    } }
                />
            </FlexRow>
            <FlexRow>
                <DatasourceViewer
                    value={ value }
                    onValueChange={ onValueChange }
                    datasource={ datasource }
                />
            </FlexRow>
        </Panel>
    );
}
