import React, { useState } from 'react';
import { useForm, useUuiContext, UuiContexts } from '@epam/uui';
import { Button, Checkbox, RadioInput, Switch, TextInput, SuccessNotification, ErrorNotification } from '@epam/uui-v';
import { FlexCell, FlexRow, Panel, TabButton, Text } from '@epam/promo';
import * as themeCss from '../../theme.scss';
import { TApi } from '../../data';

interface Person {
    firstName?: string;
    lastName?: string;
    sex?: string;
    processingPersonalDataAgreed?: boolean;
    displayAdsAgreed?: boolean;
}

export const ThemeDemo = () => {
    const [theme, setTheme] = useState<{ name: string, type: 'light' | 'dark', link?: string }>({ name: 'promo', type: 'light' });

    const { lens, save } = useForm<Person>({
        value: {},
        onSave: person => Promise.resolve({ form: person }) /* place your save api call here */,
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                sex: { isRequired: true },
                processingPersonalDataAgreed: { isRequired: true },
                displayAdsAgreed: { isRequired: true },
            },
        }),
        settingsKey: 'theme-demo',
    });

    const renderThemeBar = () => {
        return (
            <FlexRow background='white' borderBottom>
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
                    caption='Orange'
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
            </FlexRow>
        );
    };

    const renderDemoForm = () => {
        return (
            <FlexRow vPadding='24' padding='24'>
                <FlexCell width={ 360 }>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <TextInput placeholder='First Name' { ...lens.prop('firstName').toProps() } />
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <TextInput placeholder='Last Name' { ...lens.prop('lastName').toProps() }/>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <RadioInput
                                label='Female'
                                value={ lens.prop('sex').toProps().value === 'female' }
                                onValueChange={ newValue => lens.prop('sex').toProps().onValueChange('female') }
                            />
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <RadioInput
                                label='Male'
                                value={ lens.prop('sex').toProps().value === 'male' }
                                onValueChange={ newValue => lens.prop('sex').toProps().onValueChange('male') }
                            />
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <Checkbox label='I agree to the processing of personal data' { ...lens.prop('processingPersonalDataAgreed').toProps() }/>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12'>
                        <FlexCell grow={ 1 }>
                            <Switch label='I agree to display ads' { ...lens.prop('displayAdsAgreed').toProps() }/>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding='12' spacing='12'>
                        <Button caption='Cancel' onClick={ () => {} } color='secondary' mode='outline'/>
                        <Button caption='SAVE' onClick={ save } color='primary' />
                    </FlexRow>
                    <FlexRow vPadding='36' >
                        <SuccessNotification id={ 1 } key='1' onSuccess={ () => {} } onClose={ () => {} }>
                            <Text size='36' font='sans' fontSize='14'>Data has been saved!</Text>
                        </SuccessNotification>
                    </FlexRow>
                    <FlexRow vPadding='36' >
                        <ErrorNotification id={ 1 } key='1' onSuccess={ () => {} } onClose={ () => {} }>
                            <Text size='36' font='sans' fontSize='14'>Data hasn't been saved!</Text>
                        </ErrorNotification>
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <Panel cx={ themeCss[theme.name] } style={ { height: 'calc(100vh - 60px)', width: '100%', background: theme.type === 'light' ? 'white' : '#1D1E26' } }>
            { renderThemeBar() }
            { renderDemoForm() }
        </Panel>
    );
};