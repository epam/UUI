import { ColumnsConfig, DataColumnProps } from '../types';
import sortBy from 'lodash.sortby';
import { getOrderBetween } from './getOrderBetween';

export const applyColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], config: ColumnsConfig) => {
    const newColumns = columns.reduce<DataColumnProps<TItem, TId>[]>((acc, c) => {
        const { fix, width, ...restColumnProps } = c;
        const cfg = config[c.key];

        cfg.isVisible &&
            acc.push({
                ...restColumnProps,
                width: cfg.width,
                ...(cfg.fix ? { fix: cfg.fix } : {}),
            });
        return acc;
    }, []);

    return sortBy(newColumns, (i) => config[i.key].order);
};

export const getColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], prevConfig: ColumnsConfig) => {
    const config = { ...prevConfig };

    let prevOrder = 'a';

    columns.forEach((column) => {
        const order = getOrderBetween(prevOrder, null);
        const hasPrevColumnConfig = !!config[column.key];
        const columnConfig = hasPrevColumnConfig ? config[column.key] : {};

        config[column.key] = {
            width: columnConfig.width || column.width,
            fix: hasPrevColumnConfig ? columnConfig.fix : column.fix,
            isVisible: columnConfig.isVisible !== undefined ? columnConfig.isVisible : !column.isHiddenByDefault,
            order: columnConfig.order || getOrderBetween(order, null),
        };
        prevOrder = order;
    });

    return config;
};
