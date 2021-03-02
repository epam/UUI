import * as React from 'react';
import * as css from './ComplexForm.scss';
import { Panel, FlexRow, FlexCell, LabeledInput, ControlWrapper, RadioGroup, CheckboxGroup, Rating, Slider, RangeSlider, Blocker, Text } from '@epam/loveship';
import { ILens } from '@epam/uui';
import { ExperienceEditor } from './ExperienceEditor';

interface PersonDetailViewProps{
    lens: ILens<any>;
    isDisabled: boolean;
    isBlocked: boolean;
    value: any;
}

export class PersonDetailView extends React.Component<PersonDetailViewProps>{

    render(){
        return <div className={css.horizontal}>
        <Panel>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput label='First Name' >
                        <Text>{this.props.value.firstName}</Text>
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1}>
                    <LabeledInput label='Country' >
                        <Text>{this.props.value.countryId}</Text>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput label='Middle Name'>
                        <Text>{this.props.value.middleName}</Text>
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1} minWidth={100}>
                    <LabeledInput label='Birthday date'>
                        <Text>{this.props.value.birthdayDate}</Text>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput label='Last Name'>
                        <Text>{this.props.value.lastName}</Text>
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1}>
                    <LabeledInput label='Time'>
                        <Text>
                            {this.props.value.timeValue && this.props.value.timeValue.hours}
                            :{this.props.value.timeValue && this.props.value.timeValue.minutes}
                        </Text>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput label='Sex' {...this.props.lens.prop('sex').toProps()}>
                        <ControlWrapper size='36'>
                            <RadioGroup
                                items={[{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }]}
                                {...this.props.lens.prop('sex').toProps()}
                                direction='horizontal'
                                isDisabled={true}
                            />
                        </ControlWrapper>
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1}>
                    <LabeledInput label='Role' {...this.props.lens.prop('roles').toProps()}>
                        <ControlWrapper size='36' cx={css.control}>
                            <CheckboxGroup
                                {...this.props.lens.prop('roles').toProps()}
                                isDisabled={true}
                                items={[{ id: 'Admin', name: 'Admin' }, { id: 'User', name: 'User' }]}
                                direction='horizontal'
                            />
                        </ControlWrapper>
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1}>
                    <LabeledInput label='Rating' {...this.props.lens.prop('rating').toProps()} >
                        <ControlWrapper size='36' cx={css.control}>
                            <Rating isDisabled={true} {...this.props.lens.prop('rating').toProps()} />
                        </ControlWrapper>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput label='Notes'>
                        <Text>{this.props.value.notes}</Text>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </Panel>
        <Panel>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput label='Vacation days'>
                        <Text>{this.props.value.vacDays}</Text>
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1}>
                    <LabeledInput label='Vacation range'>
                        <FlexRow>
                            <Text>{this.props.value.rangeDateValue && this.props.value.rangeDateValue.from}</Text>
                            <Text>{this.props.value.rangeDateValue && this.props.value.rangeDateValue.to}</Text>
                        </FlexRow>
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow type='form'>
                <FlexCell grow={1}>
                    <LabeledInput
                        label='Slider'
                        {...this.props.lens.prop('vacDays').toProps()}
                    >
                        <Slider isDisabled={true} min={0} max={40} step={1}
                            {...this.props.lens.prop('vacDays').toProps()}
                        />
                    </LabeledInput>
                </FlexCell>
                <FlexCell grow={1}>
                    <LabeledInput
                        label='Range'
                        {...this.props.lens.prop('bracket').toProps()}
                    >
                        <RangeSlider
                            isDisabled={true}
                            min={-12}
                            max={13}
                            step={7}
                            {...this.props.lens.prop('bracket').toProps()}
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <ExperienceEditor
                {...this.props.lens.prop("experience").toProps()}
                isDisabled={true}
            />
        </Panel>
    </div>
    }
}