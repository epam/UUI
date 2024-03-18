import React, { useCallback } from 'react';
import { FlexCell, FlexRow, FlexSpacer, Button, LabeledInput, TextInput, useForm, ConfirmationModal } from '@epam/uui';
import { useUuiContext } from '@epam/uui-core';

interface Person {
    firstName?: string;
    lastName?: string;
}

export default function FormLeaveHandlingExample() {
    const context = useUuiContext();
    const beforeLeave = useCallback((): Promise<boolean> => {
        return context.uuiModals.show<boolean>((modalProps) => <ConfirmationModal caption="Custom message about your data may be lost. Do you want to save data?" { ...modalProps } />);
    }, [context.uuiModals]);

    const { lens, save } = useForm<Person>({
        value: {},
        onSave: (person) => Promise.resolve({ form: person }),
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
            },
        }),
        // Override default beforeLeave modal. Pass null, to disable leave with unsaved changes handling.
        beforeLeave: beforeLeave,
        settingsKey: 'my-form-unique-key',

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
                <FlexSpacer />
                <Button caption="Save" onClick={ save } color="primary" />
            </FlexRow>
        </FlexCell>
    );
}
