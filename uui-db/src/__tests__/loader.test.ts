import { emptyDb, TaskDb, TaskDbTables, sampleData } from './TaskDb';
import { DbRef } from '../DbRef';
import { DbSaveResponse, DbPatch } from '../types';

const delay = (t: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, t || 1);
    });

describe('db - loaders', () => {
    class TaskDbRef extends DbRef<TaskDbTables, TaskDb> {
        constructor() {
            super(emptyDb);
        }

        public saveCallback = jest.fn(() => Promise.resolve({ submit: {} }));
        public apiCallback = jest.fn((rq: { ids: string[]; t?: number }) =>
            delay(rq?.t).then(() => ({ items: sampleData.users.filter((u) => !rq?.ids || rq.ids.includes(u.id)) })));

        protected savePatch(): Promise<DbSaveResponse<TaskDbTables>> {
            return Promise.resolve({ submit: {} });
        }

        public tasksLoader = this.makeLoader({
            api: this.apiCallback,
            convertToPatch: (r) => ({ users: r.items }),
        });
    }

    it('Should correctly process happy-path', async () => {
        const dbRef = new TaskDbRef();
        const r1 = dbRef.tasksLoader.load({ ids: ['JS'] });
        expect(r1.isComplete).toBe(false);
        expect(r1.isLoading).toBe(true);
        expect(dbRef.db.users.toArray()).toEqual([]);
        await r1.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(1);
        expect(r1.isLoading).toBe(false);
        expect(r1.isComplete).toBe(true);
        expect(dbRef.db.users.count()).toEqual(1);
        r1.reload();
        expect(r1.isComplete).toBe(true);
        expect(r1.isLoading).toBe(true);
        await r1.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(2);
        expect(r1.isLoading).toBe(false);
        expect(r1.isComplete).toBe(true);
    });

    it('Same requests should not result same parallel requests', async () => {
        const dbRef = new TaskDbRef();
        let r1 = dbRef.tasksLoader.load({ ids: ['JS'] });
        let r2 = dbRef.tasksLoader.load({ ids: ['JS'] });
        expect(r1.isComplete).toBe(false);
        expect(r1.isLoading).toBe(true);
        expect(r2.isComplete).toBe(false);
        expect(r2.isLoading).toBe(true);
        await r1.promise;
        await r2.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(1);
        r1 = dbRef.tasksLoader.load({ ids: ['JS'] });
        r2 = dbRef.tasksLoader.load({ ids: ['JS'] });
        expect(r1.isComplete).toBe(true);
        expect(r1.isLoading).toBe(false);
        expect(r2.isComplete).toBe(true);
        expect(r2.isLoading).toBe(false);
    });

    it('Different requests should be processed separately', async () => {
        const dbRef = new TaskDbRef();
        const r1 = dbRef.tasksLoader.load({ ids: ['JS'] });
        const r2 = dbRef.tasksLoader.load({ ids: ['DT'], t: 2 });
        expect(r1).not.toBe(r2);
        expect(r1.isComplete).toBe(false);
        expect(r1.isLoading).toBe(true);
        expect(r2.isComplete).toBe(false);
        expect(r2.isLoading).toBe(true);
        await r1.promise;
        expect(r1.isComplete).toBe(true);
        expect(r1.isLoading).toBe(false);
        expect(r2.isComplete).toBe(false);
        expect(r2.isLoading).toBe(true);
        expect(dbRef.db.users.count()).toEqual(1);
        await r2.promise;
        expect(dbRef.apiCallback).toBeCalledTimes(2);
        expect(r1.isComplete).toBe(true);
        expect(r1.isLoading).toBe(false);
        expect(r2.isComplete).toBe(true);
        expect(r2.isLoading).toBe(false);
        expect(dbRef.db.users.count()).toEqual(2);
    });
});
