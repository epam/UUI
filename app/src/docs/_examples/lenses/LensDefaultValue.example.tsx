import { useForm } from '@epam/uui';

interface User {
    name: string;
    languages?: string[]
}

const initialData: User = {
    name: 'John',
};

export default function LensCompositionExample() {
    const { lens } = useForm<User>({
        value: initialData,
        onSave: (user) => Promise.resolve({ form: user }),
    });

    lens.prop('languages').default([]).get().map((i) => i);
}
