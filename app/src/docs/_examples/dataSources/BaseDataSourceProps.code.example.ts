import { DataRowOptions } from '@epam/uui-core';

export interface Props<TItem, TId, TFilter> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem): boolean;

    cascadeSelection?: boolean | 'implicit' | 'explicit';
    selectAll?: true | false;
}
