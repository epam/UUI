import * as React from 'react';
import { DemoComponentProps } from '@epam/uui-docs';
import {
    Panel,
    LabeledInput,
    TextInput,
    Switch,
    FlexRow,
    RadioGroup,
    ControlSize,
    Button,
    Checkbox,
    FlexCell,
    ControlWrapper,
    CheckboxGroup,
    FlexSpacer,
} from '@epam/promo';
import css from './FormContext.scss';

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
            <Panel shadow cx={css.panel} background="white" margin="24">
                <FlexRow borderBottom padding="24" size="48">
                    <FlexCell grow={1} width="auto">
                        <LabeledInput label="Form size:" labelPosition="left">
                            <ControlWrapper size="36">
                                <RadioGroup
                                    onValueChange={(value: ControlSize) => this.setState({ size: value })}
                                    items={[
                                        { name: '36', id: '36' },
                                        { name: '30', id: '30' },
                                        { name: '24', id: '24' },
                                    ]}
                                    direction="horizontal"
                                    value={this.state.size}
                                />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                    <FlexSpacer />
                    <FlexCell width="auto">
                        <LabeledInput label="Is Invalid" labelPosition="left">
                            <ControlWrapper size="36">
                                <Switch value={this.state.isInvalid} onValueChange={newVal => this.setState({ ...this.state, isInvalid: newVal })} />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell width="auto">
                        <LabeledInput label="is Disabled" labelPosition="left">
                            <ControlWrapper size="36">
                                <Switch
                                    value={this.state.isDisabled}
                                    onValueChange={newVal => this.setState({ ...this.state, isDisabled: newVal })}
                                />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" spacing="12" alignItems="top" vPadding="18" padding="24" topShadow>
                    <LabeledInput size={size} label="Name" {...validationProps}>
                        <TextInput
                            value={this.state.textValue}
                            size={size}
                            isDisabled={this.state.isDisabled}
                            isInvalid={this.state.isInvalid}
                            onValueChange={(newVal: string) => this.setState({ ...this.state, textValue: newVal })}
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow size="36" spacing="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={1}>
                        <LabeledInput size={size} label="Demo Component" {...validationProps}>
                            <ControlWrapper size={size}>
                                <DemoComponent {...props} isInvalid={this.state.isInvalid} isDisabled={this.state.isDisabled} />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>

                <FlexRow size="36" spacing="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={1}>
                        <LabeledInput size={size} label="Country" {...validationProps}>
                            <ControlWrapper size={size}>
                                <TextInput
                                    value={this.state.textValue}
                                    size={size}
                                    isInvalid={this.state.isInvalid}
                                    isDisabled={this.state.isDisabled}
                                    onValueChange={(newVal: string) => this.setState({ ...this.state, textValue: newVal })}
                                />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={1}>
                        <LabeledInput size={size} label="Demo Component">
                            <ControlWrapper size={size}>
                                <DemoComponent {...props} isInvalid={this.state.isInvalid} isDisabled={this.state.isDisabled} />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" spacing="12" alignItems="top" vPadding="18" padding="24">
                    <FlexCell grow={1}>
                        <LabeledInput size={size} label="Demo Component" {...validationProps}>
                            <ControlWrapper size={size}>
                                <DemoComponent {...props} isInvalid={this.state.isInvalid} isDisabled={this.state.isDisabled} />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={1}>
                        <LabeledInput size={size} label="Checkbox group">
                            <ControlWrapper size={size}>
                                <CheckboxGroup
                                    isInvalid={this.state.isInvalid}
                                    isDisabled={this.state.isDisabled}
                                    onValueChange={newValue => this.setState({ checkboxGroupValue: newValue })}
                                    items={[
                                        { name: 'label', id: 1 },
                                        { name: 'label label', id: 2 },
                                        { name: 'label label label label label label label label ', id: 3 },
                                        { name: 'label label label', id: 4 },
                                    ]}
                                    value={this.state.checkboxGroupValue}
                                />
                            </ControlWrapper>
                        </LabeledInput>
                    </FlexCell>
                </FlexRow>
                <FlexRow size="36" spacing="12" alignItems="top" vPadding="18" padding="24">
                    <ControlWrapper size={size}>
                        <Checkbox
                            isInvalid={this.state.isInvalid}
                            isDisabled={this.state.isDisabled}
                            label="Accept License Agreement"
                            onValueChange={newValue => this.setState({ acceptCheckboxValue: newValue })}
                            value={this.state.acceptCheckboxValue}
                        />
                    </ControlWrapper>
                </FlexRow>
                <FlexRow size="36" spacing="12" alignItems="top" vPadding="18" padding="24">
                    <FlexSpacer />
                    <Button size={size} fill="none" color="blue" caption="Cancel" />
                    <Button size={size} color="green" caption="Submit" />
                </FlexRow>
            </Panel>
        );
    }
}
