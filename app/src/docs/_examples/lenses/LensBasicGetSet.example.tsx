import { useState } from 'react';
import { Lens } from '@epam/uui-core';

interface User {
    firstName: string;
    lastName: string;
}

const initialData: User = {
    firstName: 'John',
    lastName: 'Smith',
};

export default function LensBasicGetSet() {
    const [value, onValueChange] = useState<User>(initialData);
    const lens = Lens.onEditable<User>({ value, onValueChange });

    lens.get(); // => { firstName: 'John', lastName: 'Smith' }

    lens.set({ firstName: 'Max', lastName: 'Brown' });

    lens.get(); // => { firstName: 'Max', lastName: 'Brown' }

    lens.update((current) => ({ ...current, lastName: 'Welber' })); // => { firstName: 'Max', lastName: 'Welber' }
}
