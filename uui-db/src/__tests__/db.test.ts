import { emptyDb, sampleDb } from './TaskDb';

describe('db - DB queries and updates', () => {
    describe('Queries', () => {
        it('user by id with query/one', () => expect(sampleDb.users.find({ id: 'AS' }).one().name).toEqual('Arya Stark'));
        it("user by id with 'byId'", () => expect(sampleDb.users.byId('AS').name).toEqual('Arya Stark'));
        it("users by multiple id with 'in'", () =>
            expect(
                sampleDb.users
                    .find({ id: { in: ['AS', 'JS'] } })
                    .orderBy('id')
                    .toArray()
                    .map((u) => u.id),
            ).toEqual(['AS', 'JS']));
        it('user by name', () => expect(sampleDb.users.find({ name: 'Arya Stark' }).one().id).toEqual('AS'));
        it('user by [null] name', () => expect(sampleDb.users.find({ name: null }).one()).toBeNull());
        it('sort by name', () =>
            expect(
                sampleDb.users
                    .orderBy('name')
                    .toArray()
                    .map((e) => e.name),
            ).toEqual([
                'Arya Stark', 'Daenerys Targaryen', 'John Snow',
            ]));
        it('sort by name and sex', () =>
            expect(
                sampleDb.users
                    .orderBy('sex', 'desc')
                    .thenBy('name')
                    .map((e) => e.name),
            ).toEqual([
                'John Snow', 'Arya Stark', 'Daenerys Targaryen',
            ]));
        it('sort by name and sex via order', () =>
            expect(sampleDb.users.order([{ field: 'sex' }, { field: 'name', direction: 'desc' }]).map((e) => e.name)).toEqual([
                'Daenerys Targaryen', 'Arya Stark', 'John Snow',
            ]));
        it("find tasks by multiple values with 'in'", () =>
            expect(
                sampleDb.tasks
                    .find({ createdBy: { in: ['AS', 'JS'] } })
                    .orderBy('id')
                    .map((t) => t.id),
            ).toEqual([6, 7]));

        it('find tasks by both indexed and non-indexed fields', () =>
            expect(
                sampleDb.tasks
                    .find({ createdBy: { in: ['DT'] }, assignedTo: 'JS', isDone: false })
                    .orderBy('id')
                    .map((t) => t.id),
            ).toEqual([4]));

        it('non-indexable filter criteria should work', () =>
            expect(
                sampleDb.tasks
                    .find({ id: { gte: 4 }, assignedTo: 'AS', isDone: false })
                    .orderBy('id')
                    .map((t) => t.id),
            ).toEqual([5, 7]));

        it('non-indexable and indexable criteria for the same field', () =>
            expect(sampleDb.tasks.find({ createdBy: { in: ['AS', 'JS'], gt: 'B' }, isDone: false }).map((t) => t.id)).toEqual([6]));

        it('count should work with filter', () => expect(sampleDb.tasks.find({ assignedTo: 'AS' }).count()).toEqual(2));

        it('range should work with filter', () =>
            expect(
                sampleDb.tasks
                    .find({ createdBy: 'DT', assignedTo: { isNull: false } })
                    .orderBy('assignedTo')
                    .thenBy('id')
                    .range(1, 3)
                    .map((i) => i.id),
            ).toEqual([
                1, 3, 4,
            ]));
    });

    describe('Indexes and updates', () => {
        it('query after insert', () => {
            const db = sampleDb.with({
                tasks: [
                    {
                        id: 100, name: 'Test', assignedTo: 'QQ', createdBy: 'WW', isDone: false, isDraft: false,
                    },
                ],
            });
            expect(db.tasks.find({ assignedTo: 'QQ', createdBy: 'WW' }).one().id).toBe(100);
        });

        it('query after update', () => {
            const db = sampleDb.with({
                tasks: [
                    {
                        id: 1, name: 'Test', createdBy: 'QQ', isDone: false, isDraft: false,
                    },
                ],
            });
            expect(db.tasks.find({ createdBy: 'QQ' }).one().id).toBe(1);
            expect(
                db.tasks
                    .find({ createdBy: 'DT' })
                    .orderBy('id')
                    .map((u) => u.id),
            ).toEqual([
                2, 3, 4, 5,
            ]);
        });

        it('query after delete', () => {
            const db = sampleDb.with({ tasks: [{ id: 1, isDeleted: true }] });
            expect(db.tasks.byId(1)).toBeFalsy();
            expect(db.tasks.find({ createdBy: 'AS' }).map((i) => i.id)).not.toContain(1);
        });

        it('user name update', () => {
            const newDb = sampleDb.with({ users: [{ id: 'AS', name: 'Ivan Ivanov' }] });
            expect(newDb.users.byId('AS').name).toEqual('Ivan Ivanov');
            // DB is immutable, so shallow copy should be created at all levels.
            expect(newDb.users).not.toBe(sampleDb.users);
            expect(newDb.tables.users).not.toBe(sampleDb.tables.users);
            expect(newDb.users.byId('AS')).not.toBe(sampleDb.users.byId('AS'));
            expect(sampleDb.users.byId('AS').name).toEqual('Arya Stark');
        });

        it('Should return updated record if index is not touched', () => {
            const db = sampleDb.with({
                tasks: [
                    {
                        id: 7, name: 'Test', isDone: true, isDraft: false,
                    },
                ],
            });
            expect(db.tasks.find({ createdBy: 'AS' }).one().id).toBe(7);
            expect(db.tasks.find({ createdBy: 'AS' }).one().name).toBe('Test');
        });

        it('should handle null and undefined values', () => {
            const testDb = emptyDb.with({
                tasks: [{ id: 1, assignedTo: null, isDone: null }, { id: 2 }],
            });

            expect(
                testDb.tasks
                    .find({ isDone: null })
                    .toArray()
                    .map((i) => i.id),
            ).toEqual([1]);
            expect(
                testDb.tasks
                    .find({ isDone: undefined })
                    .toArray()
                    .map((i) => i.id),
            ).toEqual([2]);
            expect(
                testDb.tasks
                    .find({ isDone: { isNull: true } })
                    .toArray()
                    .map((i) => i.id),
            ).toEqual([1, 2]);

            expect(
                testDb.tasks
                    .find({ assignedTo: null })
                    .toArray()
                    .map((i) => i.id),
            ).toEqual([1]);
            expect(
                testDb.tasks
                    .find({ assignedTo: undefined })
                    .toArray()
                    .map((i) => i.id),
            ).toEqual([2]);
            expect(
                testDb.tasks
                    .find({ assignedTo: { isNull: true } })
                    .toArray()
                    .map((i) => i.id),
            ).toEqual([1, 2]);
        });

        it('Should correctly handle changes from undefined to non-undefined and reverse (non-indexed)', () => {
            const db1 = sampleDb.with({ tasks: [{ id: 100 }] }); // initial - undefined
            expect(db1.tasks.find({ name: { isNull: true } }).one().id).toBe(100);
            expect(db1.tasks.find({ name: undefined }).one().id).toBe(100);
            expect(db1.tasks.find({ name: { in: [undefined] } }).one().id).toBe(100);
            const db2 = db1.with({ tasks: [{ id: 100, name: 'Test' }] }); // set value
            expect(db2.tasks.find({ name: 'Test' }).one().id).toBe(100);
            const db3 = db2.with({ tasks: [{ id: 100, isDone: true }] }); // keep value
            expect(db2.tasks.find({ name: 'Test' }).one().id).toBe(100);
            const db4 = db3.with({ tasks: [{ id: 100, name: undefined }] }); // set to undefined
            expect(db4.tasks.find({ name: { isNull: true } }).one().id).toBe(100);
            expect(db4.tasks.find({ name: undefined }).one().id).toBe(100);
            expect(db4.tasks.find({ name: { in: [undefined] } }).one().id).toBe(100);
        });

        it('Should correctly handle changes from null to non-null and reverse (non-indexed)', () => {
            const db1 = sampleDb.with({ tasks: [{ id: 100, name: null }] }); // initial - null
            expect(db1.tasks.find({ name: { isNull: true } }).one().id).toBe(100);
            expect(db1.tasks.find({ name: null }).one().id).toBe(100);
            expect(db1.tasks.find({ name: { in: [null] } }).one().id).toBe(100);
            const db2 = db1.with({ tasks: [{ id: 100, name: 'Test' }] }); // set value
            expect(db2.tasks.find({ name: 'Test' }).one().id).toBe(100);
            const db3 = db2.with({ tasks: [{ id: 100, isDone: true }] }); // keep value
            expect(db2.tasks.find({ name: 'Test' }).one().id).toBe(100);
            const db4 = db3.with({ tasks: [{ id: 100, name: null }] }); // set to null
            expect(db4.tasks.find({ name: { isNull: true } }).one().id).toBe(100);
            expect(db4.tasks.find({ name: null }).one().id).toBe(100);
            expect(db4.tasks.find({ name: { in: [null] } }).one().id).toBe(100);
        });

        it('Should correctly handle changes from null to non-null and reverse (indexed)', () => {
            const db1 = sampleDb.with({ tasks: [{ id: 100, name: 'Test', createdBy: null }] }); // initial - null
            expect(db1.tasks.find({ createdBy: { isNull: true } }).one().id).toBe(100);
            expect(db1.tasks.find({ createdBy: null }).one().id).toBe(100);
            expect(db1.tasks.find({ createdBy: { in: [null] } }).one().id).toBe(100);
            const db2 = db1.with({ tasks: [{ id: 100, createdBy: 'QQ' }] }); // set value
            expect(db2.tasks.find({ createdBy: 'QQ' }).one().id).toBe(100);
            const db3 = db2.with({ tasks: [{ id: 100, isDone: true }] }); // keep value
            expect(db2.tasks.find({ createdBy: 'QQ' }).one().id).toBe(100);
            const db4 = db3.with({ tasks: [{ id: 100, createdBy: null }] }); // set to null
            expect(db4.tasks.find({ createdBy: { isNull: true } }).one().id).toBe(100);
            expect(db4.tasks.find({ createdBy: null }).one().id).toBe(100);
            expect(db4.tasks.find({ createdBy: { in: [null] } }).one().id).toBe(100);
        });

        it('Should correctly handle changes from undefined to non-undefined and reverse (indexed)', () => {
            const db1 = sampleDb.with({ tasks: [{ id: 100, name: 'Test' }] }); // initial - undefined
            expect(db1.tasks.find({ createdBy: { isNull: true } }).one().id).toBe(100);
            expect(db1.tasks.find({ createdBy: undefined }).one().id).toBe(100);
            expect(db1.tasks.find({ createdBy: { in: [undefined] } }).one().id).toBe(100);
            const db2 = db1.with({ tasks: [{ id: 100, createdBy: 'QQ' }] }); // set value
            expect(db2.tasks.find({ createdBy: 'QQ' }).one().id).toBe(100);
            const db3 = db2.with({ tasks: [{ id: 100, isDone: true }] }); // keep value
            expect(db2.tasks.find({ createdBy: 'QQ' }).one().id).toBe(100);
            const db4 = db3.with({ tasks: [{ id: 100, createdBy: undefined }] }); // set to undefined
            expect(db4.tasks.find({ createdBy: { isNull: true } }).one().id).toBe(100);
            expect(db4.tasks.find({ createdBy: undefined }).one().id).toBe(100);
            expect(db4.tasks.find({ createdBy: { in: [undefined] } }).one().id).toBe(100);
        });

        it("Should work with update which doesn't touch indexed field", () => {
            const db = sampleDb.with({
                tasks: [
                    // existing, index field exists, should update index
                    {
                        id: 6, name: 'Test', isDone: true, isDraft: false, createdBy: 'XX',
                    },
                    // existing, index field omitted, should skip index update
                    {
                        id: 7, name: 'Test', isDone: true, isDraft: false,
                    },
                    // new, index field omitted, should be indexed as undefined
                    {
                        id: 123, name: 'Test', isDone: true, isDraft: false,
                    },
                ],
            });
            expect(db.tasks.find({ createdBy: 'XX' }).one().id).toBe(6);
            expect(db.tasks.find({ createdBy: 'AS' }).one().id).toBe(7);
            expect(db.tasks.find({ createdBy: undefined }).one().id).toBe(123);
            const db2 = sampleDb.with({ tasks: [{ id: 123, createdBy: 'ZZ' }] });
            expect(db2.tasks.find({ createdBy: 'ZZ' }).one().id).toBe(123);
        });
    });

    describe('Composite key updates', () => {
        it('Can merge new managers correctly', () => {
            expect(sampleDb.managers.count()).toEqual(0);
            const role1 = { subordinateId: 'JS', managerId: 'DT', role: 'RM' };
            const role2 = { subordinateId: 'AS', managerId: 'DT', role: 'PM' };

            // Add one role
            const db1 = sampleDb.with({ managers: [role1] });
            expect(db1.managers.one()).toEqual(role1);
            expect(db1.managers).not.toBe(sampleDb.managers);

            // Add second role
            const db2 = db1.with({ managers: [role2] });
            expect(db2.managers.find({ managerId: 'DT' }).count()).toEqual(2);
            expect(db2.managers.byId(['JS', 'DT'])).toEqual(role1);
            expect(db2.managers.find({ subordinateId: 'JS', managerId: 'DT' }).one()).toEqual(role1);
            expect(db2.managers.find({ subordinateId: 'AS' }).one()).toEqual(role2);

            // Update first role
            const role1New = { ...role1, role: 'DM' };
            const db3 = db2.with({ managers: [role1New] });
            expect(db3.managers.find({ subordinateId: 'JS', managerId: 'DT' }).one()).toEqual(role1New);
        });
    });
});
