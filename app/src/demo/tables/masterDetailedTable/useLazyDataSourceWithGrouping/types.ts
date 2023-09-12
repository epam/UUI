import { GroupingConfigBuilder } from './groupingConfigBuilder';

export type UnboxGroupsFromUnion<TypeField extends keyof Record, Record extends { [k in TypeField]: string }> = {
    [typename in Record[TypeField]]: Extract<Record, { [k in TypeField]: typename }>;
};

export type UnboxUnionFromGroups<TGroups> = TGroups[keyof TGroups];

export interface GetType<TGroups, TId> {
    getType: (entity: UnboxUnionFromGroups<TGroups>) => string;
    getTypeAndId: (id: TId) => [keyof TGroups, string | number];
}
