import { DataColumnProps, IColumnConfig } from "@epam/uui-core";

export type TFix = 'left' | 'right';
export type TPos = 'start' | 'end';

export enum ColGroup {
    HIDDEN = 'HIDDEN',
    DISPLAYED_PINNED = 'DISPLAYED_PINNED',
    DISPLAYED_UNPINNED = 'DISPLAYED_UNPINNED',
}

export interface IDndActorData<TItem, TId> {
    column: DataColumnProps<TItem, TId>;
    cfg: IColumnConfig;
}
