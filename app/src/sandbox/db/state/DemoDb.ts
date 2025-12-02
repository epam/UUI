import { Db, DbTable, DbRelationType } from '@epam/uui-db';
import * as docs from '@epam/uui-docs';

export type DemoDbTypes = {
    persons: docs.Person;
};

const demoDbTables = {
    persons: new DbTable<docs.Person, number, any>({
        tableName: 'persons',
        typeName: 'Person',
        searchBy: ['name'],
        primaryKey: 'id',
        fields: {
            id: { isGenerated: true },
            departmentId: { fk: { tableName: 'departments', relationType: DbRelationType.Association } },
            jobTitleId: { fk: { tableName: 'jobTitles', relationType: DbRelationType.Association } },
            hireDate: { toClient: (d) => new Date(d) as any, toServer: (d) => d },
            birthDate: { toClient: (d) => new Date(d) as any, toServer: (d) => d },
        },
        indexes: ['departmentId', 'jobTitleId'],
    }),
    personGroups: new DbTable<docs.PersonEmploymentGroup, number, any>({
        tableName: 'personGroups',
        typeName: 'PersonEmploymentGroup',
        searchBy: ['name'],
        primaryKey: 'id',
        fields: {
            id: { isGenerated: true },
            departmentId: { fk: { tableName: 'departments', relationType: DbRelationType.Association } },
            jobTitleId: { fk: { tableName: 'jobTitles', relationType: DbRelationType.Association } },
        },
    }),
    departments: new DbTable<docs.Department, number, any>({
        tableName: 'departments',
        typeName: 'Department',
        searchBy: ['name'],
        primaryKey: 'id',
        fields: {
            id: { isGenerated: true },
        },
    }),
    jobTitles: new DbTable<docs.JobTitle, number, any>({
        tableName: 'jobTitles',
        typeName: 'JobTitle',
        searchBy: ['name'],
        primaryKey: 'id',
        fields: {
            id: { isGenerated: true },
        },
    }),
};

export type DemoDbTables = typeof demoDbTables;

export class DemoDb extends Db<DemoDbTables> {
    constructor() {
        super(demoDbTables);
    }

    public get persons() {
        return this.tables.persons;
    }

    public get departments() {
        return this.tables.departments;
    }
}

export const blankDemoDb = new DemoDb();
