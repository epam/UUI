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

export default function LensCompositionExample() {
    const [value, onValueChange] = useState<User>(initialData);
    const lens = Lens.onEditable<User>({ value, onValueChange });

    lens.prop('address').prop('city').get(); // => 'London'

    lens.prop('address').prop('city').set('Piccadilly');

    lens.prop('address').prop('city').get(); // => 'Piccadilly'
}
