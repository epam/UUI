import React from 'react';
import { AcceptDropParams, ColumnsConfig, DataColumnProps, DropPosition, getOrderBetween, getOrderComparer, IColumnConfig } from '@epam/uui-core';
import { ColumnsConfigurationRowProps, DndDataType, GroupedColumnsType, GroupedDataColumnProps } from './types';

export function isColumnAlwaysPinned(column: DataColumnProps) {
    return Boolean(column.isAlwaysVisible && column.fix);
}

export function canAcceptDrop(props: Pick<AcceptDropParams<DndDataType, DndDataType>, 'srcData' | 'dstData'>) {
    const { srcData, dstData } = props;

    const DISALLOW = {};

    const isMovingToUnpinnedArea = !dstData.columnConfig.fix;
    const isMovingBetweenPinnedAreas = !!srcData.columnConfig.fix && !!dstData.columnConfig.fix && srcData.columnConfig.fix !== dstData.columnConfig.fix;
    const isMovingToHiddenArea = !dstData.columnConfig.isVisible;

    if (isColumnAlwaysPinned(srcData.column) && isMovingToUnpinnedArea) {
        return DISALLOW;
    }

    if (srcData.column.isAlwaysVisible && isMovingToHiddenArea) {
        return DISALLOW;
    }

    if (isMovingBetweenPinnedAreas) {
        return DISALLOW;
    }

    return { top: true, bottom: true };
}

export function getNewColumnOrder(props: { targetOrder: string; targetPrevOrder?: string; targetNextOrder?: string; position: DropPosition }) {
    const {
        position, targetOrder, targetPrevOrder, targetNextOrder,
    } = props;
    return position === 'bottom' ? getOrderBetween(targetOrder, targetNextOrder || null) : getOrderBetween(targetPrevOrder || null, targetOrder);
}

export function isEmptyCaption(s: React.ReactNode) {
    if (typeof s === 'string') {
        return isEmptyString(s);
    }
    return !s;
}

function isEmptyString(s: string) {
    return !s || s.trim() === '';
}
function isSubstring(s: React.ReactNode, sub: string) {
    if (typeof s === 'string') {
        return s.trim().toLowerCase().includes(sub.trim().toLowerCase());
    }
    return false;
}

export function isColumnAlwaysHiddenInTheConfigurationModal(column: DataColumnProps) {
    const caption = column.caption;
    return isEmptyCaption(caption);
}

export function isColumnFilteredOut(column: DataColumnProps, searchFields: string[], filter?: string) {
    const hasFilter = !isEmptyString(filter);
    const isNotSearchValue = hasFilter && !searchFields.some((searchField) => isSubstring(searchField, filter));
    if (isColumnAlwaysHiddenInTheConfigurationModal(column)) {
        return true;
    }
    return isNotSearchValue;
}

interface IGroupAndFilterSortedColumnsProps<TItem, TId, TFilter> {
    sortedColumns: ColumnsConfigurationRowProps[];
    searchValue: string;
    getSearchFields: (column: DataColumnProps<TItem, TId, TFilter>) => string[];
}

export function groupAndFilterSortedColumns<TItem, TId, TFilter>(props: IGroupAndFilterSortedColumnsProps<TItem, TId, TFilter>): GroupedColumnsType {
    const accUnsorted = {
        displayedPinnedLeft: [],
        displayedUnpinned: [],
        hidden: [],
        displayedPinnedRight: [],
    } as GroupedColumnsType;

    return props.sortedColumns.reduce((acc, cur) => {
        if (!isColumnFilteredOut(cur, props.getSearchFields(cur), props.searchValue)) {
            acc[cur.groupKey].push(cur);
        }
        return acc;
    }, accUnsorted);
}
export function findFirstByGroupKey<T extends GroupedDataColumnProps>(arr: T[], groupKey: keyof GroupedColumnsType): { column?: T; prev?: T; next?: T } {
    const { found: column, prev, next } = findFirstOrLastByCriteria(arr, (i) => i.groupKey === groupKey, true);
    return { column, prev, next };
}
export function findLastByGroupKey<T extends GroupedDataColumnProps>(arr: T[], groupKey: keyof GroupedColumnsType): { column?: T; prev?: T; next?: T } {
    const { found: column, prev, next } = findFirstOrLastByCriteria(arr, (i) => i.groupKey === groupKey, false);
    return { column, prev, next };
}
export function sortColumnsAndAddGroupKey(props: { columns: DataColumnProps[]; prevConfig: ColumnsConfig }): GroupedDataColumnProps[] {
    const { prevConfig, columns } = props;

    const comparer = getOrderComparer([{ field: 'order', direction: 'asc' }]);
    const sorted: DataColumnProps[] = [...columns].sort((a, b) => {
        const aConfig = prevConfig[a.key];
        const bConfig = prevConfig[b.key];
        return comparer(aConfig, bConfig);
    });

    return sorted.map((c: DataColumnProps) => {
        const groupKey = getGroupKey(prevConfig[c.key]);
        return { ...c, groupKey };
    });
}

function getGroupKey(columnConfig: IColumnConfig): keyof GroupedColumnsType {
    const { isVisible, fix } = columnConfig;
    if (isVisible) {
        if (fix === 'left') {
            return 'displayedPinnedLeft';
        }
        if (fix === 'right') {
            return 'displayedPinnedRight';
        }
        return 'displayedUnpinned';
    }
    return 'hidden';
}
function findFirstOrLastByCriteria<T>(arr: T[], criteria: (i: T) => boolean, isFirst: boolean): { found?: T; prev?: T; next?: T } {
    let found: T;
    let resultIndex: number;
    for (let j = 0; j < arr.length; j++) {
        const item = arr[j];
        if (criteria(item)) {
            found = item;
            resultIndex = j;
            if (isFirst) {
                break;
            }
        }
    }
    if (found) {
        const prev = arr[resultIndex - 1];
        const next = arr[resultIndex + 1];
        return { found, prev, next };
    }
    return {};
}
