import React, { Context, FC, PointerEventHandler, useContext, useEffect, useMemo, useState } from "react";
import { ReplicationContextState } from "./data-replication";
import { ReplicationMarker } from "./ReplicationMarker";

interface Params<Value> {
    columnIndex: number;
    rowIndex: number;
    rowId: string;
    columnId: string;
    value: Value;
}

interface ReplicationContainerHandlers {
    onPointerEnter: PointerEventHandler;
    onPointerLeave: PointerEventHandler;
}

type GetReplicationHook = <Value>(context: Context<ReplicationContextState<Value>>) => (params: Params<Value>) => {
    replicationContainerEventHandlers: ReplicationContainerHandlers;
    ReplicationMarker: FC;
    valueToReplicate: Value;
    isSelectedForReplication: boolean;
};

export const getReplicationHook: GetReplicationHook = context => ({ columnIndex, rowIndex, rowId, columnId, value }) => {
    const { replicationRange, setReplicationRange } = useContext(context);
    const [isHovered, setHoverState] = useState(false);

    const handlePointerEnter: PointerEventHandler = () => {
        setHoverState(true);

        if (replicationRange) {
            setReplicationRange({ ...replicationRange, endColumnIndex: columnIndex, endRowIndex: rowIndex });
        }
    };

    const handlePointerDown: PointerEventHandler = () => {
        setReplicationRange({ value, startRowIndex: rowIndex, startColumnIndex: columnIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, startRowId: rowId, startColumnId: columnId });
    };

    const handlePointerLeave: PointerEventHandler = () => {
        setHoverState(false);
    };

    const isHorizontalDirectionABS = replicationRange?.startColumnIndex <= replicationRange?.endColumnIndex;
    const isVerticalDirectionABS = replicationRange?.startRowIndex <= replicationRange?.endRowIndex;

    const leftColumnIndex = isHorizontalDirectionABS ? replicationRange?.startColumnIndex : replicationRange?.endColumnIndex;
    const rightColumnIndex = isHorizontalDirectionABS ? replicationRange?.endColumnIndex : replicationRange?.startColumnIndex;
    const topRowIndex = isVerticalDirectionABS ? replicationRange?.startRowIndex : replicationRange?.endRowIndex;
    const bottomRowIndex = isVerticalDirectionABS ? replicationRange?.endRowIndex : replicationRange?.startRowIndex;

    const isSelectedForReplication =
        columnIndex >= leftColumnIndex && columnIndex <= rightColumnIndex
        && rowIndex >= topRowIndex && rowIndex <= bottomRowIndex;

    useEffect(() => {
        if (!isSelectedForReplication) {
            setHoverState(false);
        }
    }, [isSelectedForReplication]);

    const isLeft = columnIndex === leftColumnIndex;
    const isRight = columnIndex === rightColumnIndex;
    const isTop = rowIndex === topRowIndex;
    const isBottom = rowIndex === bottomRowIndex;

    const markerParams = { isHovered, handlePointerDown, isSelectedForReplication, isLeft, isRight, isTop, isBottom };

    return useMemo(() => ({
        replicationContainerEventHandlers: { onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave },
        ReplicationMarker: () => <ReplicationMarker { ...markerParams } />,
        valueToReplicate: replicationRange?.value,
        isSelectedForReplication,
    }), [isSelectedForReplication, isLeft, isRight, isTop, isBottom, isHovered, !!replicationRange]);
};
