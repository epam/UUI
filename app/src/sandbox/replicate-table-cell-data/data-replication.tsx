import React, { createContext, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { getReplicationHook } from "./getReplicationHook";

interface ReplicationRange<Value = any> {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    startRowId: string;
    startColumnId: string;
    value: Value;
}

export type ReplicationHandler = (replicationRange: ReplicationRange) => void;
export type GetValueToReplicate<Value = any> = (startRowId: string, startColumnId: string) => Value;

export interface ReplicationContextState<Value = any> {
    replicationRange: ReplicationRange;
    setReplicationRange: Dispatch<SetStateAction<ReplicationRange>>;
}

export interface ReplicationContextProviderProps<Value = any> {
    onReplicate: ReplicationHandler;
}

export function defineReplication<Value = any>() {
    const Context = createContext<ReplicationContextState<Value>>(null);

    const ContextProvider: FC<ReplicationContextProviderProps<Value>> = ({ onReplicate, children }) => {
        const [replicationRange, setReplicationRange] = useState<ReplicationRange>(null);
        const value = useMemo<ReplicationContextState<Value>>(() => ({ replicationRange, setReplicationRange }), [replicationRange]);

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

    return [ContextProvider, getReplicationHook(Context)] as const;
}