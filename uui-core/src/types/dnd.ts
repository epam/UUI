import React from 'react';

export type DropPosition = 'top' | 'bottom' | 'left' | 'right' | 'inside';

export type DropPositionOptions = Partial<Record<DropPosition, boolean>>;

export interface IDndData<TSrcData, TDstData> {
    /** Source item data. This is the srcData of the actor that is being dropped into. */
    srcData?: TSrcData;
    /** Destination item data. This is the dstData of the actor into which the drop is performed. */
    dstData?: TDstData;
}

export interface AcceptDropParams<TSrcData, TDstData> extends Omit<IDndData<TSrcData, TDstData>, 'srcData'> {
    srcData: TSrcData;
    offsetLeft: number;
    offsetTop: number;
    targetWidth: number;
    targetHeight: number;
}

export interface DropParams<TSrcData, TDstData> extends AcceptDropParams<TSrcData, TDstData> {
    /** Current drop position, indicates where item will be dropped relative to the destination */
    position: DropPosition;
}

export interface DndDropLevelsRenderParams<TId> {
    id: TId;
    path: TId[];
    isDraggedOver?: boolean;
    draggingOverLevel?: number | null;
    onPointerEnter?: (id: TId, position: DropPosition, level: number) => (e: React.PointerEvent<any>) => void;
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
}

export interface IDndActor<TSrcData, TDstData> extends IDndData<TSrcData, TDstData> {
    /** A pure function that gets permitted positions for a drop action */
    canAcceptDrop?(params: AcceptDropParams<TSrcData, TDstData>): DropPositionOptions | null;
    /** Called when accepted drop action performed on this actor. Usually used to reorder and update items */
    onDrop?(data: DropParams<TSrcData, TDstData>): void;
}
