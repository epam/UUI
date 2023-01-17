import { createContext, Dispatch, SetStateAction } from "react";

export interface ReplicationRange<Value = any> {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    startRowId: string;
    startColumnId: string;
    value: Value;
    dataType?: string;
}

export type CanReplicate = (rowIndex: number, columnIndex: number) => boolean;
export type GetValueToReplicate<Value = any> = (startRowId: string, startColumnId: string) => Value;

export interface ReplicationContextState<Value = any> {
    replicationRange: ReplicationRange;
    setReplicationRange: Dispatch<SetStateAction<ReplicationRange>>;
    canReplicate: CanReplicate;
}

export const DataReplicationContext = createContext<ReplicationContextState>(null);
