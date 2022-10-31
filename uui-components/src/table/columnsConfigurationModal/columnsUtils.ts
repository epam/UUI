import {
    AcceptDropParams,
    ColumnsConfig,
    DataColumnProps, DropPosition,
    getOrderBetween, IColumnConfig,
} from "@epam/uui-core";
import { ColumnsConfigurationRowProps, DndDataType, GroupedColumnsType, GroupedDataColumnProps } from "./types";
import sortBy from "lodash.sortby";

export function isColumnAlwaysPinned(column: DataColumnProps) {
    return Boolean(column.isAlwaysVisible && column.fix);
}

export function canAcceptDrop(props: AcceptDropParams<DndDataType, DndDataType>) {
    const {
        srcData,
        dstData,
    } = props;

    const isMovingToUnpinnedArea = !dstData.columnConfig.fix;
    const isMovingToHiddenArea = !dstData.columnConfig.isVisible;

    const disallowDnd = isColumnAlwaysPinned(srcData.column) && isMovingToUnpinnedArea ||
        srcData.column.isAlwaysVisible && isMovingToHiddenArea;

    if (disallowDnd) {
        return {};
    }

    return { top: true, bottom: true };
}

export function getNewColumnOrder(
    props: {
        targetOrder: string,
        targetPrevOrder: string,
        targetNextOrder: string,
        position: DropPosition,
    },
) {
    const { position, targetOrder,  targetPrevOrder, targetNextOrder } = props;
    return position === 'bottom'
        ? getOrderBetween(targetOrder, targetNextOrder || null)
        : getOrderBetween(targetPrevOrder || null, targetOrder);
}

function isNonEmptyString(s: string) {
    return typeof s === 'string' && s.trim() !== '';
}
function isSubstring(s: string, sub: string) {
    return s.trim().toLowerCase().includes(sub.trim().toLowerCase());
}
export function isColumnFilteredOut(c: DataColumnProps, filter?: string) {
    const caption = c.caption as string;
    const hasCaption = isNonEmptyString(caption);
    const hasFilter = isNonEmptyString(filter);

    return hasCaption ?
        hasFilter && !isSubstring(caption, filter) :
        true;
}

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
