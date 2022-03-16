import isEqual from "lodash.isequal";
import { ColumnsConfig, DataColumnProps } from "../../../types";
import { getColumnsConfig } from "../../../helpers";

export const isDefaultColumnsConfig = (config: ColumnsConfig | undefined, columns: DataColumnProps<any>[] | undefined) => {
    if (!config) return true;
    
    const defaultConfig = getColumnsConfig(columns, {});
    return isEqual(defaultConfig, config);
};