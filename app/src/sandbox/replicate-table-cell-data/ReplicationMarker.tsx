import React, { FC, PointerEventHandler } from "react";
import * as cx from './ReplicationMarker.scss';
import classNames from "classnames";
import { useReplication } from "./useReplication";

export interface ReplicationMarkerProps {
    handlePointerDown: PointerEventHandler;
    isHovered: boolean;
    isSelectedForReplication: boolean;
    isLeft: boolean;
    isRight: boolean;
    isTop: boolean;
    isBottom: boolean;
}

export const ReplicationMarker: FC<ReplicationMarkerProps> = ({ isHovered, handlePointerDown, isSelectedForReplication, isLeft, isRight, isTop, isBottom }) => {
    if (isSelectedForReplication) {
        return <div className={
            classNames(
                cx.rootSelected,
                {
                    [cx.top]: isTop,
                    [cx.right]: isRight,
                    [cx.bottom]: isBottom,
                    [cx.left]: isLeft,
                })
        } />;
    }

    return isHovered && <div className={ cx.root } onPointerDown={ handlePointerDown } />;
};