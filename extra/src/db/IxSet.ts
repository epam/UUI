import { SortDirection } from '@epam/uui-core';

export interface ColumnOrder {
    name: string;
    dir: SortDirection;
}

export interface IxSetQuery<T> {
    pattern?: object;
    order?: ColumnOrder[];
    range?: { from: number; count: number };
}

export class IxSet<T> {
    constructor(private items: T[], prev?: IxSet<T>) {}
    public query(q: IxSetQuery<T>) {}
}
