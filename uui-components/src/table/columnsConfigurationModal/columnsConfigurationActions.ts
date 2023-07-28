import {
    ColumnsConfig, DataColumnProps, DropPosition, ICanBeFixed, IColumnConfig,
} from '@epam/uui-core';
import {
    getNewColumnOrder, findFirstByGroupKey, findLastByGroupKey, isEmptyCaption,
} from './columnsConfigurationUtils';
import { GroupedDataColumnProps } from './types';

export function toggleAllColumnsVisibility(props: { prevConfig: ColumnsConfig; columns: DataColumnProps[]; value: boolean }) {
    const { prevConfig, columns, value } = props;
    return Object.keys(prevConfig).reduce<ColumnsConfig>((acc, key) => {
        const prevCfg = prevConfig[key];
        const c = columns.find((column) => column.key === key);
        const isAlreadyToggled = value ? prevCfg.isVisible : !prevCfg.isVisible;
        const tryingToHideAlwaysVisible = !value && c.isAlwaysVisible;
        const noChangeRequired = isAlreadyToggled || tryingToHideAlwaysVisible || isEmptyCaption(c.caption);
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

export function moveColumnRelativeToAnotherColumn(props: {
    columnConfig: IColumnConfig;
    position: DropPosition;
    targetColumn: IColumnConfig;
    targetNextColumn: IColumnConfig;
    targetPrevColumn: IColumnConfig;
}): IColumnConfig {
    const {
        columnConfig, position, targetColumn, targetPrevColumn, targetNextColumn,
    } = props;
    const targetOrder = targetColumn?.order;
    const targetNextOrder = targetNextColumn?.order;
    const targetPrevOrder = targetPrevColumn?.order;
    const order = getNewColumnOrder({
        targetOrder, targetNextOrder, targetPrevOrder, position,
    });
    return {
        ...columnConfig,
        order,
        isVisible: targetColumn.isVisible,
        fix: targetColumn.fix,
    };
}

export function toggleSingleColumnPin(props: { prevConfig: ColumnsConfig; columnsSorted: DataColumnProps[]; columnKey: string }) {
    const { prevConfig, columnKey, columnsSorted } = props;
    const column = prevConfig[columnKey];
    const prevFix = column.fix;
    let order = prevConfig[columnKey].order;
    if (prevFix) {
        // move to "displayedUnpinned" and put it before first item
        const { column: firstColumn, prev, next } = findFirstByGroupKey(columnsSorted, 'displayedUnpinned');
        if (firstColumn) {
            const targetOrder = prevConfig[firstColumn.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({
                targetOrder, targetPrevOrder, targetNextOrder, position: 'top',
            });
        }
    } else {
        // move to "displayedPinned" and put it after last item
        const { column: lastColumn, prev, next } = findLastByGroupKey(columnsSorted, 'displayedPinned');
        if (lastColumn) {
            const targetOrder = prevConfig[lastColumn.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({
                targetOrder, targetPrevOrder, targetNextOrder, position: 'bottom',
            });
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

export function toggleSingleColumnVisibility(props: { prevConfig: ColumnsConfig; columnsSorted: GroupedDataColumnProps[]; columnKey: string }) {
    const { columnsSorted, columnKey, prevConfig } = props;
    const prevIsVisible = prevConfig[columnKey].isVisible;
    let order = prevConfig[columnKey].order;
    if (prevIsVisible) {
        // move to "hidden" group and put it before first item
        const { column, prev, next } = findFirstByGroupKey(columnsSorted, 'hidden');
        if (column) {
            const targetOrder = prevConfig[column.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({
                targetOrder, targetPrevOrder, targetNextOrder, position: 'top',
            });
        }
    } else {
        // going to move to "displayedUnpinned" group and put it after last item
        const { column, prev, next } = findLastByGroupKey(columnsSorted, 'displayedUnpinned');
        if (column) {
            const targetOrder = prevConfig[column.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({
                targetOrder, targetPrevOrder, targetNextOrder, position: 'bottom',
            });
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
