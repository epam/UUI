import React from 'react';

export type DropPosition = 'top' | 'bottom' | 'left' | 'right' | 'inside';

export type DropPositionOptions = Partial<Record<DropPosition, boolean>>;

export interface AcceptDropParams<TSrcData, TDstData> {
    /** Source item data. This is the srcData of the actor that is being dropped into. */
    srcData: TSrcData;
    /** Destination item data. This is the dstData of the actor into which the drop is performed. */
    dstData?: TDstData;
    offsetLeft: number;
    offsetTop: number;
    targetWidth: number;
    targetHeight: number;
}

export interface DropParams<TSrcData, TDstData> extends AcceptDropParams<TSrcData, TDstData> {
    /** Current drop position, indicates where item will be dropped relative to the destination */
    position: DropPosition;
}

/**
 * Drag'n'drop handlers.
 */
export interface DndEventHandlers {
    /**
     * Handler of an event which is fired when one or more touch points are placed on the drag marker.
     */
    onTouchStart?(e: React.TouchEvent): void;
    /**
     * Handler of an event which is fired when the device transitions from no buttons pressed to at least one button pressed on the drag marker.
     */
    onPointerDown?(e: React.PointerEvent): void;
    /**
     * Handler of an event which is fired when a pointing device is moved into the hit test boundaries of an element or one of its descendants.
     */
    onPointerEnter?(e: React.PointerEvent<any>): void;
    /**
     * Handler of an event which is fired when a pointer changes coordinates.
     */
    onPointerMove?(e: React.PointerEvent<any>): void;
    /**
     * Handler of an event which is fired when a pointing device is moved out of the hit test boundaries of the drag marker.
     */
    onPointerLeave?(e: React.PointerEvent<any>): void;
    /**
     * Handler of an event which is fired when a pointer is no longer active
     */
    onPointerUp?(e: React.PointerEvent<any>): void;
}

export interface DndActorRenderParams {
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

    /** Drop position. Chosen from accepted drop positions according to pointer coordinates */
    position?: DropPosition;

    /**
     * Event handlers. Component is expected to pass these events to the top element it renders.
     * As onClick event on the element will be overwritten, use DndActorProps.onClick to receive click events on the element
     */
    eventHandlers: DndEventHandlers;
    /**
     * CSS class names to add to the element.
     * Some of these markers are used by the DndActor internally, so they must be added even if no used by component itself to apply styles.
     */
    classNames: string[];

    /** Ref to the DOM element to perform DnD actions */
    ref?: React.Ref<any>;
}

export interface IDndActor<TSrcData, TDstData> {
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
    /** Called when accepted drop action performed on this actor. Usually used to reorder and update items */
    onDrop?(data: DropParams<TSrcData, TDstData>): void;
}
