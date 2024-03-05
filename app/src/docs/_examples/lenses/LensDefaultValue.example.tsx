import { useState } from 'react';
import { Lens } from '@epam/uui-core';

interface User {
    name: string;
    languages?: string[]
}

const initialData: User = {
    name: 'John',
};

export default function LensCompositionExample() {
    const [value, onValueChange] = useState<User>(initialData);
    const lens = Lens.onEditable<User>({ value, onValueChange });

    lens.prop('languages').default([]).get().map((i) => i);
}
