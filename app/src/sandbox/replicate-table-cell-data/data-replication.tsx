import React, { createContext, Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { getReplicationHook } from "./getReplicationHook";
import { AllowedReplicationDirections, canReplicateByDirection } from "./canReplicateByDirection";
import { canReplicateByDataType } from "./canReplicateByDataType";

interface ReplicationRange<Value = any> {
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
export type ReplicationHandler = (replicationRange: ReplicationRange, canReplicate: CanReplicate) => void;
export type GetValueToReplicate<Value = any> = (startRowId: string, startColumnId: string) => Value;

export interface ReplicationContextState<Value = any> {
    replicationRange: ReplicationRange;
    setReplicationRange: Dispatch<SetStateAction<ReplicationRange>>;
    canReplicate: CanReplicate;
}

export interface ReplicationContextProviderProps<Value = any> {
    onReplicate: ReplicationHandler;
    allowedDirections?: AllowedReplicationDirections;
    columnDataTypes?: string[];
}

const INITIAL_ALLOWED_DIRECTIONS: AllowedReplicationDirections = {
    top: true,
    right: true,
    bottom: true,
    left: true,
};

export function defineReplication<Value = any>() {
    const Context = createContext<ReplicationContextState<Value>>(null);

    const ContextProvider: FC<ReplicationContextProviderProps<Value>> = ({ onReplicate, allowedDirections = INITIAL_ALLOWED_DIRECTIONS, columnDataTypes, children }) => {
        const [replicationRange, setReplicationRange] = useState<ReplicationRange>(null);

        const canReplicate = useCallback<CanReplicate>((rowIndex, columnIndex) => {
            const startCoordinates = { rowIndex: replicationRange?.startRowIndex, columnIndex: replicationRange?.startColumnIndex };

            return canReplicateByDirection(startCoordinates, { rowIndex, columnIndex }, allowedDirections)
                && canReplicateByDataType(columnIndex, replicationRange?.dataType, columnDataTypes);
        }, [allowedDirections, replicationRange?.startRowIndex, replicationRange?.startColumnIndex, replicationRange?.dataType]);

        const value = useMemo<ReplicationContextState<Value>>(() => ({ replicationRange, setReplicationRange, canReplicate }), [replicationRange, canReplicate]);

        useEffect(() => {
            if (!replicationRange) {
                return;
            }

            const handlePointerUp = () => {
                onReplicate(replicationRange, canReplicate);
                setReplicationRange(null);
            };

            document.addEventListener('pointerup', handlePointerUp);
            return () => document.removeEventListener('pointerup', handlePointerUp);
        }, [replicationRange, onReplicate, canReplicate]);

        return <Context.Provider value={ value }>{ children }</Context.Provider>;
    };

    return [ContextProvider, getReplicationHook(Context)] as const;
}