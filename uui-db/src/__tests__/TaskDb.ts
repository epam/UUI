import { DbRef } from '../DbRef';
import {
    Db, DbTable, DbRelationType, DbView,
} from '../index';
import { DbPatch, DbSaveResponse } from '../types';

export interface Task {
    id: number;
    name: string;
    isDone: boolean;
    createdBy: string;
    assignedTo: string;
    isDraft: boolean;
    tags?: string[];
    details?: any;
    estimate?: number;
    isDeleted?: boolean;
}

export interface User {
    id: string;
    name: string;
    title: string;
    sex: 'm' | 'f';
    orderStr: string;
}

export interface Manager {
    subordinateId: string;
    managerId: string;
    role: string;
}

export interface View {
    id: number;
    title: string;
}

const tasks = new DbTable<Task, number, any>({
    tableName: 'tasks',
    typeName: 'Task',
    primaryKey: 'id',
    fields: {
        id: { isGenerated: true },
        createdBy: {
            isReadOnly: true,
            fk: {
                tableName: 'users',
                relationType: DbRelationType.Aggregation,
            },
        },
        assignedTo: {
            fk: {
                tableName: 'users',
                relationType: DbRelationType.Association,
            },
        },
        estimate: {
            toClient: (value: any) => value && parseInt(value),
            toServer: (value: number) => value && ((value + '') as any),
        },
        isDone: { default: false },
        isDraft: { isClientOnly: true },
    },
    indexes: ['createdBy', 'assignedTo'],
    deleteFlag: 'isDeleted',
});

const users = new DbTable<User, string, any>({
    tableName: 'users',
    typeName: 'User',
    primaryKey: 'id',
    fields: {
        id: { isGenerated: true },
    },
    indexes: ['title'],
});

const managers = new DbTable<Manager, [string, string], any>({
    tableName: 'managers',
    typeName: 'Manager',
    primaryKey: ['subordinateId', 'managerId'],
    fields: {
        subordinateId: { isGenerated: true },
        managerId: { isGenerated: true },
    },
    indexes: ['subordinateId', 'managerId'],
});

const views = new DbTable<View, number, any>({
    tableName: 'views',
    typeName: 'View',
    primaryKey: 'id',
    fields: {
        id: { isGenerated: true },
    },
    isClientOnly: true,
});

const viewsFn = new DbTable<View, number, any>({
    tableName: 'viewsFn',
    typeName: 'ViewFn',
    primaryKey: 'id',
    fields: {
        id: { isGenerated: true },
    },
    isClientOnly: (view) => view.id < 0,
});

const taskDbTables = {
    tasks, users, managers, views, viewsFn,
};
export type TaskDbTables = typeof taskDbTables;

export class TaskDb extends Db<TaskDbTables> {
    public get tasks() {
        return this.tables.tasks;
    }

    public get users() {
        return this.tables.users;
    }

    public get managers() {
        return this.tables.managers;
    }

    public get views() {
        return this.tables.views;
    }

    public get viewsFn() {
        return this.tables.viewsFn;
    }
}

export const emptyDb = new TaskDb(taskDbTables);

export const sampleUsers = {
    daenerys: {
        id: 'DT', name: 'Daenerys Targaryen', sex: 'f', orderStr: 'b',
    } as User,
    john: {
        id: 'JS', name: 'John Snow', sex: 'm', orderStr: 'a',
    } as User,
    arya: {
        id: 'AS', name: 'Arya Stark', sex: 'f', orderStr: 'c',
    } as User,
};

export const sampleData = {
    tasks: [
        {
            id: 1, name: 'Implement DB', isDone: true, createdBy: 'DT', assignedTo: 'JS',
        }, {
            id: 2, name: 'Write Some Tests', isDone: true, createdBy: 'DT', assignedTo: null,
        }, {
            id: 3, name: 'Basic Indexes', isDone: true, createdBy: 'DT', assignedTo: 'JS',
        }, {
            id: 4, name: 'Views', isDone: false, createdBy: 'DT', assignedTo: 'JS',
        }, {
            id: 5, name: 'IO Scheduling', isDone: false, createdBy: 'DT', assignedTo: 'AS',
        }, {
            id: 6, name: 'DataSources', isDone: false, createdBy: 'JS', assignedTo: 'JS',
        }, {
            id: 7, name: 'Loaders', isDone: false, createdBy: 'AS', assignedTo: 'AS',
        },
    ] as Task[],
    users: [
        sampleUsers.daenerys, sampleUsers.john, sampleUsers.arya,
    ] as User[],
};

export const sampleDb = emptyDb.with(sampleData);

export type TaskDbView<TResult, TParams, TDependencies = void> = DbView<TaskDb, TResult, TParams, TDependencies>;

export class TasksDbRef extends DbRef<TaskDbTables, TaskDb> {
    constructor(private savePatchHandler: (patch: DbPatch<TaskDbTables>) => Promise<DbSaveResponse<TaskDbTables>>) {
        super(emptyDb);
        this.throttleSaveMs = 1;
    }

    override savePatch(patch: DbPatch<TaskDbTables>) {
        return this.savePatchHandler?.(patch);
    }
}
