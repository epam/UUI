import { IManageableColumn } from "../types";
import { isColumnFilteredOut } from "./columnsPropertiesService";
import { ColumnsConfig, DataColumnProps, IColumnConfig } from "@epam/uui-core";

export type GroupedColumnsType<T extends DataColumnProps> = {
    hidden: T[],
    displayedUnpinned: T[],
    displayedPinned: T[],
};

export function groupSortedColumns(
    sortedColumns: IManageableColumn[],
    filterValue: string,
): GroupedColumnsType<IManageableColumn> {
    const accUnsorted = {
        displayedPinned: [],
        displayedUnpinned: [],
        hidden: [],
    } as GroupedColumnsType<IManageableColumn>;

    return sortedColumns.reduce((acc, i) => {
        if (!isColumnFilteredOut(i, filterValue)) {
            const groupKey = getGroupKey(i, i.columnConfig);
            acc[groupKey].push(i);
        }
        return acc;
    }, accUnsorted);
}

export function findFirstInGroup<T extends DataColumnProps>(arr: T[], prevConfig: ColumnsConfig, groupKey: keyof GroupedColumnsType<T>): T {
    return findFirstOrLastByCriteria(arr, i => getGroupKey(i, prevConfig[i.key]) === groupKey, true);
}
export function findLastInGroup<T extends DataColumnProps>(arr: T[], prevConfig: ColumnsConfig, groupKey: keyof GroupedColumnsType<T>): T {
    return findFirstOrLastByCriteria(arr, i => getGroupKey(i, prevConfig[i.key]) === groupKey, false);
}

function getGroupKey(column: DataColumnProps, columnConfig: IColumnConfig): keyof GroupedColumnsType<IManageableColumn> {
    const { isVisible, fix } = columnConfig;
    if (isVisible) {
        if (fix) {
            return 'displayedPinned';
        }
        return 'displayedUnpinned';
    }
    return 'hidden';
}

function findFirstOrLastByCriteria<T>(arr: T[], criteria: (i: T) => boolean, isFirst: boolean): T {
    let result: T;
    for (let j = 0; j < arr.length; j++) {
        const item = arr[j];
        if (criteria(item)) {
            result = item;
            if (isFirst) {
                break;
            }
        }
    }
    return result;
}
