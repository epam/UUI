import {
    emptyDb, sampleDb, TaskDbView, TaskDb, Task,
} from './TaskDb';

describe('db - Views', () => {
    it('Should work with whole db as a view', () => {
        const view: TaskDbView<TaskDb, void> = {
            compute: (db) => db,
        };

        const baseResult = sampleDb.runView(view);
        const updatedResult = sampleDb.with({ tasks: [{ id: 123, name: '123' }] }).runView(view);
        const baseResult2 = sampleDb.runView(view);

        expect(baseResult).toBe(baseResult2);
        expect(baseResult).not.toBe(updatedResult);
        expect(updatedResult.tables.tasks.byId(123).name).toBe('123');
    });

    it('Should correctly cache result', () => {
        const view: TaskDbView<Task, number> = {
            compute: jest.fn((db, id) => db.tasks.byId(id)),
        };

        sampleDb.runView(view, 1);

        const baseResult = sampleDb.runView(view, 1);

        const sampleDb2 = sampleDb.with({ tasks: [{ id: 1, name: 'updated' }] });

        const result1 = sampleDb2.runView(view, 1);
        const result2 = sampleDb2.runView(view, 1);
        expect(baseResult).toBe(sampleDb.tasks.byId(1));
        expect(result1).toBe(sampleDb2.tasks.byId(1));
        expect(result1).not.toBe(baseResult);
        expect(result1).toBe(result2);

        expect(view.compute).toBeCalledTimes(2);
    });

    it('Should correctly reuse results when forked', () => {
        const view: TaskDbView<Task, number> = {
            compute: jest.fn((db, id) => db.tasks.byId(id)),
        };

        const db = emptyDb.with({ tasks: [{ id: 1, name: 'base' }] });
        const baseResult = db.runView(view, 1);

        expect(baseResult).toEqual({ id: 1, name: 'base' });

        // Make three db versions:
        // first updating a different entity
        const sampleDb1 = db.with({ tasks: [{ id: 2, name: 'e2 - updated' }] });
        // second - updating the same entity with the same value
        const sampleDb2 = db.with({ tasks: [{ id: 1, name: 'base' }] });
        // third - updating our entity with new value
        const sampleDb3 = db.with({ tasks: [{ id: 1, name: 'updated' }] });

        // In first db, the view should keep exactly same (===) existing value in the first fork
        const result1 = sampleDb1.runView(view, 1);
        expect(result1).toBe(baseResult);
        expect(result1).toEqual({ id: 1, name: 'base' });

        // In the second db, view should still return the same (===) object.
        // It should re-compute the view, but find results the same as previous with deepEQ compare, and re-use previous results
        const result2 = sampleDb2.runView(view, 1);
        expect(result2).toBe(result1);
        expect(result2).toEqual({ id: 1, name: 'base' });

        // In the third db, view should return a new value
        const result3 = sampleDb3.runView(view, 1);
        expect(result3).toEqual({ id: 1, name: 'updated' });

        expect(view.compute).toBeCalledTimes(4);
    });
});
