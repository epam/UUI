import { emptyDb, sampleDb } from './TaskDb';

describe('DB', () => {
    describe('Basic queries', () => {
        it('user by id with query/one', () => {
            expect(sampleDb.users({ id: 'AS' }).one().name).toEqual('Arya Stark');
        });
        it("user by id with 'byId'", () => {
            expect(sampleDb.users().byId('AS').name).toEqual('Arya Stark');
        });
        it('user by name', () => {
            expect(sampleDb.users({ name: 'Arya Stark' }).one().id).toEqual('AS');
        });
        it('sort by name', () =>
            expect(
                sampleDb
                    .users()
                    .thenBy('name')
                    .toArray()
                    .map((e) => e.name),
            ).toEqual([
                'Arya Stark', 'Daenerys Targaryen', 'John Snow',
            ]));
        it('sort by name and sex', () =>
            expect(
                sampleDb
                    .users()
                    .orderBy('sex', 'desc')
                    .thenBy('name')
                    .toArray()
                    .map((e) => e.name),
            ).toEqual([
                'John Snow', 'Arya Stark', 'Daenerys Targaryen',
            ]));
    });

    describe('Basic updates', () => {
        it('user name update', () => {
            const newDb = sampleDb.with({ users: [{ id: 'AS', name: 'Ivan Ivanov' }] });
            expect(newDb.users({ id: 'AS' }).one().name).toEqual('Ivan Ivanov');
            expect(sampleDb.users({ id: 'AS' }).one().name).toEqual('Arya Stark');
        });
    });

    describe('Composite key updates', () => {
        it('Can merge new managers correctly', () => {
            expect(sampleDb.managers().count()).toEqual(0);
            const role1 = { subordinateId: 'JS', managerId: 'DT', role: 'RM' };
            const role2 = { subordinateId: 'AS', managerId: 'DT', role: 'PM' };

            // Add one role
            const db1 = sampleDb.with({ managers: [role1] });
            expect(db1.managers().one()).toEqual(role1);

            // Add second role
            const db2 = db1.with({ managers: [role2] });
            expect(db2.managers({ managerId: 'DT' }).count()).toEqual(2);
            expect(db2.managers({ subordinateId: 'JS', managerId: 'DT' }).one()).toEqual(role1);
            expect(db2.managers({ subordinateId: 'AS' }).one()).toEqual(role2);

            // Update first role
            const role1New = { ...role1, role: 'DM' };
            const db3 = db2.with({ managers: [role1New] });
            expect(db3.managers({ subordinateId: 'JS', managerId: 'DT' }).one()).toEqual(role1New);
        });
    });
});
