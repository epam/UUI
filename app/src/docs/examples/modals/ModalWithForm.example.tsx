import * as React from 'react';
import { IModal, INotification, Metadata, RenderFormProps, AsyncDataSource, UuiContexts, uuiContextTypes } from '@epam/uui';
import { ModalBlocker, ModalWindow, FlexSpacer, ModalHeader, FlexRow, LabeledInput, TextInput, Button, ScrollBars, ModalFooter, SuccessNotification,
    Text, Panel, FlexCell, ControlWrapper, RadioGroup, PickerInput, Form } from '@epam/promo';
import { svc } from '../../../services';

interface Person {
    firstName?: string;
    lastName?: string;
    countryId?: number | string;
    sex?: string;
}

interface ModalWithFormExampleState {
    person: Person;
}

class ModalWithFormExample extends React.Component<IModal<Person>> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    state: ModalWithFormExampleState = {
        person: {},
    };

    getMetaData = (state: Person): Metadata<Person> => {
        return {
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: true },
                sex: { isRequired: true },
            },
        };
    }

    countriesDataSource = new AsyncDataSource({
        api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then(r => r.items),
    });

    renderForm = (props: RenderFormProps<Person>) => {
        let lens = props.lens;

        return <>
            <Panel>
                <FlexRow padding='24' vPadding='12'>
                    <FlexCell grow={ 1 }>
                        <LabeledInput label='First Name' { ...lens.prop('firstName').toProps() } >
                            <TextInput placeholder='First Name' { ...lens.prop('firstName').toProps() } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding='24' vPadding='12'>
                    <FlexCell grow={ 1 }>
                        <LabeledInput label='Last Name' { ...lens.prop('lastName').toProps() }>
                            <TextInput placeholder='Last Name' { ...lens.prop('lastName').toProps() }/>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow padding='24' vPadding='12'>
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
                <FlexRow padding='24' vPadding='12'>
                    <FlexCell grow={ 1 }>
                        <LabeledInput label='Sex' { ...lens.prop('sex').toProps() }>
                            <ControlWrapper size='36'>
                                <RadioGroup
                                    items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] }
                                    { ...lens.prop('sex').toProps() }
                                    direction='horizontal'
                                />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
            </Panel>
            <ModalFooter borderTop >
                <FlexSpacer />
                <Button color='gray50' fill='white' onClick={ () => this.handleLeave().then(this.props.abort) } caption='Cancel' />
                <Button color='green' caption='Confirm' onClick={ () => props.save() } />
            </ModalFooter>
        </>;
    }

    handleLeave() {
        return this.context.uuiLocks.acquire(() => Promise.resolve());
    }

    render() {
        return (
            <ModalBlocker { ...this.props } abort={ () => this.handleLeave().then(this.props.abort) }>
                <ModalWindow >
                    <ModalHeader borderBottom title="New committee" onClose={ this.props.abort } />
                    <ScrollBars>
                        <Form<Person>
                            value={ this.state.person }
                            onSave={ (person) => Promise.resolve({form: person}) }
                            onSuccess={ (person) => this.props.success(person) }
                            renderForm={ this.renderForm }
                            getMetadata={ this.getMetaData }
                        />
                        <FlexSpacer />
                    </ScrollBars>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

export class ModalWithFormExampleToggler extends React.Component<any, any> {
    render() {
        return (
            <Button
                caption='Show modal'
                onClick={ () => svc.uuiModals.show((props) => <ModalWithFormExample { ...props }/>).then((person) => {
                    svc.uuiNotifications.show((props: INotification) =>
                        <SuccessNotification { ...props } >
                            <Text>Data has been saved!</Text>
                            <Text>Person: { JSON.stringify(person) }</Text>
                        </SuccessNotification>, { duration: 2 });
                })
                }
            />
        );
    }
}
