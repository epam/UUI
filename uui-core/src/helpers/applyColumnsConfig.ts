import { ColumnsConfig, DataColumnProps } from '../types';
import { getOrderBetween } from './getOrderBetween';
import { getOrderComparer } from '../data';

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

    const comparer = getOrderComparer([{ field: 'order', direction: 'asc' }]);

    return [...newColumns].sort((a, b) => {
        const aConfig = config[a.key];
        const bConfig = config[b.key];

        return comparer(aConfig, bConfig);
    });
};

export const getColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], config: ColumnsConfig) => {
    const resultConfig: ColumnsConfig = { };

    const comparer = getOrderComparer([{ field: 'order', direction: 'asc' }]);

    const sortedOrders = Object.values(config ?? {}).filter(Boolean).sort(comparer);

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
                fix: column.fix,
                isVisible: !column.isHiddenByDefault,
                order: order,
            };
            prevOrder = order;
        }
    });

    return resultConfig;
};
