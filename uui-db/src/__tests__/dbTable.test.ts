import { emptyDb, sampleDb } from './TaskDb';

describe('db - DbTable', () => {
    describe('Basic updates', () => {
        it('user name update', () => {
            const users = sampleDb.tables.users;
            const newUsers = users.with([{ id: 'AS', name: 'Ivan Ivanov' }]);
            expect(newUsers.byId('AS').name).toEqual('Ivan Ivanov');
            expect(users.byId('AS').name).toEqual('Arya Stark');
            // DbTable is immutable, so shallow copy should be created at all levels.
            expect(newUsers).not.toBe(users);
            expect(newUsers.byId('AS')).not.toBe(users.byId('AS'));
        });
    });
});
