import { ColumnsConfig, DataColumnProps } from '../types';
import sortBy from 'lodash.sortby';
import { getOrderBetween } from "./getOrderBetween";

export const applyColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], config: ColumnsConfig) => {
    const newColumns: DataColumnProps<TItem, TId>[] = columns.map(i => ({...i, width: config[i.key].width})).filter(i => config[i.key].isVisible);

    return sortBy(newColumns, (i: DataColumnProps<TItem, TId>) => config[i.key].order);
};

export const getColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], config: ColumnsConfig) => {
    config = { ...config };

    let prevOrder = 'a';

    columns.forEach(column => {
        const order = getOrderBetween(prevOrder, null);
        const columnConfig = config[column.key] || {};

        config[column.key] = {
            width: columnConfig.width || column.width,
            isVisible: columnConfig.isVisible !== undefined ? columnConfig.isVisible : !column.isHiddenByDefault ,
            order: columnConfig.order || getOrderBetween(order, null),
        };
        prevOrder = order;
    });

    return config;
};