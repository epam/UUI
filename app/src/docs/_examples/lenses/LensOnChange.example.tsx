import { useState } from 'react';
import { Lens } from '@epam/uui-core';

interface User {
    name: string;
    address: {
        city: string;
        street: string;
    }

}

const initialData: User = {
    name: 'John',
    address: {
        city: 'London',
        street: 'Abbey Road',
    },
};

export default function LensBasicGetSetExample() {
    const [value, onValueChange] = useState<User>(initialData);
    const lens = Lens.onEditable<User>({ value, onValueChange });

    const cityLens = lens
        .prop('address')
        .onChange((oldValue, newValue) => ({ city: newValue.city, street: '' }))
        .prop('city');

    lens.prop('address').get(); // {city: 'London', street: 'Abbey Road'}

    cityLens.set('Paris');

    lens.prop('address').get(); // {city: 'Paris', street: ''}
}
