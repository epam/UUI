import { useForm } from '@epam/uui';

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
    const { lens } = useForm<User[]>({
        value: initialData,
        onSave: (user) => Promise.resolve({ form: user }),
    });

    lens.index(1).set({ firstName: '', lastName: '' });

    lens.index(1).prop('firstName').get(); // =>  ''

    lens.get().map((i, index) => {
        return lens.index(index).get();
    });
}
