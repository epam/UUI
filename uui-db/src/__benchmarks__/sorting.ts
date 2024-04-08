import * as b from 'benny';
import { Person } from './testData';
import { getOrderComparer, orderBy, range } from '@epam/uui-core';

const testPersons = range(0, 1e4).map((id) => ({ id, name: `Person ${id}`, departmentId: Math.floor(Math.random() * 100) }));

const nameComparer = (p1: Person, p2: Person) => (p1.name > p2.name ? 1 : -1);

b.suite(
    'Sort array',

    b.add('array.sort, hard-coded', () => {
        const arr = [...testPersons];
        return () => arr.sort(nameComparer);
    }),

    b.add('_.sort, hard-coded', () => {
        const arr = [...testPersons];
        return () => orderBy(arr, 'name');
    }),

    b.add('array.sort, getOrderComparer', () => {
        const arr = [...testPersons];
        const comparer = getOrderComparer<Person>([{ field: 'name' }]);
        return () => arr.sort(comparer);
    }),

    b.cycle(),
    b.complete(),
    b.save({ file: 'sorting', version: '1.0.0' }),
);
