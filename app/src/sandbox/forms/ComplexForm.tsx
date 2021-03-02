import * as React from 'react';
import * as css from './ComplexForm.scss';
import { LabeledInput, Button, Switch, FlexRow, FlexCell, Panel, Text, FlexSpacer, SuccessNotification, Form, MultiSwitch } from '@epam/loveship';
import { svc } from '../../services';
import { INotification } from '@epam/uui';
import { Metadata } from '@epam/uui';

import { RenderFormProps } from '@epam/uui';
import { PersonDetails } from '@epam/uui-docs';
import { PersonDetailEditor } from './PersonDetailEditor';
import { PersonDetailView } from './PersonDetailView';
import { Spinner } from '@epam/uui-components';

interface ComplexFormState {
    person: PersonDetails;
    hasBackground: boolean;
    isDisabled: boolean;
    isReadOnly: boolean;
    isEditMode: boolean;
    isBlocked: boolean;
}

export class ComplexForm extends React.Component<any, ComplexFormState> {
    state: ComplexFormState = {
        person: {},
        hasBackground: true,
        isDisabled: false,
        isReadOnly: false,
        isEditMode: true,
        isBlocked: true,
    };

    componentDidMount() {
        this.loadForm();
    }

    loadForm() {
        this.setState({ isBlocked: true });
        svc.api.demo.personDetails.load().then(person => this.setState({
            person,
            isBlocked: false,
        }));
    }

    loadDefaultPerson() {
        this.setState({ isBlocked: true });
        svc.api.demo.personDetails.loadDefault().then(person => this.setState({
            person,
            isBlocked: false,
        }));
    }

    getMetaData = (state: PersonDetails): Metadata<PersonDetails> => {
        return {
            isReadonly: this.state.isReadOnly,
            isDisabled: this.state.isDisabled,
            props: {
                firstName: { isRequired: true },
                middleName: {},
                lastName: { isRequired: true },
                countryId: { isRequired: true },
                timeValue: { isRequired: true },
                experience: {
                    all: {
                        props: {
                            experienceName: { maxLength: 20, isRequired: true },
                            startRange: { isRequired: true },
                            endRange: { isRequired: true },
                        },
                    },
                },
                birthdayDate: { isRequired: true },
                vacDays: { minValue: 1, maxValue: 30 },
                rangeDateValue: { isRequired: true },
                bracket: { isRequired: true },
                sex: { isRequired: true },
                roles: {
                    validators: [
                        (roles) => [(!roles || roles.length < 1) && "Please specify at least one role"],
                    ],
                },
                rating: { isRequired: true },
                notes: { isRequired: true },
            },
        };
    }

    renderSettings(props: RenderFormProps<PersonDetails>) {
        return <>
            <FlexCell width='auto'>
                <MultiSwitch
                    items={ [{ id: 'Edit', caption: 'Edit' }, { id: 'isDisabled', caption: 'Disabled' }, { id: 'isReadOnly', caption: 'ReadOnly' }] }
                    value={ this.state.isDisabled ? 'isDisabled' : this.state.isReadOnly ? 'isReadOnly' : 'Edit' }
                    onValueChange={ (val: string) => val === 'Edit' ? this.setState({ isDisabled: false, isReadOnly: false }) : val === 'isDisabled' ? this.setState({ isDisabled: true, isReadOnly: false }) : this.setState({ isReadOnly: true, isDisabled: false }) }
                    color='sky'
                    size='24'
                />
            </FlexCell>
            <FlexCell width='auto'>
                <LabeledInput label='Have background' labelPosition='left'>
                    <Switch isDisabled={ this.state.isDisabled } value={ this.state.hasBackground } onValueChange={ (newVal: boolean) => this.setState({ ...this.state, hasBackground: newVal }) } />
                </LabeledInput>
            </FlexCell>
            <FlexCell width='auto'>
                <LabeledInput label='View mode' labelPosition='left'>
                    <Switch value={ !this.state.isEditMode } onValueChange={ (newVal: boolean) => this.setState({ ...this.state, isEditMode: !newVal }) } />
                </LabeledInput>
            </FlexCell>
            { props.isChanged && <FlexCell width='auto'>
                <Text color="night700">Form was changed</Text>
            </FlexCell> }
        </>;
    }

    renderSavePanel(props: RenderFormProps<PersonDetails>) {
        return <>
            <FlexCell minWidth={ 100 }>
                <Button
                    onClick={ () => props.save() }
                    isDisabled={ this.state.isDisabled || !props.isChanged }
                    caption='Save'
                    color='grass'
                />
            </FlexCell>
            <FlexCell minWidth={ 100 }>
                <Button caption='Undo' color='night500' isDisabled={ !props.canUndo } onClick={ props.undo } />
            </FlexCell>
            <FlexCell minWidth={ 100 }>
                <Button caption='Redo' color='night500' isDisabled={ !props.canRedo } onClick={ props.redo } />
            </FlexCell>
            <FlexCell minWidth={ 100 }>
                <Button caption='Revert' color='sun' fill='none' isDisabled={ !props.canRevert } onClick={ props.revert } />
            </FlexCell>
            <FlexCell minWidth={ 100 }>
                <Button caption='Reload' color='lavanda'
                    onClick={ () => this.loadForm() }
                />
            </FlexCell>
            <FlexCell minWidth={ 100 }>
                <Button caption='Load default' color='fire'
                    onClick={ () => this.loadDefaultPerson }
                />
            </FlexCell>
            <FlexCell minWidth={ 100 }>
                <Button caption='Clear' fill='none' color='fire' isDisabled={ this.state.isDisabled }
                    onClick={ () => this.setState({ person: {} }) }
                />
            </FlexCell>
        </>;
    }

    renderForm = (props: RenderFormProps<PersonDetails>) => {
        const background = this.state.hasBackground ? 'white' : 'night50';

        return (
            <Panel margin='24' background={ background } cx={ css.formPanel }>
                <FlexRow size='48' padding='24'>
                    <Text size='48' font='sans-semibold'>Complex Form</Text>
                    <FlexSpacer />
                    { this.renderSavePanel(props) }
                </FlexRow>
                <FlexRow type='panel' padding='24' background='night50'>
                    { this.renderSettings(props) }
                </FlexRow>
                { this.state.isEditMode ? this.renderEditForm(props) : this.renderViewForm(props) }
            </Panel>
        );
    }

    renderViewForm = (props: RenderFormProps<PersonDetails>) => {
        return <PersonDetailView isBlocked={ this.state.isBlocked } lens={ props.lens } isDisabled={ this.state.isDisabled } value={ props.value } />;
    }

    renderEditForm = (props: RenderFormProps<PersonDetails>) => {
        let lens = props.lens;

        return <PersonDetailEditor isBlocked={ this.state.isBlocked || props.isInProgress } lens={ props.lens } isDisabled={ this.state.isDisabled } isReadOnly={ this.state.isReadOnly } />;
    }

    render() {
        return (
            this.state.isBlocked
                ? <Spinner />
                : <Form<PersonDetails>
                    settingsKey='complex-form'
                    value={ this.state.person }
                    onSave={ async (person) => {
                        const result = await svc.api.demo.personDetails.save(person);
                        return {form: result};
                    } }
                    onSuccess={ (person) => {
                        this.setState({ person: person });
                        svc.uuiNotifications.show((props: INotification) =>
                            <SuccessNotification { ...props } >
                                <Text size="24" font='sans' fontSize='14'>Data has been saved!</Text>
                            </SuccessNotification>, { duration: 2 });
                    } }
                    renderForm={ this.renderForm }
                    getMetadata={ this.getMetaData }
                />
        );
    }
}