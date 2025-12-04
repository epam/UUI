import React, { useEffect, useState } from 'react';
import { useScrollSpy } from '@epam/uui-components';
import {
    Metadata, IFormApi, useArrayDataSource, useAsyncDataSource, useLazyDataSource,
} from '@epam/uui-core';
import { City } from '@epam/uui-docs';
import {
    Button,
    DatePicker,
    ErrorNotification,
    FlexCell,
    FlexRow,
    FlexSpacer,
    Form,
    LabeledInput,
    PickerInput,
    RadioGroup,
    SuccessNotification,
    Text,
    TextInput,
} from '@epam/promo';
import css from './ScrollSpyForm.module.scss';
import { svc } from '../../services';

interface Person {
    firstName?: string;
    lastName?: string;
    location?: {
        cityIds: string[];
        countryId?: string;
    };
    email?: string;
    sex?: string;
    birthDate?: string;
    motherTongue?: string;
    maritalStatus?: string;
}

export function ScrollSpyForm() {
    const [person] = useState<Person>({});

    const countriesDataSource = useAsyncDataSource(
        {
            api: (options) => svc.api.demo.countries({ sorting: [{ field: 'name' }], signal: options.signal }).then((r) => r.items),
        },
        [],
    );

    const languagesDataSource = useArrayDataSource(
        {
            items: [
                { name: 'English', id: 'English' }, { name: 'Spanish', id: 'Spanish' }, { name: 'Russian', id: 'Russian' },
            ],
        },
        [],
    );

    const maritalStatus = useArrayDataSource(
        {
            items: [{ name: 'Single', id: 'Single' }, { name: 'Married', id: 'Married' }],
        },
        [],
    );

    const getMetaData = (state: Person): Metadata<Person> => ({
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
                    (val) => {
                        return !(val && val.includes('@')) && ['Please enter correct email'];
                    },
                ],
            },
            sex: { isRequired: true },
            birthDate: { isRequired: true },
            motherTongue: { isRequired: true },
            maritalStatus: { isRequired: true },
        },
    });

    const citiesDataSource = useLazyDataSource<City, string, unknown>(
        {
            api: svc.api.demo.cities,
        },
        [],
    );

    function RenderForm({ lens, save, isInvalid }: IFormApi<Person>) {
        const { scrollToElement, setRef } = useScrollSpy({});

        useEffect(() => {
            if (isInvalid) scrollToElement();
        });

        return (
            <section ref={ setRef }>
                <FlexCell width="100%" cx={ css.formContainer }>
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
                            <LabeledInput label="Country" { ...lens.prop('location').prop('countryId').toProps() }>
                                <PickerInput
                                    { ...lens.prop('location').prop('countryId').toProps() }
                                    selectionMode="single"
                                    valueType="id"
                                    dataSource={ countriesDataSource }
                                />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="City" { ...lens.prop('location').prop('cityIds').toProps() }>
                                <PickerInput { ...lens.prop('location').prop('cityIds').toProps() } selectionMode="multi" valueType="id" dataSource={ citiesDataSource } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="Sex" { ...lens.prop('sex').toProps() }>
                                <RadioGroup
                                    name="gender"
                                    items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] }
                                    { ...lens.prop('sex').toProps() }
                                    direction="horizontal"
                                />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="Birth Date" { ...lens.prop('birthDate').toProps() }>
                                <DatePicker { ...lens.prop('birthDate').toProps() } placeholder="Birth Date" format="MM-DD-YYYY" />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="Mother Tongue" { ...lens.prop('motherTongue').toProps() }>
                                <PickerInput { ...lens.prop('motherTongue').toProps() } selectionMode="single" valueType="id" dataSource={ languagesDataSource } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="Marital Status" { ...lens.prop('maritalStatus').toProps() }>
                                <PickerInput { ...lens.prop('maritalStatus').toProps() } selectionMode="single" valueType="id" dataSource={ maritalStatus } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="Email" { ...lens.prop('email').toProps() }>
                                <TextInput placeholder="Email" { ...lens.prop('email').toProps() } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexSpacer />
                        <Button color="red" caption="Validate" onClick={ save } />
                    </FlexRow>
                </FlexCell>
            </section>
        );
    }

    return (
        <Form<Person>
            value={ person }
            onSave={ () => Promise.resolve() /* place your save api call here */ }
            onSuccess={ () =>
                svc.uuiNotifications.show((notificationProps) => (
                    <ErrorNotification { ...notificationProps }>
                        <Text>Error on save</Text>
                    </ErrorNotification>
                )) }
            onError={ () =>
                svc.uuiNotifications.show((notificationProps) => (
                    <SuccessNotification { ...notificationProps }>
                        <Text>Form saved</Text>
                    </SuccessNotification>
                )) }
            renderForm={ (formProps) => <RenderForm { ...formProps } /> }
            getMetadata={ getMetaData }
        />
    );
}
