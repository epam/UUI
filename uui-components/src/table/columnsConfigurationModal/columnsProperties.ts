import {
    AcceptDropParams,
    ColumnsConfig,
    DataColumnProps, DropPosition,
    getOrderBetween,
} from "@epam/uui-core";
import { DndDataType, GroupedDataColumnProps } from "./types";

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
