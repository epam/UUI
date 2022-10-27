import {
    AcceptDropParams,
    ColumnsConfig,
    DataColumnProps,
    getOrderBetween,
} from "@epam/uui-core";
import { DndDataType } from "../types";

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

export function getColumnOrderAfterDrop(
    props: { targetColumnKey: string, isAfterTarget: boolean, columnsSorted: DataColumnProps[], prevConfig: ColumnsConfig },
) {
    const { columnsSorted, isAfterTarget, targetColumnKey, prevConfig } = props;
    const targetColumnOrder = prevConfig[targetColumnKey].order;
    let prevKey;
    let nextKey;
    for (let i = 0; i < columnsSorted.length; i++) {
        if (columnsSorted[i].key === targetColumnKey) {
            prevKey = columnsSorted[i - 1]?.key;
            nextKey = columnsSorted[i + 1]?.key;
            break;
        }
    }
    return isAfterTarget
        ? getOrderBetween(targetColumnOrder, nextKey ? prevConfig[nextKey].order : null)
        : getOrderBetween(prevKey ? prevConfig[prevKey].order : null, targetColumnOrder);
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
