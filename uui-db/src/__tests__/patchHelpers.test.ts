import {
    getId, isClientOnly, unionPatches, mergeEntityPatches, flattenResponse, isNew, hasServerFields, getParentEntities,
} from '../patchHelpers';
import {
    emptyDb, sampleDb, Task, User, Manager, View, TaskDbTables,
} from './TaskDb';
import { DbPatch } from '../types';
import { IClientIdsMap } from '..';
import { orderBy } from '@epam/uui-core';

const task: Partial<Task> = {
    id: 100500,
};

const user: User = {
    id: 'AB',
    name: 'Cruella de Vil',
    title: 'Villain',
    sex: 'f',
    orderStr: 'h',
};

const manager: Partial<Manager> = {
    managerId: 'AB',
    subordinateId: 'CD',
};

const view: View = {
    id: 10,
    title: 'list',
};

const clientOnlyView: View = {
    id: -10,
    title: 'list',
};

describe('db - patchHelpers', () => {
    const newClientIdsMap: IClientIdsMap = {
        clientToServer: (id: number): any => undefined,
        serverToClient: (tableName: string, id: any): any => undefined,
        clientToServerDataFilter: null,
        clientToServerRequest: null,
    };

    const existingClientIdsMap: IClientIdsMap = {
        clientToServer: (id: number): any => id,
        serverToClient: (tableName: string, id: any): any => id,
        clientToServerDataFilter: null,
        clientToServerRequest: null,
    };

    describe('getId', () => {
        it('should return numeric id', () => {
            expect(getId(task, emptyDb.tables.tasks.schema)).toEqual(task.id);
        });

        it('should return string id', () => {
            expect(getId(user, emptyDb.tables.users.schema)).toEqual(user.id);
        });

        it('should return compound id', () => {
            expect(getId(manager, emptyDb.tables.managers.schema)).toEqual([manager.subordinateId, manager.managerId]);
        });
    });

    describe('isClientOnly', () => {
        it('should return false if isClientOnly is not provided', () => {
            expect(isClientOnly(user, emptyDb.tables.users.schema)).toEqual(false);
        });

        it('should return true if isClientOnly == true', () => {
            expect(isClientOnly(view, emptyDb.tables.views.schema)).toEqual(true);
        });

        it('should return result of isClientOnly function', () => {
            expect(isClientOnly(view, emptyDb.tables.viewsFn.schema)).toEqual(false);
            expect(isClientOnly(clientOnlyView, emptyDb.tables.viewsFn.schema)).toEqual(true);
        });
    });

    describe('unionPatches', () => {
        it('should union patches', () => {
            const patches: DbPatch<TaskDbTables>[] = [
                {
                    users: [{ id: 'AB' }],
                }, {
                    users: [{ id: 'CD' }],
                },
            ];

            const result = unionPatches(patches);
            expect(result).toEqual({ users: [{ id: 'AB' }, { id: 'CD' }] });
        });
    });

    describe('mergeEntityPatches', () => {
        it('should merge entities with the same ids', () => {
            const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const patch: DbPatch<TaskDbTables> = {
                users: [{ id: 'YZ', name: 'Yakov Zhmurov' }, { id: 'YZ', sex: 'm' }],
            };

            const result = mergeEntityPatches(emptyDb.tables, patch);
            expect(result).toEqual({ users: [{ id: 'YZ', name: 'Yakov Zhmurov', sex: 'm' }] });
            expect(spy).not.toHaveBeenCalled();
        });

        it('should log console warning if properties of entities intersect', () => {
            const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const patch: DbPatch<TaskDbTables> = {
                users: [{ id: 'YZ', name: 'Yakov Zhmurov' }, { id: 'YZ', name: 'Ilya Kuznetsov' }],
            };

            mergeEntityPatches(emptyDb.tables, patch);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('flattenResponse', () => {
        it('should flatten provided object', () => {
            const response: any = {
                users: [
                    {
                        id: 'YZ',
                        name: 'Yakov Zhmurov',
                        __typename: 'User',
                        manager: { id: 'AU', name: 'Andrei Urban', __typename: 'User' },
                        subordinates: [{ id: 'PS', name: 'Pavel Shchur', __typename: 'User' }, { id: 'IK', name: 'Ilya Kuznetsov', __typename: 'User' }],
                    },
                ],
            };

            const users = orderBy(flattenResponse(response, emptyDb.tables).users ?? [], ({ id }) => id);
            expect(users).toEqual([
                { id: 'AU', name: 'Andrei Urban', __typename: 'User' }, { id: 'IK', name: 'Ilya Kuznetsov', __typename: 'User' }, { id: 'PS', name: 'Pavel Shchur', __typename: 'User' }, { id: 'YZ', name: 'Yakov Zhmurov', __typename: 'User' },
            ]);
        });

        it('should process non-entity arrays and objects as fields', () => {
            const processTask: any = {
                id: 'YZ',
                tags: ['important', 'db'],
                // details: { test: 'test' }, // FIXME
                __typename: 'Task',
            };

            const result = flattenResponse(processTask, emptyDb.tables);
            expect(result.tasks).toEqual([processTask]);
        });
    });

    describe('isNew', () => {
        it('should return false if no server-client mapping exists', () => {
            expect(isNew(user, emptyDb.tables.users.schema, newClientIdsMap)).toEqual(true);
        });

        it('should return true if server-client mapping exists', () => {
            expect(isNew(user, emptyDb.tables.users.schema, existingClientIdsMap)).toEqual(false);
        });
    });

    describe('hasServerFields', () => {
        it('should return false if entity is client only', () => {
            expect(hasServerFields(view, emptyDb.tables.views.schema, newClientIdsMap, emptyDb.tables)).toEqual(false);
            expect(hasServerFields(view, emptyDb.tables.views.schema, existingClientIdsMap, emptyDb.tables)).toEqual(false);
            expect(hasServerFields(clientOnlyView, emptyDb.tables.viewsFn.schema, newClientIdsMap, emptyDb.tables)).toEqual(false);
            expect(hasServerFields(clientOnlyView, emptyDb.tables.viewsFn.schema, existingClientIdsMap, emptyDb.tables)).toEqual(false);
        });

        it('should return true if entity has id only and it is a new entity', () => {
            expect(hasServerFields({ id: 100 }, emptyDb.tables.tasks.schema, newClientIdsMap, emptyDb.tables)).toEqual(true);
        });

        it('should return false if entity has id only and it is an existing entity', () => {
            expect(hasServerFields({ id: 100 }, emptyDb.tables.tasks.schema, existingClientIdsMap, emptyDb.tables)).toEqual(false);
        });

        it('should return false if entity has readonly fields only', () => {
            expect(hasServerFields({ id: 100, createdBy: 'Ilya Kuznetsov' }, emptyDb.tables.tasks.schema, existingClientIdsMap, emptyDb.tables)).toEqual(false);
        });

        it('should return false if entity has client-only fields only', () => {
            expect(hasServerFields({ id: 100, isDraft: false }, emptyDb.tables.tasks.schema, existingClientIdsMap, emptyDb.tables)).toEqual(false);
        });
    });

    describe('getParentEntities', () => {
        it('should return parent aggregate entities only', () => {
            const parents = getParentEntities(
                {
                    tasks: [{ id: 1 }],
                },
                sampleDb.tables,
            );

            expect(parents.users).toEqual([{ id: 'DT' }]);
        });
    });
});
