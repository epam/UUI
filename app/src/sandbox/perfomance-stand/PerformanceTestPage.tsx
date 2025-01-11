import React, { useState, useMemo } from 'react';
import { FlexRow, DatePicker } from '@epam/uui';
// import { LazyDataSourceApiRequest, useLazyDataSource } from '@epam/uui-core';
// import { Person } from '@epam/uui-docs';
// import { svc } from '../../services';

export function PerformanceTestPage() {
    const [componentValue, componentOnValueChange] = useState<any>();
    // const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
    //     return svc.api.demo.persons(request);
    // }, []);

    // const dataSource = useLazyDataSource({ api: loadPersons, selectAll: false }, []);

    const renderTestedComponent = () => {
        // return (
        //     <PickerInput
        //         dataSource={ dataSource }
        //         value={ componentValue }
        //         onValueChange={ componentOnValueChange }
        //         valueType="id"
        //         selectionMode="multi"
        //     />
        // );

        return (
            <DatePicker
                value={ componentValue }
                onValueChange={ componentOnValueChange }
            />
        );
    };

    const gridArray = useMemo(() => new Array(30).fill(new Array(8).fill(undefined)), []);

    return (
        <div>
            { gridArray.map((row) => {
                return (
                    <FlexRow>
                        { row.map((cell: any, idx: number) => (
                            <div key={ idx }> 
                                { renderTestedComponent() }
                            </div>
                        )) }
                    </FlexRow>
                );
            }) }
        </div>
    );
}
