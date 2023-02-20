import React from 'react';
import { FlexCell, FlexRow, LabeledInput, TextInput, Form, Text, SuccessNotification, ErrorNotification, FlexSpacer, Button } from '@epam/promo';
import { IFormApi } from '@epam/uui';
import { svc } from '../../../services';

interface Person {
    firstName?: string;
    lastName?: string;
}

export default function FormWIthClassesExample() {
    const getMetadata = () => ({
        props: {
            firstName: { isRequired: true },
            lastName: { isRequired: true },
        },
    });

    const renderForm = ({ lens, save, validate }: IFormApi<Person>) => (
        <FlexCell width="100%">
            <FlexRow vPadding="12">
                <FlexCell grow={1}>
                    <LabeledInput label="First Name" {...lens.prop('firstName').toProps()}>
                        <TextInput placeholder="First Name" {...lens.prop('firstName').toProps()} />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell grow={1}>
                    <LabeledInput label="Last Name" {...lens.prop('lastName').toProps()}>
                        <TextInput placeholder="Last Name" {...lens.prop('lastName').toProps()} />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12" spacing="12">
                <FlexSpacer />
                <Button caption="Validate" onClick={validate} color="blue" />
                <Button caption="Save" onClick={save} color="green" />
            </FlexRow>
        </FlexCell>
    );

    return (
        <Form
            onSave={person => Promise.resolve({ form: person }) /* place your save api call here */}
            onSuccess={result =>
                svc.uuiNotifications.show(props => (
                    <SuccessNotification {...props}>
                        <Text>Form saved</Text>
                    </SuccessNotification>
                ))
            }
            onError={error =>
                svc.uuiNotifications.show(props => (
                    <ErrorNotification {...props}>
                        <Text>Error on save</Text>
                    </ErrorNotification>
                ))
            }
            value={{}}
            getMetadata={getMetadata}
            renderForm={renderForm}
            settingsKey="legacy-form-example"
        />
    );
}
