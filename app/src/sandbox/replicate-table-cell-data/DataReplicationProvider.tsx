import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AllowedReplicationDirections, canReplicateByDirection } from "./canReplicateByDirection";
import { canReplicateByDataType } from "./canReplicateByDataType";
import {
    CanReplicate,
    DataReplicationContext,
    ReplicationContextState,
    ReplicationRange,
} from "./data-replication-context";

interface ReplicationContextProviderProps<Value = any> {
    onReplicate: ReplicationHandler<Value>;
    allowedDirections?: AllowedReplicationDirections;
    columnDataTypes?: string[];
}

export type ReplicationHandler<Value = any> = (replicationRange: ReplicationRange<Value>, canReplicate: CanReplicate) => void;

const INITIAL_ALLOWED_DIRECTIONS: AllowedReplicationDirections = {
    top: true,
    right: true,
    bottom: true,
    left: true,
};

type DataReplicationProviderProps<Value = any> = ReplicationContextProviderProps<Value> & Parameters<FC<ReplicationContextProviderProps<Value>>>[0];

export function DataReplicationProvider<Value = any>({ onReplicate, allowedDirections = INITIAL_ALLOWED_DIRECTIONS, columnDataTypes, children }: DataReplicationProviderProps<Value>) {
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

    return <DataReplicationContext.Provider value={ value }>{ children }</DataReplicationContext.Provider>;
}