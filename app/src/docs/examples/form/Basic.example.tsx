import * as React from 'react';
import { Metadata, AsyncDataSource, RenderFormProps, INotification } from "@epam/uui";
import { svc } from "../../../services";
import { FlexCell, FlexRow, FlexSpacer, Text, Button, LabeledInput, RadioGroup, TextInput,
    PickerInput, SuccessNotification, ErrorNotification, Form,
} from "@epam/promo";

interface Person {
    firstName?: string;
    lastName?: string;
    countryId?: number | string;
    sex?: string;
}

interface BasicFormExampleState {
    person: Person;
}

export class BasicFormExample extends React.Component<any, any> {
    state: BasicFormExampleState = {
        person: {},
    };

    getMetaData = (state: Person): Metadata<Person> => {
        return {
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: false },
                sex: { isRequired: true },
            },
        };
    }

    countriesDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then(r => r.items),
    });

    renderForm = (props: RenderFormProps<Person>) => {
        let lens = props.lens;

        return (
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
                                dataSource={ this.countriesDataSource }
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
                onSave={ (person) => Promise.resolve({form: person}) /*place your save api call here*/ }
                onSuccess={ result => svc.uuiNotifications.show(this.renderSuccessNotification) }
                onError={ error => svc.uuiNotifications.show(this.renderErrorNotification) }
                renderForm={ this.renderForm }
                getMetadata={ this.getMetaData }
                settingsKey='basic-form-example'
            />
        );
    }
}
