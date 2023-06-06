import * as b from 'benny';
import { test100KPersons, blankIxSet } from './testData';
import * as I from 'immutable';

b.suite(
    'Find 1 entity by number ID in 100k dataset',

    // b.add('Array.filter', () => test100KPersons.find(p => p.id == 5)),

    b.add('IxSet.byId', () => {
        const set = blankIxSet.with(test100KPersons);
        return () => set.byId(5);
    }),

    b.add('Map.get', () => {
        const map = new Map(test100KPersons.map((p) => [p.id, p]));
        return () => map.get(5);
    }),

    b.add('hash[id]', () => {
        const map = (Object as any).fromEntries(test100KPersons.map((p) => [p.id, p]));
        return () => map[5];
    }),

    b.add('I.Map.get(id)', () => {
        const map = I.Map(test100KPersons.map((p) => [p.id, p]));
        return () => map.get(5);
    }),

    b.cycle(),
    b.complete(),
    b.save({ file: 'pkLookup', version: '1.0.0' }),
);
