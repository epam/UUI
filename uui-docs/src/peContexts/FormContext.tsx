import * as React from 'react';
import { DemoComponentProps } from '../types';
import {
    Panel,
    LabeledInput,
    TextInput,
    Switch,
    FlexRow,
    RadioGroup,
    Button,
    Checkbox,
    FlexCell,
    CheckboxGroup,
    FlexSpacer,
} from '@epam/uui';
import css from './FormContext.module.scss';

type ControlSize = '24' | '30' | '36' | '42' | '48';

interface FormContextState {
    textValue: string;
    isInvalid: boolean;
    isDisabled: boolean;
    size: ControlSize;
    checkboxGroupValue: number[];
    acceptCheckboxValue: boolean;
}

export class FormContext extends React.Component<DemoComponentProps, FormContextState> {
    public static displayName = 'Form';
    state = {
        textValue: '',
        isInvalid: false,
        isDisabled: false,
        size: '36' as ControlSize,
        checkboxGroupValue: [] as number[],
        acceptCheckboxValue: false,
    };

    render() {
        const { size } = this.state;
        const { DemoComponent, props } = this.props;
        const validationProps = {
            isInvalid: this.state.isInvalid,
            validationMessage: 'This field is mandatory',
        };

        return (
            <Panel shadow cx={ css.panel } background="surface-main" margin="24">
                <FlexRow borderBottom padding="24" size="48">
                    <FlexCell grow={ 1 } width="auto">
                        <LabeledInput label="Form size:" labelPosition="left" size="36">
                            <RadioGroup
                                name="sizes"
                                onValueChange={ (value: ControlSize) => this.setState({ size: value }) }
                                items={ [
                                    { name: '36', id: '36' }, { name: '30', id: '30' }, { name: '24', id: '24' },
                                ] }
                                direction="horizontal"
                                value={ this.state.size }
                            />
                        </LabeledInput>
                    </FlexCell>
                    <FlexSpacer />
                    <FlexCell width="auto">
                        <LabeledInput label="Is Invalid" labelPosition="left" size="36">
                            <Switch value={ this.state.isInvalid } onValueChange={ (newVal) => this.setState({ ...this.state, isInvalid: newVal }) } />
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell width="auto">
                        <LabeledInput label="is Disabled" labelPosition="left" size="36">
                            <Switch value={ this.state.isDisabled } onValueChange={ (newVal) => this.setState({ ...this.state, isDisabled: newVal }) } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" columnGap="12" alignItems="top" vPadding="18" padding="24" topShadow>
                    <LabeledInput size={ size } label="Name" { ...validationProps }>
                        <TextInput
                            value={ this.state.textValue }
                            size={ size }
                            isDisabled={ this.state.isDisabled }
                            isInvalid={ this.state.isInvalid }
                            onValueChange={ (newVal: string) => this.setState({ ...this.state, textValue: newVal }) }
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow size="36" columnGap="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={ 1 }>
                        <LabeledInput size={ size } label="Demo Component" { ...validationProps }>
                            <DemoComponent { ...props } isInvalid={ this.state.isInvalid } isDisabled={ this.state.isDisabled } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" columnGap="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={ 1 }>
                        <LabeledInput size={ size } label="Country" { ...validationProps }>
                            <TextInput
                                value={ this.state.textValue }
                                size={ size }
                                isInvalid={ this.state.isInvalid }
                                isDisabled={ this.state.isDisabled }
                                onValueChange={ (newVal: string) => this.setState({ ...this.state, textValue: newVal }) }
                            />
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <LabeledInput size={ size } label="Demo Component">
                            <DemoComponent { ...props } isInvalid={ this.state.isInvalid } isDisabled={ this.state.isDisabled } />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" columnGap="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={ 1 }>
                        <LabeledInput size={ size } label="Demo Component" { ...validationProps }>
                            <DemoComponent { ...props } isInvalid={ this.state.isInvalid } isDisabled={ this.state.isDisabled } />
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <LabeledInput size={ size } label="Checkbox group">
                            <CheckboxGroup
                                isInvalid={ this.state.isInvalid }
                                isDisabled={ this.state.isDisabled }
                                onValueChange={ (newValue) => this.setState({ checkboxGroupValue: newValue }) }
                                items={ [
                                    { name: 'label', id: 1 }, { name: 'label label', id: 2 }, { name: 'label label label label label label label label ', id: 3 }, { name: 'label label label', id: 4 },
                                ] }
                                value={ this.state.checkboxGroupValue }
                            />
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" columnGap="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={ 1 }>
                        <Checkbox
                            isInvalid={ this.state.isInvalid }
                            isDisabled={ this.state.isDisabled }
                            label="Accept License Agreement"
                            onValueChange={ (newValue) => this.setState({ acceptCheckboxValue: newValue }) }
                            value={ this.state.acceptCheckboxValue }
                        />
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" columnGap="12" alignItems="top" vPadding="18" padding="24">
                    <FlexSpacer />
                    <Button size={ size } color="secondary" fill="outline" caption="Cancel" />
                    <Button size={ size } color="accent" fill="solid" caption="Submit" />
                </FlexRow>
            </Panel>
        );
    }
}
