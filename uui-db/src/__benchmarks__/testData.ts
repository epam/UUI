import { range } from '@epam/uui-core';
import { IxSet } from '../IxSet';

export interface Person {
    id: number;
    name: string;
    departmentId: number;
    location?: string;
}

export const test100KPersons = range(101000, 999, -1).map((id) => ({ id, name: `Person ${id}`, departmentId: Math.floor(Math.random() * 10) }));

export const blankIxSet = new IxSet<Person, number>((i) => i.id, [{ fields: ['name'] }, { fields: ['departmentId', 'name'] }]);

export const blankIxSetNoIndex = new IxSet<Person, number>((i) => i.id, []);
