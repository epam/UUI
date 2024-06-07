import React from 'react';

export type DropPosition = 'top' | 'bottom' | 'left' | 'right' | 'inside';

export type DropPositionOptions = Partial<Record<DropPosition, boolean>>;

export type DefaultDropPositionInfo = {
    /** Current drop position, indicates where item will be dropped relative to the destination */
    position: DropPosition;
};

/**
 * Parameters which are passed to DndActor canAcceptDrop props, to decide if drop target can accept currently dragged item.
 */
export interface AcceptDropParams<TSrcData, TDstData> {
    /** Source item data. This is the srcData of the actor that is being dropped into. */
    srcData: TSrcData;
    /** Destination item data. This is the dstData of the actor into which the drop is performed. */
    dstData?: TDstData;

    /** X offset of mouse pointer relative to the target's left */
    offsetLeft: number;

    /** Y offset of mouse pointer relative to the target's top */
    offsetTop: number;

    /** X offset of mouse pointer relative to source's left. Captured on drag start */
    srcOffsetLeft: number;

    /** Y offset of mouse pointer relative to source's top. Captured on drag start */
    srcOffsetTop: number;

    /** Source width */
    srcWidth: number;

    /** Source height */
    srcHeight: number;

    /** Target width */
    targetWidth: number;

    /** Target height */
    targetHeight: number;

    /** Mouse delta X from drag start to the current position */
    mouseDx: number;

    /** Mouse delta Н from drag start to the current position */
    mouseDy: number;
}

export type DropParams<TSrcData, TDstData, TPositionInfo = DefaultDropPositionInfo> = AcceptDropParams<TSrcData, TDstData> & TPositionInfo;

export type DndActorRenderParams<TPositionInfo extends Object = DefaultDropPositionInfo> = Partial<TPositionInfo> & {
    /** True, if the element can be dragged. Doesn't mean that DnD is active. */
    isDraggable: boolean;

    /** True, if the element is dragged out. True for placeholder left when it's element it dragged out. False for Drag Ghost. */
    isDraggedOut: boolean;

    /** True, if the element is rendered as Drag Ghost. All other flags are false for drag ghost. */
    isDragGhost: boolean;

    /** True, if the element is being dragged over, even if drop is not accepted by the element (canAcceptDrop returned false) */
    isDraggedOver: boolean;

    /** True, if the element is being dragged over, and drop on it is accepted - canAcceptDrop returned true */
    isDropAccepted: boolean;

    /** True if any drag and drop operation is in progress, even if the element not being dragged */
    isDndInProgress: boolean;

    /** Drag data associated with the element. Specified always, even if there is no DnD operation happening. */
    dragData?: any;

    /**
     * Event handlers. Component is expected to pass these events to the top element it renders.
     * As onClick event on the element will be overwritten, use DndActorProps.onClick to receive click events on the element
     */
    eventHandlers: {
        onTouchStart?(e: React.TouchEvent): void;
        onPointerDown?(e: React.PointerEvent): void;
        onPointerEnter?(e: React.PointerEvent<any>): void;
        onPointerMove?(e: React.PointerEvent<any>): void;
        onPointerLeave?(e: React.PointerEvent<any>): void;
        onPointerUp?(e: React.PointerEvent<any>): void;
    };

    /**
     * CSS class names to add to the element.
     * Some of these markers are used by the DndActor internally, so they must be added even if no used by component itself to apply styles.
     */
    classNames: string[];

    /** Ref to the DOM element to perform DnD actions */
    ref?: React.Ref<any>;
};

export interface IDndActor<TSrcData, TDstData, TPositionInfo = DefaultDropPositionInfo> {
    /** Data used when this component acts as a drag source.
     * If provided, it means this component can be dragged. Can be used in combination with dstData.
     */
    srcData?: TSrcData;

    /** Data used when this component acts as a drop destination.
     * If provided, it means something can be dragged onto this component. Can be used in combination with srcData.
     */
    dstData?: TDstData;

    /** A pure function that gets permitted positions for a drop action */
    canAcceptDrop?(params: AcceptDropParams<TSrcData, TDstData>): DropPositionOptions | null;

    /** A pure function, to decide position relative to an target element (e.g. above/below).
     *
     * By default, we call canAcceptDrop, which can return a set of possible options (top/bottom/above/below/inside),
     * and decide a standard drop position based on this.
     *
     * This option allows to override this, and provide your own position types and logic to decide it based on coordinates.
     *
     * For example, this is used in DataTableRow to decide relative depth or the row in case of tree table.
     */
    getDropPosition?(params: AcceptDropParams<TSrcData, TDstData>): TPositionInfo;

    /** Called when accepted drop action performed on this actor. Usually used to reorder and update items */
    onDrop?(data: DropParams<TSrcData, TDstData, TPositionInfo>): void;
}
