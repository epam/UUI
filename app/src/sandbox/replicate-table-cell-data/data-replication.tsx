import React, { createContext, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { ReplicationContainerComponent, ReplicationContainerProps } from "./ReplicationContainer";

interface ReplicationRange<RowId = any, ColumnId = any> {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    startRowId: RowId;
    startColumnId: ColumnId;
}

export type ReplicationHandler<RowId = any, ColumnId = any> = (replicationRange: ReplicationRange, idsMaps?: { rowIds?: RowId[], columnIds?: ColumnId[] }) => void;
export type GetValueToReplicate<RowId = any, ColumnId = any, Value = any> = (startRowId: RowId, startColumnId: ColumnId) => Value;

export interface ReplicationContextState<Value = any> {
    replicationRange: ReplicationRange;
    setReplicationRange: Dispatch<SetStateAction<ReplicationRange>>;
    valueToReplicate?: Value;
}

export interface ReplicationContextProviderProps<RowId = any, ColumnId = any, Value = any> {
    onReplicate: ReplicationHandler<RowId, ColumnId>;
    getValueToReplicate?: GetValueToReplicate<RowId, ColumnId, Value>;
}

export function defineReplication<RowId = any, ColumnId = any, Value = any>() {
    const Context = createContext<ReplicationContextState<Value>>(null);

    const ContextProvider: FC<ReplicationContextProviderProps<RowId, ColumnId, Value>> = (
        {
            children,
            onReplicate,
            getValueToReplicate,
        },
    ) => {
        const [replicationRange, setReplicationRange] = useState<ReplicationRange<RowId, ColumnId>>(null);

        const valueToReplicate = useMemo(
            () => getValueToReplicate?.(replicationRange?.startRowId, replicationRange?.startColumnId),
            [getValueToReplicate, replicationRange?.startRowId, replicationRange?.startColumnId],
        );

        const value = useMemo<ReplicationContextState<Value>>(() => ({
            replicationRange,
            setReplicationRange,
            valueToReplicate,
        }), [replicationRange, valueToReplicate]);

        useEffect(() => {
            const handlePointerUp = () => {
                onReplicate(replicationRange);
                setReplicationRange(null);
            };

            document.addEventListener('pointerup', handlePointerUp);
            return () => document.removeEventListener('pointerup', handlePointerUp);
        }, [replicationRange, onReplicate]);

        return <Context.Provider value={ value }>{ children }</Context.Provider>;
    };

    const ReplicationContainer: FC<Omit<ReplicationContainerProps<RowId, ColumnId, Value>, 'replicationContext'>> = props =>
        <ReplicationContainerComponent { ...props } replicationContext={ Context } />;

    return { ContextProvider, ReplicationContainer, Context };
}