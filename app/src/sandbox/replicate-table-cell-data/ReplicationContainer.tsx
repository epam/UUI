import React, {
    Context,
    CSSProperties,
    FC,
    PointerEventHandler,
    useContext, useMemo,
    useState,
} from "react";
import { ReplicationContextState } from "./data-replication";
import { ReplicationMarkerProps } from "./ReplicationMarker";

export interface ReplicationContainerProps<RowId = any, ColumnId = any, Value = any> {
    replicationContext: Context<ReplicationContextState<Value>>;
    columnIndex: number;
    rowIndex: number;
    rowId: RowId;
    columnId: ColumnId;
    render: (
        params: {
            targetParams: {
                onPointerEnter: PointerEventHandler;
                onPointerLeave: PointerEventHandler;
                style: CSSProperties;
            };

            markerParams: ReplicationMarkerProps;
            valueToReplicate?: Value;
        },
    ) => JSX.Element;
}

export const ReplicationContainerComponent: FC<ReplicationContainerProps> = ({ replicationContext, columnIndex, rowIndex, columnId, rowId, render }) => {
    const { replicationRange, setReplicationRange, valueToReplicate } = useContext(replicationContext);
    const [isHovered, setHoverState] = useState(false);

    const handlePointerEnter: PointerEventHandler = () => {
        setHoverState(true);
        if (replicationRange) {
            setReplicationRange({ ...replicationRange, endColumnIndex: columnIndex, endRowIndex: rowIndex });
        }
    };

    const handlePointerDown: PointerEventHandler = () => {
        setReplicationRange({ startRowIndex: rowIndex, startColumnIndex: columnIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, startRowId: rowId, startColumnId: columnId });
    };

    const handlePointerLeave: PointerEventHandler = () => {
        setHoverState(false);
    };

    const isHorizontalDirectionABS = replicationRange?.startColumnIndex < replicationRange?.endColumnIndex;
    const isVerticalDirectionABS = replicationRange?.startRowIndex < replicationRange?.endRowIndex;

    const isSelectedForReplication =
        ((columnIndex <= replicationRange?.endColumnIndex && columnIndex >= replicationRange?.startColumnIndex)
            || (columnIndex >= replicationRange?.endColumnIndex && columnIndex <= replicationRange?.startColumnIndex))
        && ((rowIndex <= replicationRange?.endRowIndex && rowIndex >= replicationRange?.startRowIndex)
            || (rowIndex >= replicationRange?.endRowIndex && rowIndex <= replicationRange?.startRowIndex));

    const isLeft = isHorizontalDirectionABS ? columnIndex === replicationRange?.startColumnIndex : columnIndex === replicationRange?.endColumnIndex;
    const isRight = isHorizontalDirectionABS ? columnIndex === replicationRange?.endColumnIndex : columnIndex === replicationRange?.startColumnIndex;
    const isTop = isVerticalDirectionABS ? rowIndex === replicationRange?.startRowIndex : rowIndex === replicationRange?.endRowIndex;
    const isBottom = isVerticalDirectionABS ? rowIndex === replicationRange?.endRowIndex : rowIndex === replicationRange?.startRowIndex;

    return  useMemo(() => render({
        targetParams: { onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave, style: { position: 'relative', userSelect: 'none' } },
        markerParams: { isHovered, handlePointerDown, isSelectedForReplication, isLeft, isRight, isTop, isBottom },
        valueToReplicate,
    }), [isSelectedForReplication, isLeft, isRight, isTop, isBottom, isHovered, !!replicationRange]);
};
