import { ColumnsConfig, DataColumnProps } from '../types';
import { applyColumnsConfig, getColumnsConfig } from '../helpers';

export const useColumnsConfig = <TItem, TId>(columns: DataColumnProps<TItem, TId>[], columnsConfig: ColumnsConfig) => {
    const sortedColumns = applyColumnsConfig(columns, getColumnsConfig(columns, columnsConfig));
    const config = getColumnsConfig(columns, columnsConfig);
    const defaultConfig = getColumnsConfig(columns, {});

    return { sortedColumns, config, defaultConfig };
};