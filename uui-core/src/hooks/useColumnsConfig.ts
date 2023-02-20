import { ColumnsConfig, DataColumnProps } from '../types';
import { applyColumnsConfig, getColumnsConfig } from '../helpers';

export const useColumnsConfig = <TItem, TId>(initialColumns: DataColumnProps<TItem, TId>[], columnsConfig: ColumnsConfig) => {
    const config = getColumnsConfig(initialColumns, columnsConfig);
    const defaultConfig = getColumnsConfig(initialColumns, {});
    const columns = applyColumnsConfig(initialColumns, config);

    return { columns, config, defaultConfig };
};
