import * as b from 'benny';
import { Person } from './testData';
import { getFilterPredicate, range } from '@epam/uui-core';

const testPersons = range(0, 1e4).map((id) => ({ id, name: `Person ${id}`, departmentId: Math.floor(Math.random() * 100) }));

b.suite(
    'Filter array',

    b.add('array.filter, hard-coded', () => {
        return () => testPersons.filter((p) => p.departmentId == 5);
    }),

    b.add('for-loop, array.push, hard-coded', () => {
        return () => {
            const result = [];
            for (let n = 0; n < testPersons.length; n++) {
                const person = testPersons[n];
                if (person.departmentId == 5) {
                    result.push(person);
                }
            }
        };
    }),

    b.add('array.filter, getPatternPredicate', () => {
        const predicate = getFilterPredicate<Person>({ departmentId: 5 });
        return () => {
            testPersons.filter(predicate);
        };
    }),

    b.add('for-loop, array.push, getPatternPredicate', () => {
        const predicate = getFilterPredicate<Person>({ departmentId: 5 });
        return () => {
            const result = [];
            for (let n = 0; n < testPersons.length; n++) {
                const person = testPersons[n];
                if (predicate(person)) {
                    result.push(person);
                }
            }
        };
    }),

    b.cycle(),
    b.complete(),
    b.save({ file: 'filter', version: '1.0.0' }),
);
