import React from 'react';
import { FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, TextInput, useForm, Checkbox } from '@epam/uui';

interface Person {
    fullName?: string;
    idNumber?: string;
    withoutIdNumber?: boolean;
}

const emptyUser = {
    fullName: '',
    idNumber: '',
};

export default function ComplexFormValidationExample() {
    const { lens, save } = useForm<Person[]>({
        value: [emptyUser],
        onSave: (formValue) => Promise.resolve({ form: formValue }) /* place your save api call here */,
        getMetadata: () => ({
            all: {
                props: {
                    fullName: { isRequired: true },
                    idNumber: {
                        validators: [
                            (value, user) => [!user.withoutIdNumber && !value && 'This field is mandatory'],
                            (value, user) => [!user.withoutIdNumber && (value.length > 8 || value.length < 5) && 'Please enter valid ID number'],
                        ],
                    },
                },
            },
        }),
    });

    const renderUser = (user: Person, index: number) => {
        const userLens = lens.index(index);
        return (
            <div key={ index }>
                <Text size="42" fontWeight="600">{`User ${index + 1}`}</Text>
                <FlexRow vPadding="12">
                    <FlexCell grow={ 1 }>
                        <LabeledInput label="First Name" { ...userLens.prop('fullName').toProps() }>
                            <TextInput placeholder="First Name" { ...userLens.prop('fullName').toProps() } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow vPadding="12">
                    <FlexCell grow={ 1 }>
                        <LabeledInput label="ID number" { ...userLens.prop('idNumber').toProps() }>
                            <TextInput placeholder="ID number" { ...userLens.prop('idNumber').toProps() } />
                        </LabeledInput>
                        <FlexRow vPadding="12">
                            <Checkbox { ...userLens.prop('withoutIdNumber').toProps() } label="Don't have ID?" />
                        </FlexRow>
                    </FlexCell>
                </FlexRow>

            </div>
        );
    };

    return (
        <FlexCell width="100%">
            { lens.get().map(renderUser) }
            <FlexRow>
                <Button caption="Add user" onClick={ () => lens.update((current) => [...current, emptyUser]) } color="primary" fill="outline" />
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexSpacer />
                <Button caption="Save" onClick={ save } color="primary" />
            </FlexRow>
        </FlexCell>
    );
}
