import { DataColumnProps } from "@epam/uui";
import { PersonsTableState } from "../types";
import { isDefaultColumnsConfig } from "./isDefaultColumnsConfig";

export const isDefaultPresetActive = (value: PersonsTableState, columns: DataColumnProps<any>[]) => {
    const searchParams = new URLSearchParams(location.search);
    return !searchParams.get("presetId") && !value.filter && isDefaultColumnsConfig(value.columnsConfig, columns);
};