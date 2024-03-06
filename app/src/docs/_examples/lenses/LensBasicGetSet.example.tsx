/* eslint-disable  @typescript-eslint/no-unused-vars */
import { useForm } from '@epam/uui';

interface User {
    name?: string;
    address?: {
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

export default function LensBasic() {
    const { lens, value, onValueChange } = useForm<User>({
        value: initialData,
        onSave: (user) => Promise.resolve({ form: user }),
    });

    lens.get(); // return form value. Equal to value
    lens.set({}); // set form value. Equal to onValueChange({}) call;

    lens.prop('address').prop('city').get(); // Get city field value. Eq: value.address.city.
    lens.prop('address').prop('city').set('Paris'); // Set city field value. Eq: onValueChange({...value, address: {...value.address, city: 'Paris'}})
}
