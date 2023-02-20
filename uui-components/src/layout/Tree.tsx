import * as React from 'react';
import { IHasCX, IHasChildren, IEditable, useArrayDataSource, DataSourceState, DataRowProps } from '@epam/uui-core';

export interface TreeListItem {
    id: string;
    data?: TreeListItem;
    parentId?: string;
    name?: string;
}

export interface TreeProps<TItem extends TreeListItem> extends IHasCX, IHasChildren, IEditable<DataSourceState> {
    items: TreeListItem[];
    renderRow(row: DataRowProps<TItem, string>): void;
    getSearchFields?(item: TItem): string[];
    search?: string;
}

export function Tree<TItem extends TreeListItem>(props: TreeProps<TItem>) {
    const dataSource = useArrayDataSource<TItem, string, unknown>(
        {
            items: props.items as TItem[],
            getId: i => i.id,
        },
        [props.items]
    );

    const view = dataSource.useView({ ...props.value, topIndex: 0, visibleCount: Number.MAX_SAFE_INTEGER }, props.onValueChange, {
        getParentId: i => i.parentId,
        getSearchFields: props.getSearchFields || (i => [i.name]),
    });

    const rows = view.getVisibleRows();

    if (rows.length === 0) return null;

    return <>{rows.map(i => props.renderRow(i))}</>;
}
