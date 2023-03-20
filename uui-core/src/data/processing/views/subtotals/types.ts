export type SubtotalsSchema<TItem, TSubtotals> = {
    [K in keyof TSubtotals]: {
        get: (item: TItem, hasChildren: boolean) => TSubtotals[K],
        compute: (a: TSubtotals[K], b: TSubtotals[K]) => TSubtotals[K],
    }
};

export type SubtotalsConfig<TItem, TSubtotals> = {
    shouldCompute?: (parent: TItem) => boolean;
    schema: SubtotalsSchema<TItem, TSubtotals>;
};

export type Subtotals<TSubtotals, TId> = TSubtotals & {
    id: string;
    parentId: TId;
    isSubtotal: boolean;
};

export type SubtotalsRecord<TSubtotals, TId> = TSubtotals extends Record<infer _, infer _> ? Subtotals<TSubtotals, TId> : void;
