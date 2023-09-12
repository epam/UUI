export type UnboxGroupsFromUnion<TypeField extends keyof Record, Record extends { [k in TypeField]: string }> = {
    [typename in Record[TypeField]]: Extract<Record, { [k in TypeField]: typename }>;
};

export type UnboxUnionFromGroups<TGroups> = TGroups[keyof TGroups];

export interface GetType<TGroups, TId, TFilter> {
    getType: (entity: UnboxUnionFromGroups<TGroups>) => keyof TGroups;
    getTypeAndId: (id: TId) => [keyof TGroups, string | number];
    getGroupBy: (filter: TFilter) => string;
}
