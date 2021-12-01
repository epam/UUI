import React from 'react';
import { useForm } from '@epam/uui';
import { Button, TextInput, FlexCell, FlexRow, Panel } from '@epam/uui-v';

interface Person {
    firstName?: string;
    lastName?: string;
    countryId?: number | string;
}

export const ThemeDemo = () => {
    const { lens, save } = useForm<Person>({
        value: {},
        onSave: person => Promise.resolve({ form: person }) /* place your save api call here */,
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: false },
            },
        }),
        settingsKey: 'basic-form-example',
    });

    const renderThemeBar = () => {
        return (
            <FlexRow>

            </FlexRow>
        );
    };

    const renderDemoForm = () => {
        return (<FlexCell rawProps={ { style: { padding: '24px' } } } width='100%'>
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
                    <Button caption='Save' onClick={ save } color='accent' />
                </FlexRow>
            </FlexCell>

        );
    };



    return (
        <Panel style={ { height: 'calc(100vh - 60px)' } }>
            { renderThemeBar() }
            { renderDemoForm() }
        </Panel>
    );
};