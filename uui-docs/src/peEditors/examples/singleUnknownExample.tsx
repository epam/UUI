import * as React from 'react';
import { RadioInput } from '@epam/uui';
import { IPropDocEditor } from '../../types';

export function SingleUnknownExample(props: IPropDocEditor<unknown>) {
    const { examples, exampleId, onExampleIdChange, name } = props;
    const singleExample = examples[0];
    const isChecked = exampleId !== undefined;
    const handleChange = (newIsChecked: boolean) => {
        onExampleIdChange(newIsChecked ? singleExample.id : undefined);
    };
    return (
        <RadioInput
            name={ name }
            value={ isChecked }
            onValueChange={ handleChange }
            label={ singleExample.name }
        />
    );
}
