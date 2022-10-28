import { ColumnsConfig, DataColumnProps, DropPosition, IColumnConfig } from "@epam/uui-core";
import { getNewColumnOrder, findFirstByGroupKey, findLastByGroupKey } from "./columnsUtils";
import { GroupedDataColumnProps, ICanBeFixed } from "./types";

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
    props: {
        columnConfig: IColumnConfig, position: DropPosition,
        targetColumn: IColumnConfig, targetNextColumn: IColumnConfig, targetPrevColumn: IColumnConfig,
    },
): IColumnConfig {
    const { columnConfig, position, targetColumn, targetPrevColumn, targetNextColumn } = props;
    const targetOrder = targetColumn?.order;
    const targetNextOrder = targetNextColumn?.order;
    const targetPrevOrder = targetPrevColumn?.order;
    const order = getNewColumnOrder({ targetOrder, targetNextOrder, targetPrevOrder, position });
    return {
        ...columnConfig,
        order,
        isVisible: targetColumn.isVisible,
        fix: targetColumn.fix,
    };
}

export function toggleSingleColumnPin(
    props: { prevConfig: ColumnsConfig, columnsSorted: DataColumnProps[], columnKey: string },
) {
    const { prevConfig, columnKey, columnsSorted } = props;
    const column = prevConfig[columnKey];
    const prevFix = column.fix;
    let order = prevConfig[columnKey].order;
    if (prevFix) {
        // move to "displayedUnpinned" and put it before first item
        const { found, prev, next } = findFirstByGroupKey(columnsSorted, 'displayedUnpinned');
        if (found) {
            const targetOrder = prevConfig[found.key]?.order;
            const targetPrevOrder = prevConfig[prev.key]?.order;
            const targetNextOrder = prevConfig[next.key]?.order;
            order = getNewColumnOrder({ targetOrder, targetPrevOrder, targetNextOrder, position: 'top' });
        }
    } else {
        // move to "displayedPinned" and put it after last item
        const { found, prev, next } = findLastByGroupKey(columnsSorted, 'displayedPinned');
        if (found) {
            const targetOrder = prevConfig[found.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({ targetOrder, targetPrevOrder, targetNextOrder, position: 'bottom' });
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
    props: { prevConfig: ColumnsConfig, columnsSorted: GroupedDataColumnProps[], columnKey: string },
) {
    const { columnsSorted, columnKey, prevConfig } = props;
    const prevIsVisible = prevConfig[columnKey].isVisible;
    let order = prevConfig[columnKey].order;
    if (prevIsVisible) {
        // move to "hidden" group and put it before first item
        const { found, prev, next } = findFirstByGroupKey(columnsSorted, 'hidden');
        if (found) {
            const targetOrder = prevConfig[found.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({ targetOrder, targetPrevOrder, targetNextOrder, position: 'top' });
        }
    } else {
        // going to move to "displayedUnpinned" group and put it after last item
        const { found, prev, next } = findLastByGroupKey(columnsSorted, 'displayedUnpinned');
        if (found) {
            const targetOrder = prevConfig[found.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({ targetOrder, targetPrevOrder, targetNextOrder, position: 'bottom' });
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
