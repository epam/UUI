import React, { useState } from 'react';
import { useForm } from '@epam/uui';
import {
    Button, Checkbox, Switch, TextInput, SuccessNotification, ErrorNotification, Text, LabeledInput, Panel,
    FlexRow, FlexCell, FlexSpacer, RadioGroup, ScrollBars, IconButton,
} from '@epam/uui-v';
import { TabButton, FlexRow as PromoFlexRow } from '@epam/promo';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import * as themeCss from '../../theme.scss';


interface Person {
    firstName?: string;
    lastName?: string;
    gender?: string;
    visaRecords?: Array<{ country?: string, term?: { from: string, to: string } }>;
    processingPersonalDataAgreed?: boolean;
    displayAdsAgreed?: boolean;
}

export const ThemeDemo = () => {
    const [theme, setTheme] = useState<{ name: string, type: 'light' | 'dark', link?: string }>({ name: 'promo', type: 'light' });

    const { lens, save } = useForm<Person>({
        value: { visaRecords: [{
            country: '',
            term: {
                from: '',
                to: '',
            },
        }] },
        onSave: person => Promise.resolve({ form: person }) /* place your save api call here */,
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                gender: { isRequired: true },
                processingPersonalDataAgreed: { isRequired: true },
                displayAdsAgreed: { isRequired: true },
            },
        }),
        settingsKey: 'theme-demo',
    });

    const renderThemeBar = () => {
        return (
            <PromoFlexRow borderBottom background='white'>
                <TabButton
                    caption={ 'Promo' }
                    isLinkActive={ theme.name === 'promo' }
                    onClick={ () => setTheme({ name: 'promo', type: 'light' }) }
                    size='48'
                />
                <TabButton
                    caption='Promo Dark'
                    isLinkActive={ theme.name === 'promo_dark' }
                    onClick={ () => setTheme({ name: 'promo_dark', type: 'dark' }) }
                    size='48'
                />
                <TabButton
                    caption='Orange Theme'
                    isLinkActive={ theme.name === 'orange' }
                    onClick={ () => setTheme({ name: 'orange', type: 'light' }) }
                    size='48'
                />
                <TabButton
                    caption='Cyan Theme'
                    isLinkActive={ theme.name === 'cyan' }
                    onClick={ () => setTheme({ name: 'cyan', type: 'light' }) }
                    size='48'
                />
                <TabButton
                    caption='Violet Theme'
                    isLinkActive={ theme.name === 'violet' }
                    onClick={ () => setTheme({ name: 'violet', type: 'light' }) }
                    size='48'
                />
                <TabButton
                    caption='Red Theme'
                    isLinkActive={ theme.name === 'red' }
                    onClick={ () => setTheme({ name: 'red', type: 'light' }) }
                    size='48'
                />
            </PromoFlexRow>
        );
    };

    const renderDemoForm = () => {
        return (
            <FlexRow vPadding='24' padding='24'>
                <FlexCell width={ 600 } minWidth={ 600 }>
                    <Text color='primary' lineHeight='30' fontSize='24' font='semibold'>Personal Info</Text>
                    <FlexRow vPadding='36' >
                        <SuccessNotification id={ 1 } key='1' onSuccess={ () => {} } onClose={ () => {} }>
                            <Text size='36' font='regular' fontSize='14'>Data has been saved!</Text>
                        </SuccessNotification>
                    </FlexRow>
                    <FlexRow vPadding='36' >
                        <ErrorNotification id={ 1 } key='1' onSuccess={ () => {} } onClose={ () => {} } actions={ [{ name: 'Restore', action: () => {} }, { name: 'Cancel', action: () => {} }] }>
                            <Text size='36' font='regular' fontSize='14'>Data hasn't been saved! Please choose something!</Text>
                        </ErrorNotification>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <LabeledInput label='First Name'>
                                <TextInput placeholder='First Name' { ...lens.prop('firstName').toProps() } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <LabeledInput label='Last Name'>
                                <TextInput placeholder='Last Name' { ...lens.prop('lastName').toProps() }/>
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <LabeledInput label='Gender'>
                            <RadioGroup direction='horizontal' { ...lens.prop('gender').toProps() } items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] } />
                        </LabeledInput>
                    </FlexRow>
                    <FlexRow vPadding='24' >
                        <Text color='primary' lineHeight='30' fontSize='24' font='semibold'>Visa records</Text>
                    </FlexRow>
                    {
                        lens.prop('visaRecords').get().map((record, index) => {
                            return (
                                <FlexRow key={ index } spacing='12' vPadding='12' alignItems='bottom'>
                                    <FlexCell width={ 242 }>
                                        <LabeledInput label='Country' >
                                            <TextInput { ...lens.prop('visaRecords').index(index).prop('country').toProps() } />
                                        </LabeledInput>
                                    </FlexCell>
                                    <FlexCell width={ 300 }>
                                        <LabeledInput label='Term'>
                                            <FlexRow spacing='6'>
                                                <FlexCell width={ 140 }>
                                                    <TextInput placeholder='From:' { ...lens.prop('visaRecords').index(index).prop('term').prop('from').toProps() } />
                                                </FlexCell>
                                                <FlexCell width={ 140 } >
                                                    <TextInput placeholder='To:' { ...lens.prop('visaRecords').index(index).prop('term').prop('to').toProps() } />
                                                </FlexCell>
                                            </FlexRow>
                                        </LabeledInput>
                                    </FlexCell>
                                    <FlexRow alignItems='center'>
                                        <IconButton icon={ CrossIcon } onClick={ () => lens.prop('visaRecords').set(lens.prop('visaRecords').get().filter((_, i) => index !== i)) } />
                                    </FlexRow>
                                </FlexRow>
                            );
                        })
                    }
                    <FlexRow vPadding='24' >
                        <Button
                            caption='Add one more'
                            icon={ AddIcon }
                            color='primary'
                            mode='outline'
                            onClick={ () => lens.prop('visaRecords').set(lens.prop('visaRecords').get().concat({ country: '', term: { from: '', to: '' } })) }
                        />
                    </FlexRow>
                    <FlexRow vPadding='24' >
                        <Text color='primary' lineHeight='30' fontSize='24' font='semibold'>Agreement</Text>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <Checkbox label='I agree to the processing of personal data' { ...lens.prop('processingPersonalDataAgreed').toProps() }/>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12' borderBottom>
                        <FlexCell grow={ 1 }>
                            <Switch label='I agree to display ads' { ...lens.prop('displayAdsAgreed').toProps() }/>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='24' spacing='12'>
                        <FlexSpacer />
                        <Button caption='Cancel' onClick={ () => {} } color='secondary' mode='outline'/>
                        <Button caption='SAVE' onClick={ save } color='primary' />
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <Panel cx={ themeCss[theme.name] } style={ { height: 'calc(100vh - 60px)', width: '100%', background: theme.type === 'light' ? '#F5F6FA' : '#1D1E26' } }>
            { renderThemeBar() }
            <Panel background shadow rawProps={ { style: { margin: '24px auto' } } }>
                <ScrollBars>
                    { renderDemoForm() }
                </ScrollBars>
            </Panel>
        </Panel>
    );
};