import * as React from 'react';
import { useForm, useArrayDataSource, useUuiContext } from '@epam/uui';
import { Button, Slider, TextInput, PickerInput, LabeledInput, FlexRow, Panel, FlexCell, FlexSpacer, SuccessNotification, ErrorNotification, Text, TextArea } from '@epam/promo';
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
    meaning: string;
    rating: number;
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
            return svc.uuiNotifications.show(props =>
                <SuccessNotification { ...props } >
                    <Text size="24" font='sans' fontSize='14'>Data has been saved!</Text>
                </SuccessNotification>, { duration: 2 })
        },
        beforeLeave: () => {
            return svc.uuiModals.show(props => (
                <ConfirmationModal caption="Leave without saving progress?" { ...props } />
            ));
        },
        onError: () => {
            return svc.uuiNotifications.show(props => (
                <ErrorNotification { ...props }>
                    <Text>Error on save</Text>
                </ErrorNotification>
            ));
        },
        getMetadata: () => ({
            props: {
                name: { isRequired: true },
                style: { isRequired: true }
            }
        }),
        value: { name: '', style: Styles.MODERN, meaning: '', rating: 0 }
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
                            inputId="style"
                            placeholder='Select Painting Style'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <LabeledInput htmlFor='meaning' label='Share your meaning with us' { ...lens.prop('meaning').toProps() }>
                        <TextArea
                            { ...lens.prop('meaning').toProps() }
                            rows={ 10 }
                            id='meaning'
                        />
                    </LabeledInput>
                </FlexRow>
                <FlexRow vPadding='12'>
                    <LabeledInput
                        label='Rating'
                        htmlFor="artistRating"
                        { ...lens.prop('rating').toProps() }
                    >
                        <Slider
                            min={ 0 }
                            max={ 10 }
                            step={ 1 }
                            rawProps={{ 'aria-label': 'Artist Rating', id: 'artistRating' }}
                            { ...lens.prop('rating').toProps() }
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