import React from 'react';
import type { TApi } from '../../../data';
import { useUuiContext, UuiContexts } from '@epam/uui-core';
import {
    FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, TextInput, SuccessNotification,
    ErrorNotification, useForm, Checkbox,
} from '@epam/uui';

interface Person {
    firstName?: string;
    withError?: boolean;
}

export default function HandleSuccessSaveAndErrorExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const { lens, save } = useForm<Person>({
        value: {},
        onSave: (formData) =>
            formData.withError
                ? Promise.reject(new Error('Error during save'))
                : Promise.resolve({ form: formData }),
        onSuccess: () =>
            svc.uuiNotifications.show((props) => (
                <SuccessNotification { ...props }>
                    <Text>Form saved</Text>
                </SuccessNotification>
            )),
        onError: (error) =>
            svc.uuiNotifications.show((props) => (
                <ErrorNotification { ...props }>
                    <Text>{ error.message }</Text>
                </ErrorNotification>
            )),
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
            },
        }),
    });

    return (
        <FlexCell width="100%">
            <FlexRow vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput label="First Name" { ...lens.prop('firstName').toProps() }>
                        <TextInput placeholder="First Name" { ...lens.prop('firstName').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput label="Save with error?">
                        <Checkbox { ...lens.prop('withError').toProps() } label="Save with error?" />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexSpacer />
                <Button caption="Save" onClick={ save } color="primary" />
            </FlexRow>
        </FlexCell>
    );
}
