
export type DropPosition = 'top' | 'bottom' | 'left' | 'right' | 'inside';

export type DropPositionOptions = Partial<Record<DropPosition, boolean>>;

export interface AcceptDropParams<TSrcData, TDstData> {
    srcData: TSrcData;
    dstData?: TDstData;
    offsetLeft: number;
    offsetTop: number;
    targetWidth: number;
    targetHeight: number;
}

export interface DropParams<TSrcData, TDstData> extends AcceptDropParams<TSrcData, TDstData> {
    position: DropPosition;
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
        onMouseDown?(e: any): void;
        //onClick?(e: any): void;
        onMouseEnter?(e: React.MouseEvent<any>): void;
        onMouseMove?(e: React.MouseEvent<any>): void;
        onMouseLeave?(e: React.MouseEvent<any>): void;
        onMouseUp?(e: React.MouseEvent<any>): void;
    };

    /**
     * CSS class names to add to the element.
     * Some of these markers are used by the DndActor internally, so they must be added even if no used by component itself to apply styles.
     */
    classNames: string[];
}

export interface IDndActor<TSrcData, TDstData> {
    srcData?: TSrcData;
    dstData?: TDstData;
    canAcceptDrop?(params: AcceptDropParams<TSrcData, TDstData>): DropPositionOptions | null;
    onDrop?(data: DropParams<TSrcData, TDstData>): void;
}