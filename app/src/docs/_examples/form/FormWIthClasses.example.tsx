import React from 'react';
import { FlexCell, FlexRow, LabeledInput, TextInput, Form, Text, SuccessNotification, ErrorNotification, FlexSpacer, Button } from '@epam/uui';
import { IFormApi, useUuiContext } from '@epam/uui-core';

interface Person {
    firstName?: string;
    lastName?: string;
}

export default function FormWIthClassesExample() {
    const svc = useUuiContext();

    const getMetadata = () => ({
        props: {
            firstName: { isRequired: true },
            lastName: { isRequired: true },
        },
    });

    const renderForm = ({ lens, save, validate }: IFormApi<Person>) => (
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
            <FlexRow vPadding="12" columnGap="12">
                <FlexSpacer />
                <Button caption="Validate" onClick={ validate } color="primary" fill="outline" />
                <Button caption="Save" onClick={ save } color="primary" />
            </FlexRow>
        </FlexCell>
    );

    return (
        <Form
            onSave={ (person) => Promise.resolve({ form: person }) /* place your save api call here */ }
            onSuccess={ () =>
                svc.uuiNotifications.show((props) => (
                    <SuccessNotification { ...props }>
                        <Text>Form saved</Text>
                    </SuccessNotification>
                )) }
            onError={ () =>
                svc.uuiNotifications.show((props) => (
                    <ErrorNotification { ...props }>
                        <Text>Error on save</Text>
                    </ErrorNotification>
                )) }
            value={ {} }
            getMetadata={ getMetadata }
            renderForm={ renderForm }
            settingsKey="legacy-form-example"
        />
    );
}
