import React, { useState, ReactNode } from 'react';
import { Metadata, RenderFormProps, INotification, useUuiContext, useAsyncDataSource, useLazyDataSource } from "@epam/uui";
import { FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, RadioGroup, TextInput, PickerInput, SuccessNotification, ErrorNotification, Form } from "@epam/promo";
import * as undoIcon from '@epam/assets/icons/common/content-edit_undo-18.svg';
import * as redoIcon from '@epam/assets/icons/common/content-edit_redo-18.svg';

type Person = {
    firstName?: string;
    lastName?: string;
    email?: string;
    sex?: string;
    location?: {
        cityIds: string[],
        countryId?: string;
    };
};

export default function AdvancedFormExample() {
    const svc = useUuiContext();
    const [person] = useState<Person>({});

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
        },
    });

    const countriesDataSource = useAsyncDataSource({
        api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r: any) => r.items),
    }, []);

    const citiesDataSource = useLazyDataSource({
        api: (req) => svc.api.demo.cities(req)
    }, []);

    const renderForm = ({ lens, canRedo, canUndo, canRevert, undo, redo, revert, save }: RenderFormProps<Person>): ReactNode => (
        <FlexCell width='100%'>
            <FlexRow vPadding='12' spacing='12' >
                <Button caption='Revert changes' onClick={ revert } isDisabled={ !canRevert } fill='white' />
                <FlexSpacer />
                <Button icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } fill='light' />
                <Button icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } fill='light' />

            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexCell grow={ 1 }>
                    <LabeledInput label='First Name' { ...lens.prop('firstName').toProps() } >
                        <TextInput placeholder='First Name' { ...lens.prop('firstName').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexCell grow={ 1 }>
                    <LabeledInput label='Last Name' { ...lens.prop('lastName').toProps() }>
                        <TextInput placeholder='Last Name' { ...lens.prop('lastName').toProps() }/>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexCell grow={ 1 }>
                    <LabeledInput label='Country' { ...lens.prop('location').prop('countryId').toProps() } >
                        <PickerInput
                            { ...lens.prop('location').prop('countryId').toProps() }
                            selectionMode='single'
                            valueType='id'
                            dataSource={ countriesDataSource }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexCell grow={ 1 }>
                    <LabeledInput label='City' { ...lens.prop('location').prop('cityIds').toProps() } >
                        <PickerInput
                            { ...lens.prop('location').prop('cityIds').toProps() }
                            selectionMode='multi'
                            valueType='id'
                            dataSource={ citiesDataSource }
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexCell grow={ 1 }>
                    <LabeledInput label='Email' { ...lens.prop('email').toProps() } >
                        <TextInput placeholder='Email' { ...lens.prop('email').toProps() } />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexCell grow={ 1 }>
                    <LabeledInput label='Sex' { ...lens.prop('sex').toProps() }>
                        <RadioGroup
                            items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] }
                            { ...lens.prop('sex').toProps() }
                            direction='horizontal'
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12'>
                <FlexSpacer />
                <Button caption='Save' onClick={ save } color='green' />
            </FlexRow>
        </FlexCell>
    );

    const renderSuccessNotification = (props: INotification): ReactNode => (
        <SuccessNotification { ...props }>
            <Text>Form saved</Text>
        </SuccessNotification>
    );

    const renderErrorNotification = (props: INotification): ReactNode => (
        <ErrorNotification { ...props }>
            <Text>Error on save</Text>
        </ErrorNotification>
    );

    return (
        <Form<Person>
            value={person}
            onSave={person => Promise.resolve() /*place your save api call here*/ }
            onSuccess={result => svc.uuiNotifications.show(renderSuccessNotification) }
            onError={error => svc.uuiNotifications.show(renderErrorNotification)}
            renderForm={renderForm}
            getMetadata={getMetaData}
            settingsKey='advanced-form-example'
        />
    );
}
