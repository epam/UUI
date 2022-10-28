import { ColumnsConfig, DataColumnProps, DropPosition } from "@epam/uui-core";
import {
    getNewColumnOrder,
} from "./columnsProperties";
import { findFirstInGroup, findLastInGroup } from "./columnsGroupService";
import { ICanBeFixed } from "./types";

export function toggleAllColumnsVisibility(props: { prevConfig: ColumnsConfig, columns: DataColumnProps[], value: boolean }) {
    const { prevConfig, columns, value } = props;
    return Object.keys(prevConfig).reduce<ColumnsConfig>((acc, key) => {
        const prevCfg = prevConfig[key];
        const isAlreadyToggled = value ? prevCfg.isVisible : !prevCfg.isVisible;
        const tryingToHideAlwaysVisible = !value && columns.find(c => c.key === key).isAlwaysVisible;
        const noChangeRequired = isAlreadyToggled || tryingToHideAlwaysVisible;
        if (noChangeRequired) {
            acc[key] = prevCfg;
        } else {
            const { fix, ...prevCfgNoFix } = prevCfg;
            acc[key] = {
                ...prevCfgNoFix,
                isVisible: value,
            };
        }
        return acc;
    }, {});
}

export function moveColumnRelativeToAnotherColumn(
    props: { prevConfig: ColumnsConfig, columnsSorted: DataColumnProps[], columnKey: string, targetColumnKey: string,
        position: DropPosition },
) {
    const { prevConfig, columnsSorted, columnKey, targetColumnKey, position } = props;
    const isVisible = prevConfig[targetColumnKey].isVisible;
    const order = getNewColumnOrder({ targetColumnKey, position, columnsSorted, prevConfig });
    const fix = prevConfig[targetColumnKey].fix;

    return {
        ...prevConfig,
        [columnKey]: {
            ...prevConfig[columnKey],
            order,
            isVisible,
            fix,
        },
    };
}

export function toggleSingleColumnPin(
    props: { prevConfig: ColumnsConfig, columnsSorted: DataColumnProps[], columnKey: string },
) {
    const { prevConfig, columnKey, columnsSorted } = props;
    const cfg = prevConfig[columnKey];
    const prevFix = cfg.fix;
    let order = prevConfig[columnKey].order;
    if (prevFix) {
        // move to "displayedUnpinned" and put it before first item
        const firstItemInDisplayedUnpinned = findFirstInGroup(columnsSorted, prevConfig, 'displayedUnpinned');
        if (firstItemInDisplayedUnpinned) {
            order = getNewColumnOrder({ targetColumnKey: firstItemInDisplayedUnpinned.key, columnsSorted, position: 'top', prevConfig });
        }
    } else {
        // move to "displayedPinned" and put it after last item
        const lastItemInDisplayedPinned = findLastInGroup(columnsSorted, prevConfig, 'displayedPinned');
        if (lastItemInDisplayedPinned) {
            order = getNewColumnOrder({ targetColumnKey: lastItemInDisplayedPinned.key, columnsSorted, position: 'bottom', prevConfig });
        }
    }
    const { fix, ...restProps } = prevConfig[columnKey];
    const fixLeft: ICanBeFixed = { fix: 'left' };
    return {
        ...prevConfig,
        [columnKey]: {
            ...restProps,
            order,
            ...(prevFix ? {} : fixLeft),
            isVisible: true,
        },
    };
}

export function toggleSingleColumnVisibility(
    props: { prevConfig: ColumnsConfig, columnsSorted: DataColumnProps[], columnKey: string },
) {
    const { columnsSorted, columnKey, prevConfig } = props;
    const prevIsVisible = prevConfig[columnKey].isVisible;
    let order = prevConfig[columnKey].order;
    if (prevIsVisible) {
        // move to "hidden" group and put it before first item
        const firstItemInHidden = findFirstInGroup(columnsSorted, prevConfig, 'hidden');
        if (firstItemInHidden) {
            order = getNewColumnOrder({ targetColumnKey: firstItemInHidden.key, columnsSorted, position: 'top', prevConfig });
        }
    } else {
        // going to move to "displayedUnpinned" group and put it after last item
        const lastItemInDisplayedUnpinned = findLastInGroup(columnsSorted, prevConfig, 'displayedUnpinned');
        if (lastItemInDisplayedUnpinned) {
            order = getNewColumnOrder({ targetColumnKey: lastItemInDisplayedUnpinned.key, columnsSorted, position: 'bottom', prevConfig });
        }
    }
    const { fix, isVisible, ...restProps } = prevConfig[columnKey];
    return {
        ...prevConfig,
        [columnKey]: {
            ...restProps,
            isVisible: !prevIsVisible,
            order,
        },
    };
}
