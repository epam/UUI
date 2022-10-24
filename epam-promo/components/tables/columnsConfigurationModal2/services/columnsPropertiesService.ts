import { AcceptDropParams, ColumnsConfig, DataColumnProps, getOrderBetween } from "@epam/uui-core";
import { ColGroup, IDndActorData, TFix } from "./types";

export function isColumnAlwaysPinned<TItem, TId>(props: IDndActorData<TItem, TId>) {
    const isPinned = Boolean(props.cfg.fix);
    return props.column.isAlwaysVisible && isPinned;
}

export function canAcceptDrop<TItem, TId>(props: AcceptDropParams<IDndActorData<TItem, TId>, IDndActorData<TItem, TId>>) {
    const {
        srcData,
        dstData,
    } = props;

    const isMovingToUnpinnedArea = !dstData.cfg.fix;
    const isMovingToHiddenArea = !dstData.cfg.isVisible;

    const disallowDnd = isColumnAlwaysPinned(srcData) && isMovingToUnpinnedArea ||
        srcData.column.isAlwaysVisible && isMovingToHiddenArea;

    if (disallowDnd) {
        return {};
    }

    return { top: true, bottom: true };
}

export function getColGroupByColumnKey(key: string, config: ColumnsConfig) {
    const { isVisible, fix } = config[key];
    if (isVisible) {
        if (fix) {
            return ColGroup.DISPLAYED_PINNED;
        }
        return ColGroup.DISPLAYED_UNPINNED;
    }
    return ColGroup.HIDDEN;
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

export function getColumnFixAfterDrop(from: ColGroup, to: ColGroup, config: ColumnsConfig): TFix {
    let fix: TFix;
    if (to === ColGroup.DISPLAYED_PINNED) {
        if (from === ColGroup.DISPLAYED_PINNED) {
            fix = config.fix as TFix;
        } else {
            fix = 'left';
        }
    }
    return fix;
}

function isNonEmptyString(s: string) {
    return typeof s === 'string' && s.trim() !== '';
}
function isSubstring(s: string, sub: string) {
    return s.trim().toLowerCase().includes(sub.trim().toLowerCase());
}
export function isColumnVisible(c: DataColumnProps, filter?: string) {
    const caption = c.caption as string;
    const hasCaption = isNonEmptyString(caption);
    const hasFilter = isNonEmptyString(filter);

    return hasCaption ?
        !hasFilter || hasFilter && isSubstring(caption, filter) :
        false;
}

export function isVisibleColGroup(g: ColGroup) {
    return g === ColGroup.DISPLAYED_UNPINNED || g === ColGroup.DISPLAYED_PINNED;
}
