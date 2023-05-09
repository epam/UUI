import { FiltersConfig, TableFiltersConfig } from '../../types';
import { getOrderBetween } from '../../helpers';

export const normalizeFilterConfig = <TFilter>(filtersConfig: FiltersConfig, filterValue: Record<string, any> | undefined, filters: TableFiltersConfig<TFilter>[]) => {
    if (!filters) {
        return undefined;
    }

    const result: FiltersConfig = {};
    const order: string | null = null;
    filters.forEach((filter) => {
        if (filter.isAlwaysVisible || filterValue?.[filter.field as string] || filtersConfig?.[filter.field]) {
            const newOrder = filtersConfig?.[filter?.field]?.order || getOrderBetween(order, null);
            result[filter.field] = {
                isVisible: true,
                order: newOrder,
            };
        }
    });
    return result;
};
