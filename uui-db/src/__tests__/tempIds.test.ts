import { emptyDb } from './TaskDb';
import { TempIdMap, getTempId, isTempId } from '../tempIds';

describe('tempIds', () => {
    beforeEach(() => {
        // testTask.mockReset();
    });

    it('generates ids', () => {
        const id1 = getTempId();
        const id2 = getTempId();
        expect(id1).not.toBe(id2);
    });

    it('isTempId works', () => {
        const id = getTempId();
        expect(isTempId(id)).toBe(true);
        expect(isTempId(0)).toBe(false);
        expect(isTempId(1)).toBe(false);
        expect(isTempId(null)).toBe(false);
    });

    it('serverToClientPatch - should re-map PK', () => {
        const ids = new TempIdMap(emptyDb);

        const patch = ids.serverToClientPatch({
            tasks: [{ id: 1, name: 'Test', isDone: true }],
        });

        expect(patch.tasks).toEqual([
            {
                id: ids.serverToClient('tasks', 1),
                name: 'Test',
                isDone: true,
            },
        ]);
    });

    it('serverToClientPatch - should re-map FK', () => {
        const ids = new TempIdMap(emptyDb);

        const patch = ids.serverToClientPatch({
            tasks: [
                {
                    id: 1, name: 'Test', assignedTo: 'J', isDone: false,
                },
            ],
            users: [{ id: 'J', name: 'John' }],
        });

        expect(patch.tasks).toEqual([
            {
                id: ids.serverToClient('tasks', 1),
                assignedTo: ids.serverToClient('users', 'J'),
                name: 'Test',
                isDone: false,
            },
        ]);
    });

    it('serverToClientPatch - handles defaults', () => {
        const ids = new TempIdMap(emptyDb);

        const patch = ids.serverToClientPatch({
            tasks: [{ id: 1, name: 'Test' }],
        });

        expect(patch.tasks).toEqual([
            {
                id: ids.serverToClient('tasks', 1),
                name: 'Test',
                isDone: false,
            },
        ]);
    });

    it('clientToServerPatch - should re-map PKs and FKs back, and apply toServer conversions', () => {
        const ids = new TempIdMap(emptyDb);

        const initialPatch = {
            tasks: [
                {
                    id: 1, estimate: '1' as any, assignedTo: 'JS', isDone: true,
                }, { id: 2, estimate: '2' as any, isDone: false },
            ],
            users: [{ id: 'JS', name: 'John Snow' }, { id: 'DT', name: 'Daenerys Targaryen' }],
            managers: [{ subordinateId: 'JS', managerId: 'DT' }],
        };

        const clientPatch = ids.serverToClientPatch(initialPatch);

        expect(clientPatch.managers[0].managerId).toBe(ids.serverToClient('managers', 'DT'));

        const serverPatch = ids.clientToServerPatch(clientPatch);

        expect(serverPatch).toEqual(initialPatch);
    });
});
