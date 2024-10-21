import { ColumnsConfig, DataColumnProps } from '../types';
import { getOrderBetween } from './getOrderBetween';
import { orderBy } from './orderBy';

export const applyColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], config: ColumnsConfig) => {
    const newColumns = columns.reduce<DataColumnProps<TItem, TId>[]>((acc, c) => {
        const { fix, width, ...restColumnProps } = c;
        const cfg = config[c.key];

        cfg.isVisible
            && acc.push({
                ...restColumnProps,
                width: cfg.width,
                ...(cfg.fix ? { fix: cfg.fix } : {}),
            });
        return acc;
    }, []);

    return orderBy(newColumns, (i) => config[i.key].order);
};

export const getColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], config: ColumnsConfig) => {
    const resultConfig: ColumnsConfig = { };

    const sortedOrders = orderBy(Object.values(config ?? {}).filter(Boolean), (f) => f.order);
    const lastItemOrder: string | null = sortedOrders?.length ? sortedOrders[sortedOrders.length - 1]?.order : null;

    let prevOrder = lastItemOrder || 'a';

    columns.forEach((column) => {
        const hasPrevColumnConfig = !!config?.[column.key];
        if (hasPrevColumnConfig) {
            resultConfig[column.key] = config?.[column.key];
        } else {
            const order = getOrderBetween(prevOrder, null);

            resultConfig[column.key] = {
                width: column.width,
                fix: column.fix ?? (column.isLocked ? 'left' : undefined),
                isVisible: !column.isHiddenByDefault,
                order: order,
            };
            prevOrder = order;
        }
    });

    return resultConfig;
};
