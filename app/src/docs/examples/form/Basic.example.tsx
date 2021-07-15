import React, { ReactNode, useState } from 'react';
import { Metadata, AsyncDataSource, RenderFormProps, INotification, useUuiContext } from "@epam/uui";
import {
    FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, RadioGroup, TextInput,
    PickerInput, SuccessNotification, ErrorNotification, Form,
} from "@epam/promo";

interface Person {
    firstName?: string;
    lastName?: string;
    countryId?: number | string;
    sex?: string;
}

export default function BasicFormExample() {
    const svc = useUuiContext();
    const [person] = useState<Person>({});

    const getMetaData = (state: Person): Metadata<Person> => {
        return {
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: false },
                sex: { isRequired: true },
            },
        };
    }

    const countriesDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r: any) => r.items),
    });

    const renderForm = ({ lens, save }: RenderFormProps<Person>): ReactNode => (
        <FlexCell width='100%'>
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
                    <LabeledInput label='Country' { ...lens.prop('countryId').toProps() } >
                        <PickerInput
                            { ...lens.prop('countryId').toProps() }
                            selectionMode='single'
                            valueType='id'
                            dataSource={ countriesDataSource }
                        />
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
            value={ person }
            onSave={ (person) => Promise.resolve({form: person}) /*place your save api call here*/ }
            onSuccess={ result => svc.uuiNotifications.show(renderSuccessNotification) }
            onError={ error => svc.uuiNotifications.show(renderErrorNotification) }
            renderForm={ renderForm }
            getMetadata={ getMetaData }
            settingsKey='basic-form-example'
        />
    );
}
