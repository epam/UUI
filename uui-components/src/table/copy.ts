import { OnReplicationFn } from "./DataTableSelectionContext";

export const copyOnReplicate: OnReplicationFn<unknown> = (_, { startCellValue }) => startCellValue;
