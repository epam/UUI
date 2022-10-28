import { GroupedColumnsType, GroupedDataColumnProps, ColumnsConfigurationRowProps } from "./types";
import { isColumnFilteredOut } from "./columnsProperties";
import { ColumnsConfig, DataColumnProps, IColumnConfig } from "@epam/uui-core";
import sortBy from "lodash.sortby";

export function groupSortedColumns(
    sortedColumns: ColumnsConfigurationRowProps[],
    searchValue: string,
): GroupedColumnsType<ColumnsConfigurationRowProps> {
    const accUnsorted = {
        displayedPinned: [],
        displayedUnpinned: [],
        hidden: [],
    } as GroupedColumnsType<ColumnsConfigurationRowProps>;

    return sortedColumns.reduce((acc, i) => {
        if (!isColumnFilteredOut(i, searchValue)) {
            acc[i.groupKey].push(i);
        }
        return acc;
    }, accUnsorted);
}
export function findFirstByGroupKey<T extends GroupedDataColumnProps>(arr: T[], groupKey: keyof GroupedColumnsType<T>): { found?: T, prev?: T, next?: T } {
    return findFirstOrLastByCriteria(arr, i => i.groupKey === groupKey, true);
}
export function findLastByGroupKey<T extends GroupedDataColumnProps>(arr: T[], groupKey: keyof GroupedColumnsType<T>): { found?: T, prev?: T, next?: T } {
    return findFirstOrLastByCriteria(arr, i => i.groupKey === groupKey, false);
}
export function sortColumnsAndAddGroupKey(props: { columns: DataColumnProps[], prevConfig: ColumnsConfig }): GroupedDataColumnProps[] {
    const { prevConfig, columns } = props;
    const sorted: DataColumnProps[] = sortBy(columns, i => prevConfig[i.key].order);
    return sorted.map((c: DataColumnProps) => {
        const groupKey = getGroupKey(c, prevConfig[c.key]);
        return { ...c, groupKey };
    });
}

function getGroupKey(column: DataColumnProps, columnConfig: IColumnConfig): keyof GroupedColumnsType<ColumnsConfigurationRowProps> {
    const { isVisible, fix } = columnConfig;
    if (isVisible) {
        if (fix) {
            return 'displayedPinned';
        }
        return 'displayedUnpinned';
    }
    return 'hidden';
}
function findFirstOrLastByCriteria<T>(arr: T[], criteria: (i: T) => boolean, isFirst: boolean): { found?: T, prev?: T, next?: T } {
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
