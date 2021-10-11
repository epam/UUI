import React from 'react';
import { useForm, useArrayDataSource, useUuiContext } from '@epam/uui';
import { Button, TextInput, PickerInput, LabeledInput, FlexRow, Panel, FlexCell, FlexSpacer, SuccessNotification, ErrorNotification, Text, ModalBlocker, ModalWindow, ModalHeader, ScrollBars } from '@epam/promo';
import { ConfirmationModal } from '@epam/loveship';
import * as css from './UseFormDemo.module.scss';

enum Styles {
    MODERN = 'Modern',
    RENESSAINCE = 'Renessaince',
    CLASSICISM = 'Classicism',
    IMPRESSIONISM = 'Impressionism'
};

interface Artist {
    name: string;
    style: Styles;
}

export function UseFormDemo() {
    const svc = useUuiContext();
    const artistStyleDataSource = useArrayDataSource({
        items: Object.values(Styles).map(style => ({
            id: style.toLowerCase(),
            style
        })),
    }, []);

    const { save, lens } = useForm<Artist>({
        settingsKey: 'use-form-test',
        onSave: person => Promise.resolve({ form: person }),
        onSuccess: () => {
            svc.uuiNotifications.show(props =>
                <SuccessNotification { ...props } >
                    <Text size="24" font='sans' fontSize='14'>Data has been saved!</Text>
                </SuccessNotification>, { duration: 2 })
        },
        beforeLeave: () => svc.uuiModals.show(props => <ConfirmationModal caption="Leave without saving progress?" { ...props } />),
        onError: () => {
            return svc.uuiNotifications.show(props => (
                <ErrorNotification { ...props }>
                    <Text>Error on save</Text>
                </ErrorNotification>
            ))
        },
        getMetadata: () => ({
            props: {
                name: { isRequired: true },
                style: { isRequired: true }
            }
        }),
        value: { name: '', style: Styles.MODERN }
    });

    return (
        <Panel background='white' shadow cx={ css.root }>
            <FlexCell width='auto'>
                <FlexRow vPadding='12'>
                    <LabeledInput { ...lens.prop('name').toProps() } htmlFor="name" label="Artist Name">
                        <TextInput
                            { ...lens.prop('name').toProps() }
                            id="name"
                            placeholder='Artist Name'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <LabeledInput { ...lens.prop('style').toProps() } htmlFor="style" label="Painting Style">
                        <PickerInput
                            { ...lens.prop('style').toProps() }
                            dataSource={ artistStyleDataSource }
                            selectionMode='single'
                            valueType='id'
                            getName={ ({ style }) => style }
                            inputId="country"
                            placeholder='Select Painting Style'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow spacing='12'>
                    <FlexSpacer />
                    <Button onClick={ save } rawProps={{ type: 'submit' }} caption='Submit' />
                </FlexRow>
            </FlexCell>
        </Panel>
    )
}