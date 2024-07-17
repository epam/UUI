import * as React from 'react';
import { PickerInput } from '@epam/uui';
import { useArrayDataSource } from '@epam/uui-core';
import { IPropDocEditor } from '../../types';

export function MultiStringExamples(props: IPropDocEditor<string>) {
    const { examples, name, onExampleIdChange, exampleId } = props;
    const ds = useArrayDataSource({ items: examples, getId: (i) => i.id }, []);

    return (
        <PickerInput
            size="24"
            dataSource={ ds }
            selectionMode="single"
            value={ exampleId }
            onValueChange={ (id) => onExampleIdChange(id) }
            valueType="id"
            entityName={ name }
            placeholder="Please select value"
        />
    );
}
