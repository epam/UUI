import * as React from 'react';
import { RadioInput } from '@epam/uui';
import { IPropDocEditor } from '../../types';

export function SingleUnknownExample(props: IPropDocEditor) {
    const { examples, exampleId, onExampleIdChange } = props;
    const singleExample = examples[0];
    const isChecked = exampleId !== undefined;
    const handleChange = (newIsChecked: boolean) => {
        onExampleIdChange(newIsChecked ? singleExample.id : undefined);
    };
    return (
        <RadioInput
            value={ isChecked }
            onValueChange={ handleChange }
            size="18"
            label={ singleExample.name }
        />
    );
}
