import { useState } from 'react';
import { Lens } from '@epam/uui-core';

interface User {
    firstName: string;
    lastName: string;
}

const initialData: User[] = [
    {
        firstName: 'John',
        lastName: 'Smith',
    },
    {
        firstName: 'Max',
        lastName: 'Brown',
    },
];

export default function LensWorkWithArraysExample() {
    const [value, onValueChange] = useState<User[]>(initialData);
    const lens = Lens.onEditable<User[]>({ value, onValueChange });

    lens.index(1).set({ firstName: '', lastName: '' });

    lens.index(1).prop('firstName').get(); // =>  ''

    lens.get().map((i, index) => {
        return lens.index(index).get();
    });
}
