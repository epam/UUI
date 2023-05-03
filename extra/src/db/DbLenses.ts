import { DbRef } from './DbRef';
import { IQueryable } from './types';
import { IEditable } from '@epam/uui-core';

export class DbEntityLens<TEntities, TEntityName extends keyof TEntities> {
    constructor(private ref: DbRef<TEntities>, private entityName: TEntityName, private pattern: Partial<TEntities[TEntityName]>) {}
    get(): TEntities[TEntityName] {
        const query: IQueryable<TEntities[TEntityName]> = (this.ref.current as any)[this.entityName](this.pattern);
        return query.one();
    }

    update(patch: Partial<TEntities[TEntityName]>) {
        const entityPatch = [{ ...(patch as any), ...(this.pattern as any) }];
        const dbPatch = { [this.entityName]: entityPatch };
        this.ref.commit(dbPatch as any);
    }

    prop<TName extends keyof TEntities[TEntityName]>(name: TName): IEditable<TEntities[TEntityName][TName]> {
        return {
            value: this.get()[name],
            onValueChange: (newValue) => this.update({ [name]: newValue } as any),
        };
    }
}
