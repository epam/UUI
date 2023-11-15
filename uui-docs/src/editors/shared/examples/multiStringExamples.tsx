import * as React from 'react';
import { PickerInput } from '@epam/uui';
import { ArrayDataSource } from '@epam/uui-core';
import { ISharedPropEditor } from '../../../types';

export function MultiStringExamples(props: ISharedPropEditor<string>) {
    const { examples, name, onExampleIdChange, exampleId } = props;
    const ds = new ArrayDataSource({ items: examples, getId: (i) => i.id });

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
