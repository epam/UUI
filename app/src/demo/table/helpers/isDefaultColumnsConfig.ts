import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps, getColumnsConfig } from "@epam/uui";

export const isDefaultColumnsConfig = (config: ColumnsConfig | undefined, columns: DataColumnProps<any>[] | undefined) => {
    if (!config) return true;
    
    const defaultConfig = getColumnsConfig(columns, {});
    return isEqual(defaultConfig, config);
};