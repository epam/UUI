import { ColumnsConfig, DataColumnProps } from "@epam/uui-core";
import { TItemsByGroup } from "../hooks/useGroupedItems";
import {
    getColGroupByColumnKey,
    getColumnFixAfterDrop,
    getColumnOrderAfterDrop,
    isVisibleColGroup,
} from "./columnsPropertiesService";
import { ColGroup, TPos } from "./types";

export function toggleColumnsVisibility(props: { prevConfig: ColumnsConfig, columns: DataColumnProps[], isToggleOn: boolean }) {
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
    const {
        prevConfig,
        columnsSorted,
        columnKey,
        targetColumnKey,
        isAfterTarget,
    } = props;

    const from = getColGroupByColumnKey(columnKey, prevConfig);
    const to = getColGroupByColumnKey(targetColumnKey, prevConfig);
    const isVisible = isVisibleColGroup(to);
    const order = getColumnOrderAfterDrop({ targetColumnKey, isAfterTarget, columnsSorted, prevConfig });
    const fix = getColumnFixAfterDrop(from, to, prevConfig);

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

export function togglePinOfAColumn(
    props: { prevConfig: ColumnsConfig, byGroup: TItemsByGroup<DataColumnProps>, columnsSorted: DataColumnProps[], columnKey: string },
) {
    const { prevConfig, columnKey, columnsSorted, byGroup } = props;
    const cfg = prevConfig[columnKey];
    const prevFix = cfg.fix;

    let to;
    let toPosition: TPos;
    if (prevFix) {
        to = ColGroup.DISPLAYED_UNPINNED;
        toPosition = 'start';
    } else {
        to = ColGroup.DISPLAYED_PINNED;
        toPosition = 'end';
    }
    return moveColumnToAGroup({
        prevConfig, columnKey, to, toPosition, columnsSorted,
        byGroup,
    });
}

export function toggleVisibilityOfAColumn(
    props: { prevConfig: ColumnsConfig, byGroup: TItemsByGroup<DataColumnProps>, columnsSorted: DataColumnProps[], columnKey: string },
) {
    const { byGroup, columnsSorted, columnKey, prevConfig } = props;
    const from = getColGroupByColumnKey(columnKey, prevConfig);
    let to;
    let toPosition: TPos;
    if (isVisibleColGroup(from)) {
        to = ColGroup.HIDDEN;
        toPosition = 'start';
    } else {
        to = ColGroup.DISPLAYED_UNPINNED;
        toPosition = 'end';
    }
    return moveColumnToAGroup({ prevConfig, columnKey, to, toPosition, columnsSorted, byGroup });
}


function moveColumnToAGroup(
    props: { prevConfig: ColumnsConfig, columnsSorted: DataColumnProps[], byGroup: TItemsByGroup<DataColumnProps>, columnKey: string, to: ColGroup, toPosition: TPos },
) {
    const { to, columnKey, toPosition, columnsSorted, prevConfig, byGroup } = props;
    const from = getColGroupByColumnKey(columnKey, prevConfig);
    const isAlwaysVisible = columnsSorted.find(c => c.key === columnKey).isAlwaysVisible;
    if (from === to || to === ColGroup.HIDDEN && isAlwaysVisible) {
        return prevConfig;
    }
    const { items } = byGroup[to];
    const targetColumnKey = toPosition === 'end' && items?.length ? items[items.length - 1].key : items?.[0]?.key;
    if (targetColumnKey) {
        return moveColumnRelativeToAnotherColumn({
            prevConfig,
            columnsSorted,
            columnKey,
            targetColumnKey,
            isAfterTarget: toPosition === 'end',
        });
    } else {
        const isVisible = isVisibleColGroup(to);
        const fix = getColumnFixAfterDrop(from, to, prevConfig);
        return {
            ...prevConfig,
            [columnKey]: {
                ...prevConfig[columnKey],
                isVisible,
                fix,
            },
        };
    }
}
