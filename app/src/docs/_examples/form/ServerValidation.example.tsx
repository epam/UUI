import React from 'react';
import { FormSaveResponse, useUuiContext, UuiContexts } from '@epam/uui-core';
import { FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, TextInput, SuccessNotification, useForm } from '@epam/uui';
import type { TApi } from '../../../data';

interface Login {
    email: string;
    password: string;
}

interface ServerResponseExample<T> {
    form?: T;
    error?: {
        name: 'user-exists';
        message: string;
    };
}

export default function ServerValidationExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    async function onSave(formState: Login): Promise<FormSaveResponse<Login>> {
        const response: ServerResponseExample<Login> = await svc.api.form.validateForm(formState);
        if (!response.error) return response;

        // Prefer to return the ICanBeInvalid structure from the server directly, and pass it to the Form as is. Here, we demonstrate how to handle the case when it's not possible. In such cases, you can convert your server-specific errors to the ICanBeInvalid interface on client.
        if (response.error.name === 'user-exists') {
            return {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        email: {
                            isInvalid: true,
                            validationMessage: response.error.message,
                        },
                    },
                },
            };
        }
    }

    const { lens, save, validate } = useForm<Login>({
        value: {
            email: 'Ivan_Ivanov@epam.com',
            password: '',
        },
        onSave,
        onSuccess: () =>
            svc.uuiNotifications.show((props) => (
                <SuccessNotification { ...props }>
                    <Text>Form saved</Text>
                </SuccessNotification>
            )),
        getMetadata: () => ({
            props: {
                email: { isRequired: true },
                password: { isRequired: true },
            },
        }),
    });

    return (
        <FlexCell width="100%">
            <FlexRow vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput label="Email" { ...lens.prop('email').toProps() }>
                        <TextInput placeholder="Email" { ...lens.prop('email').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput label="Password" { ...lens.prop('password').toProps() }>
                        <TextInput placeholder="Password" type="password" { ...lens.prop('password').toProps() } />
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
}
