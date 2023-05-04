import {
    sampleDb, sampleData, TasksDbRef,
} from './TaskDb';
import { DbRef } from '../index';
import { delay } from '@epam/uui-test-utils';

describe('db - DbRef query and updates', () => {
    it('Get user by id', () => {
        const db = new DbRef(sampleDb);
        db.commitFetch(sampleData);
        expect(db.db.users.byId('DT').name).toEqual('Daenerys Targaryen');
    });

    it('Basic update', () => {
        const db = new DbRef(sampleDb);
        db.commitFetch(sampleData);
        db.commit({ users: [{ id: 'DT', name: 'Daenerys Snow' }] });
        expect(db.db.users.byId('DT').name).toEqual('Daenerys Snow');
    });

    it('Revert changes', () => {
        const db = new DbRef(sampleDb);
        db.commitFetch(sampleData);
        expect(db.db.users.byId('DT').name).toEqual('Daenerys Targaryen');
        db.commit({ users: [{ id: 'DT', name: 'Daenerys Snow' }] });
        expect(db.db.users.byId('DT').name).toEqual('Daenerys Snow');
        db.revert();
        expect(db.db.users.byId('DT').name).toEqual('Daenerys Targaryen');
    });

    it('Auto-saves changes', async () => {
        const handleSave = jest.fn(async () => ({ submit: {} }));
        const db = new TasksDbRef(handleSave);
        db.commitFetch(sampleData);
        const patch = { users: [{ id: 'DT', name: 'Daenerys Snow' }] };
        db.commit(patch);
        await delay(2);
        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith(patch);
    });

    it('Saves are throttled in auto-save mode', async () => {
        const handleSave = jest.fn(async () => ({ submit: {} }));
        const db = new TasksDbRef(handleSave);
        db.commitFetch(sampleData);
        const patch1 = { users: [{ id: 'DT', name: 'Daenerys Snow' }] };
        db.commit(patch1);
        const patch2 = { users: [{ id: 'DT', name: 'Daenerys' }] };
        db.commit(patch2);
        expect(handleSave).toHaveBeenCalledTimes(0);
        await delay(2);
        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith(patch2);

        // 2nd change
        handleSave.mockClear();
        db.commit(patch1);
        expect(handleSave).toHaveBeenCalledTimes(0);
        await delay(2);
        expect(handleSave).toHaveBeenCalledTimes(1);
        expect(handleSave).toHaveBeenCalledWith(patch1);
    });

    it('Manually saves changes', async () => {
        const handleSave = jest.fn(async () => ({ submit: {} }));
        const db = new TasksDbRef(handleSave);
        db.setAutoSave(false);
        db.commitFetch(sampleData);
        const patch = { users: [{ id: 'DT', name: 'Daenerys Snow' }] };
        db.commit(patch);
        await delay(2);
        expect(handleSave).not.toHaveBeenCalled();
        await db.save();
        expect(handleSave).toHaveBeenCalledWith(patch);
    });

    it('Pass-thru save errors', async () => {
        const handleSave = jest.fn(async () => {
            throw new Error();
        });
        const db = new TasksDbRef(handleSave);
        db.setAutoSave(false);
        const patch = { users: [{ id: 'DT', name: 'Daenerys Snow' }] };
        db.commit(patch);
        await expect(db.save()).rejects.toBeInstanceOf(Error);
    });

    describe('Basic lenses', () => {
        it('update with entity lens', () => {
            const db = new DbRef(sampleDb);
            db.commitFetch(sampleData);
            // const lens = db.entityLens('users', { id: 'DT' });
            // expect(lens.get().name).eq("Daenerys Targaryen");
            // lens.update({ name: "Daenerys Snow" });
            // expect(lens.get().name).eq("Daenerys Snow");
            // lens.prop('name').onValueChange("Ivan");
            // expect(lens.get().name).eq("Ivan");
        });
    });
});
