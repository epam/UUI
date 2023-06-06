import {
    Db, DbState, DbEntityFieldsSchema, DbFieldSchema,
} from './types';
import { QueryBuilder } from './QueryBuilder';
import { dbWith } from './updateApis';
import * as I from 'immutable';
import { objectKeys } from './helpers';

export class DbSchema<T> {
    public entitiesType: T;
    private dbProto: any = {};
    private blankState: DbState = null;
    private reducerToMethod(fn: Function) {
        const proto = this.dbProto;
        return function (this: any) {
            const newState = fn.apply(null, arguments).call(null, this.state);
            const db = Object.create(proto);
            db.state = newState;
            return db;
        };
    }

    constructor(public readonly entitySchemas: { [TEntity in keyof T]: DbEntitySchema<T[TEntity]> }) {
        this.blankState = {
            schema: this,
            entities: {},
            cache: {},
        };

        Object.keys(this.entitySchemas).forEach((entityName) => {
            this.dbProto[entityName] = function (pattern: any) {
                return new QueryBuilder(this.state, { entityName, pattern });
            };
            this.dbProto[entityName].schema = (this.entitySchemas as any)[entityName];
            this.blankState.entities[entityName] = {
                byKey: I.Map(),
            };
        });

        this.dbProto.with = this.reducerToMethod(dbWith);
    }

    public newDb(): Db<T> {
        const db = Object.create(this.dbProto);
        db.state = this.blankState;

        Object.keys(this.entitySchemas).forEach((entityName) => {});

        return db;
    }

    // public merge(dbs: Db<T>[]): Db<T> {
    //     return this.newDb(); // TBD
    // }

    // WIP API
    // public fk<TFrom extends keyof T, TTo extends keyof T>(
    //     fromEntityName: TFrom, fromKey: keyof T[TFrom], toEntityName: TTo, toKey: keyof T[TTo]
    // ) {
    //     return this;
    // }
}

type DbFieldSchemaRec<T> = { name: Extract<keyof T, string> } & DbFieldSchema<T>;

export class DbEntitySchema<T> {
    public fieldsList: DbFieldSchemaRec<T>[];
    public fkFields: DbFieldSchemaRec<T>[];
    public pkFields: DbFieldSchemaRec<T>[];
    public keyFields: DbFieldSchemaRec<T>[];
    constructor(public fields: DbEntityFieldsSchema<T>) {
        this.fieldsList = objectKeys(fields).map((name) => ({ name, ...(fields[name] as any) }));
        this.fkFields = this.fieldsList.filter((f) => f.fk);
        this.pkFields = this.fieldsList.filter((f) => f.pk);
        this.keyFields = this.fieldsList.filter((f) => f.pk || f.fk);
        const key = this.pkFields.map((f) => f.name);

        if (key.length == 1) {
            const singleKey = key[0];
            this.getKey = (entity) => entity[singleKey];
            this.argsToKey = (args) => args[0];
        } else {
            this.getKey = (entity) => I.List(key.map((field) => entity[field]));
            this.argsToKey = (args) => I.List(args);
        }
    }

    public getKey: (entity: T) => any;
    public argsToKey: (args: any) => any;
}
