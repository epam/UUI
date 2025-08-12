import React from 'react';
import type { TApi } from '../../../data';
import { useUuiContext, useAsyncDataSource, UuiContexts } from '@epam/uui-core';
import { FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, TextInput, PickerInput, SuccessNotification, ErrorNotification, useForm } from '@epam/uui';

interface Person {
    firstName?: string;
    lastName?: string;
    countryId?: number | string;
}

export default function BasicFormExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const countriesDataSource = useAsyncDataSource(
        {
            api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r) => r.items),
        },
        [],
    );

    const { lens, save } = useForm<Person>({
        value: {
            firstName: '',
            lastName: '',
        },
        onSave: (person) => Promise.resolve({ form: person }) /* place your save api call here */,
        onSuccess: () =>
            svc.uuiNotifications.show((props) => (
                <SuccessNotification { ...props }>
                    <Text>Form saved</Text>
                </SuccessNotification>
            )),
        onError: () =>
            svc.uuiNotifications.show((props) => (
                <ErrorNotification { ...props }>
                    <Text>Error on save</Text>
                </ErrorNotification>
            )),
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: false },
            },
        }),
        settingsKey: 'basic-form-example',
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
                    <LabeledInput label="Last Name" { ...lens.prop('lastName').toProps() }>
                        <TextInput placeholder="Last Name" { ...lens.prop('lastName').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput label="Country" { ...lens.prop('countryId').toProps() }>
                        <PickerInput { ...lens.prop('countryId').toProps() } selectionMode="single" valueType="id" dataSource={ countriesDataSource } />
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
