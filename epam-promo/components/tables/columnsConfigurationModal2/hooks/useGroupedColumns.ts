import { useCallback } from "react";
import { ColumnsConfig, DataColumnProps, getOrderBetween } from "@epam/uui-core";
import { TItemsByGroup, useGroupedItems } from "./useGroupedItems";
import { ColGroup } from "./useColumnsConfigurationState";

type TFix = 'left' | 'right';

interface IUseGroupedColumns {
    filter: string;
    config: ColumnsConfig;
    columnsSorted: DataColumnProps[];
}

interface IUseGroupedColumnsResult {
    byGroup: TItemsByGroup<DataColumnProps>;
    moveColumn: (prevConfig: ColumnsConfig, columnKey: string, targetColumnKey: string, isAfterTarget: boolean) => ColumnsConfig;
    moveColumnToGroup: (prevConfig: ColumnsConfig, columnKey: string, toGroup: ColGroup, toPosition: 'start' | 'end') => ColumnsConfig;
}

function getColumnOrderAfterDrop(targetColumnKey: string, isAfterTarget: boolean, columnsSorted: DataColumnProps[], config: ColumnsConfig) {
    const targetColumnOrder = config[targetColumnKey].order;
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
        ? getOrderBetween(targetColumnOrder, nextKey ? config[nextKey].order : null)
        : getOrderBetween(prevKey ? config[prevKey].order : null, targetColumnOrder);
}

function getColumnFixAfterDrop(from: ColGroup, to: ColGroup, config: ColumnsConfig): TFix {
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

function isColumnVisible(c: DataColumnProps, filter?: string) {
    const caption = c.caption as string;
    const hasCaption = typeof caption === 'string' && caption.trim() !== '';
    const hasFilter = typeof filter === 'string' && filter.trim() !== '';
    if (hasCaption) {
        if (hasFilter) {
            const captionNormalized = caption.trim().toLowerCase();
            return captionNormalized.includes(filter.toLowerCase());
        }
        return true;
    }
    return false;
}

export function isVisibleColGroup(g: ColGroup) {
    return g === ColGroup.DISPLAYED_UNPINNED || g === ColGroup.DISPLAYED_PINNED;
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

export function useGroupedColumns(props: IUseGroupedColumns): IUseGroupedColumnsResult {
    const { filter, config, columnsSorted } = props;

    const handleGetGroupByKey = useCallback((key: string) => {
        return getColGroupByColumnKey(key, config);
    }, [config]);

    const handleGetGroup = useCallback((column: DataColumnProps) => {
        return handleGetGroupByKey(column.key);
    }, [handleGetGroupByKey]);

    const handleFilter = useCallback(column => {
        return isColumnVisible(column, filter);
    }, [filter]);

    const { byGroup } = useGroupedItems({
        items: columnsSorted,
        onFilter: handleFilter,
        onGetGroup: handleGetGroup,
    });

    const moveColumn = useCallback((prevConfig: ColumnsConfig, columnKey: string, targetColumnKey: string, isAfterTarget: boolean): ColumnsConfig => {
        const from = handleGetGroupByKey(columnKey);
        const to = handleGetGroupByKey(targetColumnKey);
        const isVisible = isVisibleColGroup(to);
        const order = getColumnOrderAfterDrop(targetColumnKey, isAfterTarget, columnsSorted, prevConfig);
        const fix = getColumnFixAfterDrop(from, to, config);

        return {
            ...prevConfig,
            [columnKey]: {
                ...prevConfig[columnKey],
                order,
                isVisible,
                fix,
            },
        };
    }, [handleGetGroupByKey, columnsSorted, config]);

    const moveColumnToGroup = useCallback((prevConfig: ColumnsConfig, columnKey: string, to: ColGroup, toPosition: 'start' | 'end') => {
        const from = handleGetGroupByKey(columnKey);
        if (from === to) {
            return prevConfig;
        }
        const { items } = byGroup[to];
        const targetColumnKey = toPosition === 'end' ? items[items.length - 1]?.key : items[0]?.key;
        if (targetColumnKey) {
            return moveColumn(prevConfig, columnKey, targetColumnKey, toPosition === 'end');
        } else {
            const isVisible = isVisibleColGroup(to);
            const fix = getColumnFixAfterDrop(from, to, config);
            return {
                ...prevConfig,
                [columnKey]: {
                    ...prevConfig[columnKey],
                    isVisible,
                    fix,
                },
            };
        }
    }, [handleGetGroupByKey, byGroup, moveColumn, config]);

    return {
        byGroup,
        moveColumn,
        moveColumnToGroup,
    };
}
