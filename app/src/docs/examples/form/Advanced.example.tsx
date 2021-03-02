import * as React from 'react';
import { Metadata, AsyncDataSource, RenderFormProps, INotification, LazyDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, RadioGroup, TextInput, PickerInput, SuccessNotification, ErrorNotification, Form } from "@epam/promo";
import * as undoIcon from '@epam/assets/icons/common/content-edit_undo-18.svg';
import * as redoIcon from '@epam/assets/icons/common/content-edit_redo-18.svg';

interface Person {
    firstName?: string;
    lastName?: string;
    location?: {
        cityIds: string[],
        countryId?: string;
    };
    email?: string;
    sex?: string;

}

interface AdvancedFormExampleState {
    person: Person;
}

export class AdvancedFormExample extends React.Component<any, any> {
    state: AdvancedFormExampleState = {
        person: {},
    };

    getMetaData = (state: Person): Metadata<Person> => {
        return {
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
        };
    }

    countriesDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then(r => r.items),
    });

    citiesDataSource = new LazyDataSource({
        api: (req) => svc.api.demo.cities(req),
    });

    renderForm = (props: RenderFormProps<Person>) => {
        let lens = props.lens;

        return (
            <FlexCell width='100%'>
                <FlexRow vPadding='12' spacing='12' >
                    <Button caption='Revert changes' onClick={ props.revert } isDisabled={ !props.canRevert } fill='white' />
                    <FlexSpacer />
                    <Button icon={ undoIcon } onClick={ props.undo } isDisabled={ !props.canUndo } fill='light' />
                    <Button icon={ redoIcon } onClick={ props.redo } isDisabled={ !props.canRedo } fill='light' />

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
                                dataSource={ this.countriesDataSource }
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
                                dataSource={ this.citiesDataSource }
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
                    <Button caption='Save' onClick={ props.save } color='green' />
                </FlexRow>
            </FlexCell>
        );
    }

    renderSuccessNotification(props: INotification) {
        return (
            <SuccessNotification { ...props }>
                <Text>Form saved</Text>
            </SuccessNotification>
        );
    }

    renderErrorNotification(props: INotification) {
        return (
            <ErrorNotification { ...props }>
                <Text>Error on save</Text>
            </ErrorNotification>
        );
    }

    render() {
        return (
            <Form<Person>
                value={ this.state.person }
                onSave={ person =>  Promise.resolve() /*place your save api call here*/ }
                onSuccess={ result => svc.uuiNotifications.show(this.renderSuccessNotification) }
                onError={ error => svc.uuiNotifications.show(this.renderErrorNotification) }
                renderForm={ this.renderForm }
                getMetadata={ this.getMetaData }
                settingsKey='advanced-form-example'
            />
        );
    }
}
