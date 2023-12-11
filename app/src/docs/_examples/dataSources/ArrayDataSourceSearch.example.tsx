import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { FlexRow, Panel, TextInput } from '@epam/uui';
import { DataSourceViewer } from '@epam/uui-docs';

const items = Array(100).fill(0).map((_, index) => ({
    id: index,
    name: `Record ${index}`,
    description: `Description ${index}`,
}));

export default function ArrayDataSourceSearchExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource = useArrayDataSource({
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
                <DataSourceViewer
                    value={ value }
                    onValueChange={ onValueChange }
                    dataSource={ dataSource }
                />
            </FlexRow>
        </Panel>
    );
}
