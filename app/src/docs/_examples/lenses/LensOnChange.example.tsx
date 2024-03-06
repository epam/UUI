import { useForm } from '@epam/uui';

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
    const { lens } = useForm<User>({
        value: initialData,
        onSave: (user) => Promise.resolve({ form: user }),
    });

    const cityLens = lens
        .prop('address')
        .onChange((oldValue, newValue) => ({ city: newValue.city, street: '' }))
        .prop('city');

    lens.prop('address').get(); // {city: 'London', street: 'Abbey Road'}

    cityLens.set('Paris');

    lens.prop('address').get(); // {city: 'Paris', street: ''}
}
