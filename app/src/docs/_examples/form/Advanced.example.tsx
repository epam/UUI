import React from 'react';
import type { TApi } from '../../../data';
import { Metadata, useUuiContext, useAsyncDataSource, useLazyDataSource, UuiContexts } from '@epam/uui';
import {
    useForm,
    FlexCell,
    FlexRow,
    FlexSpacer,
    Text,
    Button,
    LabeledInput,
    TextInput,
    PickerInput,
    SuccessNotification,
    ErrorNotification,
} from '@epam/promo';
import { ReactComponent as UndoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as RedoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';

type Person = {
    firstName?: string;
    lastName?: string;
    email?: string;
    location?: {
        cityIds: string[];
        countryId?: string;
    };
};

export default function AdvancedFormExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const getMetadata = (state: Person): Metadata<Person> => ({
        props: {
            firstName: { isRequired: true },
            lastName: { isRequired: true },
            location: {
                props: {
                    countryId: { isRequired: true },
                    cityIds: { isDisabled: !state.location?.countryId },
                },
            },
            email: {
                validators: [
                    val => {
                        return !(val && val.includes('@')) && ['Please enter correct email'];
                    },
                ],
            },
        },
    });

    const { lens, canRedo, canUndo, canRevert, undo, redo, revert, save } = useForm<Person>({
        value: {},
        onSave: person => Promise.resolve() /*place your save api call here*/,
        onSuccess: result =>
            svc.uuiNotifications.show(props => (
                <SuccessNotification {...props}>
                    <Text>Form saved</Text>
                </SuccessNotification>
            )),
        onError: error =>
            svc.uuiNotifications.show(props => (
                <ErrorNotification {...props}>
                    <Text>Error on save</Text>
                </ErrorNotification>
            )),
        getMetadata,
        settingsKey: 'advanced-form-example',
    });

    const countriesDataSource = useAsyncDataSource(
        {
            api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then(r => r.items),
        },
        []
    );

    const citiesDataSource = useLazyDataSource(
        {
            api: svc.api.demo.cities,
        },
        []
    );

    return (
        <FlexCell width="100%">
            <FlexRow vPadding="12" spacing="12">
                <Button caption="Revert changes" onClick={revert} isDisabled={!canRevert} fill="white" />
                <FlexSpacer />
                <Button icon={UndoIcon} onClick={undo} isDisabled={!canUndo} fill="light" />
                <Button icon={RedoIcon} onClick={redo} isDisabled={!canRedo} fill="light" />
            </FlexRow>
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
            <FlexRow vPadding="12">
                <FlexCell grow={1}>
                    <LabeledInput label="Country" {...lens.prop('location').prop('countryId').toProps()}>
                        <PickerInput
                            {...lens.prop('location').prop('countryId').toProps()}
                            selectionMode="single"
                            valueType="id"
                            dataSource={countriesDataSource}
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell grow={1}>
                    <LabeledInput label="City" {...lens.prop('location').prop('cityIds').toProps()}>
                        <PickerInput
                            {...lens.prop('location').prop('cityIds').toProps()}
                            selectionMode="multi"
                            valueType="id"
                            dataSource={citiesDataSource}
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexCell grow={1}>
                    <LabeledInput label="Email" {...lens.prop('email').toProps()}>
                        <TextInput placeholder="Email" {...lens.prop('email').toProps()} />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding="12">
                <FlexSpacer />
                <Button caption="Save" onClick={save} color="green" />
            </FlexRow>
        </FlexCell>
    );
}
