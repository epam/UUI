import * as b from 'benny';
import { Person } from './testData';
import { getOrderComparer } from '@epam/uui-core';
import range from 'lodash.range';

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
        const comparer = getOrderComparer([{ field: 'name', direction: 'asc' }]);

        return () => arr.sort(comparer);
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
