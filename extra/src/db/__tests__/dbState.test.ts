import {
    emptyDb, sampleDb, taskDbSchema, sampleData,
} from './TaskDb';
import { DbRef } from '../index';

describe('DB State', () => {
    describe('Basic updates', () => {
        it('user by id with query/one', () => {
            const db = new DbRef(taskDbSchema);
            db.commitFetch(sampleData);
            expect(db.current.users({ id: 'DT' }).one().name).toEqual('Daenerys Targaryen');
            db.commit({ users: [{ id: 'DT', name: 'Daenerys Snow' }] });
            expect(db.current.users({ id: 'DT' }).one().name).toEqual('Daenerys Snow');
        });
    });

    describe('Basic lenses', () => {
        it('update with entity lens', () => {
            const db = new DbRef(taskDbSchema);
            db.commitFetch(sampleData);
            const lens = db.entityLens('users', { id: 'DT' });
            expect(lens.get().name).toEqual('Daenerys Targaryen');
            lens.update({ name: 'Daenerys Snow' });
            expect(lens.get().name).toEqual('Daenerys Snow');
            lens.prop('name').onValueChange('Ivan');
            expect(lens.get().name).toEqual('Ivan');
        });
    });
});
