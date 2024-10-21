import {
    ColumnsConfig, DataColumnProps, DropPosition, IColumnConfig,
} from '@epam/uui-core';
import {
    getNewColumnOrder, findFirstByGroupKey, findLastByGroupKey, isEmptyCaption,
} from './columnsConfigurationUtils';
import { GroupedDataColumnProps, TColumnPinPosition } from './types';

export function toggleAllColumnsVisibility(props: { prevConfig: ColumnsConfig; columns: DataColumnProps[]; value: boolean }) {
    const { prevConfig, columns, value } = props;
    return Object.keys(prevConfig).reduce<ColumnsConfig>((acc, key) => {
        const prevCfg = prevConfig[key];
        const c = columns.find((column) => column.key === key);
        const isAlreadyToggled = value ? prevCfg.isVisible : !prevCfg.isVisible;
        const tryingToHideAlwaysVisible = !value && (c.isAlwaysVisible || c.isLocked);
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

export function toggleSingleColumnPin(props: { prevConfig: ColumnsConfig; columnsSorted: DataColumnProps[]; columnKey: string; fix: TColumnPinPosition }) {
    const { prevConfig, columnKey, columnsSorted, fix } = props;
    const prevColumn = prevConfig[columnKey];

    if (fix === prevColumn.fix) {
        return prevConfig;
    }

    let order = prevConfig[columnKey].order;

    const isPinOrUnpinLeft = fix === 'left' || (!fix && prevColumn.fix === 'left');
    const isPinOrUnpinRight = fix === 'right' || (!fix && prevColumn.fix === 'right');

    if (isPinOrUnpinLeft) {
        /**
         * on pin LEFT or unpin from LEFT: move before first item of unpinned list
         */
        const { column, prev, next } = findFirstByGroupKey(columnsSorted, 'displayedUnpinned');
        if (column) {
            const targetOrder = prevConfig[column.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({
                targetOrder, targetPrevOrder, targetNextOrder, position: 'top',
            });
        }
    } else if (isPinOrUnpinRight) {
        /**
         * on pin RIGHT or unpin from RIGHT: move after last item of unpinned list
         */
        const { column, prev, next } = findLastByGroupKey(columnsSorted, 'displayedUnpinned');
        if (column) {
            const targetOrder = prevConfig[column.key]?.order;
            const targetPrevOrder = prevConfig[prev?.key]?.order;
            const targetNextOrder = prevConfig[next?.key]?.order;
            order = getNewColumnOrder({
                targetOrder, targetPrevOrder, targetNextOrder, position: 'bottom',
            });
        }
    } else {
        // If 'fix' is not changed, prev config is returned
        return prevConfig;
    }

    return {
        ...prevConfig,
        [columnKey]: {
            ...prevColumn,
            order,
            fix,
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
