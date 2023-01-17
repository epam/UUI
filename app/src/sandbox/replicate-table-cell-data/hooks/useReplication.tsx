import React, { PointerEventHandler, useContext, useEffect, useMemo, useState } from "react";
import { DataReplicationContext } from "../context";
import { ReplicationMarkerProps } from "../components";

export interface ReplicationHookParams<Value> {
    columnIndex: number;
    rowIndex: number;
    rowId: string;
    columnId: string;
    value: Value;
    dataType?: string;
}

export function useReplication<Value = any>({ columnIndex, rowIndex, rowId, columnId, value, dataType }: ReplicationHookParams<Value>) {
    const { replicationRange, setReplicationRange, canReplicate } = useContext(DataReplicationContext);
    const [isHovered, setHoverState] = useState(false);

    const handlePointerEnter: PointerEventHandler = () => {
        setHoverState(true);

        if (replicationRange) {
            setReplicationRange({ ...replicationRange, endColumnIndex: columnIndex, endRowIndex: rowIndex });
        }
    };

    const handlePointerDown: PointerEventHandler = () => {
        setReplicationRange({
            value, dataType,
            startRowIndex: rowIndex, startColumnIndex: columnIndex,
            endRowIndex: rowIndex, endColumnIndex: columnIndex,
            startRowId: rowId, startColumnId: columnId,
        });
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

    const isInRange =
        columnIndex >= leftColumnIndex && columnIndex <= rightColumnIndex
        && rowIndex >= topRowIndex && rowIndex <= bottomRowIndex;

    const isSelectedForReplication = isInRange && canReplicate(rowIndex, columnIndex);

    useEffect(() => {
        if (!isSelectedForReplication) {
            setHoverState(false);
        }
    }, [isSelectedForReplication]);

    const { isLeft, isRight, isTop, isBottom } = useMemo(() => isSelectedForReplication
        ? ({
            isLeft: columnIndex === leftColumnIndex || !canReplicate(rowIndex, columnIndex - 1),
            isRight: columnIndex === rightColumnIndex || !canReplicate(rowIndex, columnIndex + 1),
            isTop: rowIndex === topRowIndex || !canReplicate(rowIndex - 1, columnIndex),
            isBottom: rowIndex === bottomRowIndex || !canReplicate(rowIndex + 1, columnIndex),
        })
        : {},
        [replicationRange]);

    const replicationMarkerParams: ReplicationMarkerProps = { isHovered, handlePointerDown, isSelectedForReplication, isLeft, isRight, isTop, isBottom };

    return useMemo(() => ({
        replicationContainerEventHandlers: { onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave },
        valueToReplicate: replicationRange?.value,
        isSelectedForReplication,
        replicationMarkerParams,
    }), [isSelectedForReplication, isLeft, isRight, isTop, isBottom, isHovered, !!replicationRange]);
}
