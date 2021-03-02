import { ColumnsConfig, DataColumnProps } from '../types';
import { getOrderBetween } from './getOrderBetween';

export const getDefaultColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[]) => {
    let config: ColumnsConfig = {};
    let prevOrder = 'a';

    columns.forEach(column => {
        const order = getOrderBetween(prevOrder, null);
        config[column.key] = { isVisible: !column.isHiddenByDefault, order: prevOrder, width: column.width };
        prevOrder = order;
    });

    return config;
};