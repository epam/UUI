import * as React from 'react';
import { useForm, useArrayDataSource } from '@epam/uui';
import { Button, TextInput, PickerInput, LabeledInput } from '@epam/promo';

enum Styles {
    MODERN = 'Modern',
    RENESSAINCE = 'Renessaince',
    CLASSICISM = 'Classicism',
    IMPRESSIONISM = 'Impressionism'
};

interface Artist {
    name: string;
    style: Styles | '';
}

export function UseFormDemo() {
    const artistStyleDataSource = useArrayDataSource({
        items: Object.values(Styles).map(style => ({
            id: style.toLowerCase(),
            style
        })),
    }, []);

    const { save, lens } = useForm<Artist>({
        onSave: Promise.resolve,
        onError: Promise.reject,
        getMetadata: () => ({
            props: {
                name: { isRequired: true },
                style: { isRequired: true }
            }
        }),
        value: { name: '', style: '' }
    });

    return (
        <form onSubmit={save}>
            <LabeledInput { ...lens.prop('name').toProps() } htmlFor="name" label="Artist Name">
                <TextInput
                    { ...lens.prop('name').toProps() }
                    id="name"
                    placeholder='Artist Name'
                />
            </LabeledInput>
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
            <Button rawProps={{ type: 'submit' }} caption='Submit' />
        </form>
    )
}