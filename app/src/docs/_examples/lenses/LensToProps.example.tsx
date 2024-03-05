import React from 'react';
import { LabeledInput, TextInput, useForm } from '@epam/uui';

interface User {
    firstName?: string;
    lastName?: string;
}

export default function BasicFormExample() {
    const { lens } = useForm<User>({
        value: {},
        onSave: (person) => Promise.resolve({ form: person }),
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
            },
        }),
    });

    return (
        <LabeledInput label="First Name" { ...lens.prop('firstName').toProps() }>
            <TextInput placeholder="First Name" { ...lens.prop('firstName').toProps() } />
        </LabeledInput>
    );
}
