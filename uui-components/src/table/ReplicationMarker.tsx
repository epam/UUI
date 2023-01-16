import React, { FC, PointerEventHandler, useContext } from "react";
import css from './ReplicationMarker.scss';
import { DataTableSelectionContext } from "./DataTableSelectionContext";

export interface ReplicationMarkerProps {
    rowIndex: number;
    columnIndex: number;
    color?: string;
}

export const ReplicationMarker: FC<ReplicationMarkerProps> = ({ rowIndex, columnIndex, color }) => {
    const { setSelectionRange } = useContext(DataTableSelectionContext);

    const handlePointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex });
    };

    return <div className={ css.root } style={ { backgroundColor: color } } onPointerDown={ handlePointerDown } onClick={ e => e.stopPropagation() } />;
};