import { Db, DbSchema, DbEntitySchema } from '../index';

export interface Task {
    id: number;
    name: string;
    isDone: boolean;
    createdBy: string;
    assignedTo: string;
}

export interface User {
    id: string;
    name: string;
    title: string;
    sex: 'm' | 'f';
}

export interface Manager {
    subordinateId: string;
    managerId: string;
    role: string;
}

export const taskDbSchema = new DbSchema({
    users: new DbEntitySchema<User>({ id: { pk: true } }),
    tasks: new DbEntitySchema<Task>({ id: { pk: true } }),
    managers: new DbEntitySchema<Manager>({ subordinateId: { pk: true }, managerId: { pk: true } }),
});

export const emptyDb = taskDbSchema.newDb();

export const sampleData = {
    tasks: [
        {
            id: 1, name: 'Implement DB', isDone: false, createdBy: 'dt', assignedTo: 'js',
        },
    ] as Task[],
    users: [
        { id: 'JS', name: 'John Snow', sex: 'm' }, { id: 'DT', name: 'Daenerys Targaryen', sex: 'f' }, { id: 'AS', name: 'Arya Stark', sex: 'f' },
    ] as User[],
};

export const sampleDb = emptyDb.with(sampleData);
