import {
    emptyDb, TaskDb, Task, TaskDbTables,
} from './TaskDb';
import { DbRef } from '../DbRef';
import { DbSaveResponse, DbPatch } from '../types';
import { DataQuery, runDataQuery, range } from '@epam/uui-core';

const delay = (t: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, t || 1);
    });

describe('db - list loaders', () => {
    const testItems = range(200).map((id) => {
        return {
            id,
            name: 'Task',
            isDone: false,
            createdBy: 'JS',
            isDraft: false,
            assignedTo: 'DT',
        } as Task;
    });

    class TaskDbRef extends DbRef<TaskDbTables, TaskDb> {
        constructor() {
            super(emptyDb);
        }

        public saveCallback = jest.fn(() => Promise.resolve({ submit: {} }));
        public apiCallback = jest.fn((rq: DataQuery<Task> & { t?: number }) => delay(rq?.t).then(() => runDataQuery(testItems, rq)));
        protected savePatch(patch: DbPatch<TaskDbTables>): Promise<DbSaveResponse<TaskDbTables>> {
            return Promise.resolve({ submit: {} });
        }

        public tasksLoader = this.makeListLoader({
            api: this.apiCallback,
            convertToPatch: (r) => ({ tasks: r.items }),
        });
    }

    it('Should correctly process happy-path', async () => {
        const dbRef = new TaskDbRef();
        const r1 = dbRef.tasksLoader.load({ range: { from: 0, count: 10 } });
        expect(r1.isComplete).toBe(false);
        expect(r1.isLoading).toBe(true);
        expect(dbRef.db.tasks.toArray()).toEqual([]);
        await r1.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(1);
        expect(r1.isLoading).toBe(false);
        expect(r1.isComplete).toBe(true);
        expect(dbRef.db.tasks.count()).toEqual(10);
        r1.reload();
        expect(r1.isComplete).toBe(true);
        expect(r1.isLoading).toBe(true);
        await r1.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(2);
        expect(r1.isLoading).toBe(false);
        expect(r1.isComplete).toBe(true);
    });

    it('Should correctly process overlapping ranges', async () => {
        const dbRef = new TaskDbRef();
        const r1 = dbRef.tasksLoader.load({ range: { from: 0, count: 100 } });
        const r2 = dbRef.tasksLoader.load({ range: { from: 95, count: 20 } });
        expect(r1.isComplete).toBe(false);
        expect(r1.isLoading).toBe(true);
        expect(r1.missing).toEqual({ range: { from: 0, count: 100 } });
        expect(r2.isComplete).toBe(false);
        expect(r2.isLoading).toBe(true);
        expect(r2.missing).toEqual({ range: { from: 100, count: 15 } });
        expect(dbRef.db.tasks.toArray()).toEqual([]);
        await r1.promise;
        await r2.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(2);
        expect(dbRef.apiCallback).nthCalledWith(1, { range: { from: 0, count: 100 } });
        expect(dbRef.apiCallback).nthCalledWith(2, { range: { from: 100, count: 15 } });
        expect(r1.isComplete).toBe(true);
        expect(r1.isLoading).toBe(false);
        expect(r2.isComplete).toBe(true);
        expect(r2.isLoading).toBe(false);
        expect(dbRef.db.tasks.count()).toEqual(115);
    });
});
