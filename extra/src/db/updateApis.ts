import {
    DbState, DbPatch, EntitiesState, EntityState, Db,
} from './types';
import { DbEntitySchema } from './DbSchema';
import { Map, Seq, Set } from 'immutable';
import { DbSchema } from './DbSchema';
import { objectKeys } from './helpers';

function entitiesWith(input: object[], state: EntityState, schema: DbEntitySchema<any>): EntityState {
    const idVal = Seq.Keyed(input.map((entity) => [schema.getKey(entity), entity]));
    const byKey = state.byKey.mergeWith((existing, update) => ({ ...existing, ...update }), idVal);
    return {
        byKey,
    };
}

export const dbWith = (input: DbPatch<any>) => (state: DbState) => {
    const entities: EntitiesState = {};
    const schema = state.schema;
    objectKeys(schema.entitySchemas).forEach((entityName) => {
        if (input[entityName]) {
            entities[entityName] = entitiesWith(input[entityName], state.entities[entityName], schema.entitySchemas[entityName]);
        } else {
            entities[entityName] = state.entities[entityName];
        }
    });

    return {
        ...state,
        entities,
        cache: {},
    } as DbState;
};

/*
function entitiesMerge(
    states: EntityState[],
    schema: DbEntitySchema<any>
): EntityState {
    const result: EntityState = null;

    states.forEach(s => {
        const idVal = Seq.Keyed(input.map(entity => [schema.getKey(entity), entity]));
        const byKey = state.byKey.mergeWith(
            (existing, update) => ({ ...existing, ...update }),
            idVal
        );
        return {
            byKey
        }
    })
}

export function dbMerge<T>(schema: DbSchema<T>, states: DbState[]): DbState {
    const result: DbState = null;
    states.forEach(db => {
        if (result == null) {
            return db;
        } else {
            Object.keys(schema.entitySchemas).forEach(entityName => {
                const leftTable = result.entities[entityName];
                const rightTable = result.entities[entityName];

                if (entityPatch) {
                    patch[entityName] = entitiesWith(patch[entityName], state.entities[entityName], schema.entitySchemas[entityName]);
                } else {
                    patch[entityName] = state.entities[entityName];
                }
            });
        }
    })

    return result;
}
*/
