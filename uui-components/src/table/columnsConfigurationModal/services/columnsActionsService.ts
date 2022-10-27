import { ColumnsConfig, DataColumnProps } from "@epam/uui-core";
import {
    getColumnOrderAfterDrop,
} from "./columnsPropertiesService";
import { findFirstInGroup, findLastInGroup } from "./columnsGroupService";
import { TFix } from "../types";

export function toggleAllColumnsVisibility(props: { prevConfig: ColumnsConfig, columns: DataColumnProps[], isToggleOn: boolean }) {
    const { prevConfig, columns, isToggleOn } = props;
    return Object.keys(prevConfig).reduce<ColumnsConfig>((acc, key) => {
        const prevCfg = prevConfig[key];
        const isAlreadyToggled = isToggleOn ? prevCfg.isVisible : !prevCfg.isVisible;
        const tryingToHideAlwaysVisible = !isToggleOn && columns.find(c => c.key === key).isAlwaysVisible;
        const noChangeRequired = isAlreadyToggled || tryingToHideAlwaysVisible;
        if (noChangeRequired) {
            acc[key] = prevCfg;
        } else {
            acc[key] = {
                ...prevCfg,
                isVisible: isToggleOn,
                fix: undefined,
            };
        }
        return acc;
    }, {});
}

export function moveColumnRelativeToAnotherColumn(
    props: { prevConfig: ColumnsConfig, columnsSorted: DataColumnProps[], columnKey: string, targetColumnKey: string, isAfterTarget: boolean },
) {
    const { prevConfig, columnsSorted, columnKey, targetColumnKey, isAfterTarget } = props;
    const isVisible = prevConfig[targetColumnKey].isVisible;
    const order = getColumnOrderAfterDrop({ targetColumnKey, isAfterTarget, columnsSorted, prevConfig });
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
    let isVisible;
    if (prevFix) {
        // move to "displayedUnpinned" and put it before first item
        const firstItemInDisplayedUnpinned = findFirstInGroup(columnsSorted, prevConfig, 'displayedUnpinned');
        if (firstItemInDisplayedUnpinned) {
            order = getColumnOrderAfterDrop({ targetColumnKey: firstItemInDisplayedUnpinned.key, columnsSorted, isAfterTarget: false, prevConfig });
        }
    } else {
        // move to "displayedPinned" and put it after last item
        const lastItemInDisplayedPinned = findLastInGroup(columnsSorted, prevConfig, 'displayedPinned');
        if (lastItemInDisplayedPinned) {
            order = getColumnOrderAfterDrop({ targetColumnKey: lastItemInDisplayedPinned.key, columnsSorted, isAfterTarget: true, prevConfig });
        }
    }
    const { fix, ...restProps } = prevConfig[columnKey];
    const fixLeft: TFix = 'left';
    return {
        ...prevConfig,
        [columnKey]: {
            ...restProps,
            order,
            ...(prevFix ? {} : { fix: fixLeft }),
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
            order = getColumnOrderAfterDrop({ targetColumnKey: firstItemInHidden.key, columnsSorted, isAfterTarget: false, prevConfig });
        }
    } else {
        // going to move to "displayedUnpinned" group and put it after last item
        const lastItemInDisplayedUnpinned = findLastInGroup(columnsSorted, prevConfig, 'displayedUnpinned');
        if (lastItemInDisplayedUnpinned) {
            order = getColumnOrderAfterDrop({ targetColumnKey: lastItemInDisplayedUnpinned.key, columnsSorted, isAfterTarget: true, prevConfig });
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
