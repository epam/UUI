import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IDndActor, UuiContexts, uuiContextTypes, DropPosition, AcceptDropParams, DndActorRenderParams, DropPositionOptions, DndContextState } from '../../types';
import {  mouseCoords } from '../../helpers';
import { getSector } from './helpers';
import { uuiDndState, uuiMarkers, uuiElement } from '../../constants';
import { isChildHasClass } from '../../helpers';

export type DndActorProps<TSrcData, TDstData> = IDndActor<TSrcData, TDstData> & {
    render(props: DndActorRenderParams): React.ReactNode;
};

const dndStartThreshold = 5;

interface DndActorState {
    mouseDownX: number;
    mouseDownY: number;
    isMouseDown: boolean;
    isDragging: boolean;
    isMouseOver: boolean;
    position?: DropPosition;
    pendingMouseDownTarget?: Element;
    dndContextState: DndContextState;
}

const initialState: DndActorState = {
    mouseDownX: 0,
    mouseDownY: 0,
    isMouseDown: false,
    isDragging: false,
    isMouseOver: false,
    position: null,
    pendingMouseDownTarget: null,
    dndContextState: {
        isDragging: false,
    },
};

export class DndActor<TSrcData = any, TDstData = any>
    extends React.Component<DndActorProps<TSrcData, TDstData>, DndActorState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    state = initialState;

    contextUpdateHandler = (dndContextState: DndContextState) => {
        this.setState({ dndContextState });
    }

    constructor(props: DndActorProps<TSrcData, TDstData>, context: any) {
        super(props, context);
        this.context?.uuiDnD.subscribe(this.contextUpdateHandler);
    }


    componentDidMount() {
        window.addEventListener('mouseup', this.windowMouseUpHandler);
        window.addEventListener('mousemove', this.windowMouseMoveHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.windowMouseUpHandler);
        window.removeEventListener('mousemove', this.windowMouseMoveHandler);
        this.context.uuiDnD.unsubscribe(this.contextUpdateHandler);
    }

    windowMouseUpHandler = (e: Event) => {
        if (this.state.isDragging || this.state.isMouseDown) {
            this.setState(s => initialState);
        }
    }

    windowMouseMoveHandler = (e: MouseEvent) => {

        if (!this.state.isMouseDown
            || e.buttons === 0 // can happen if native drag-n-drop occurs
            || this.state.isDragging
        ) {
            return;
        }

        const node = ReactDom.findDOMNode(this);

        if (isChildHasClass(e.target, node, [uuiElement.input])) {
            return;
        }

        const dist = Math.sqrt(
            Math.pow(this.state.mouseDownX - mouseCoords.mousePageX, 2)
            + Math.pow(this.state.mouseDownY - mouseCoords.mousePageY, 2),
        );

        if (dist > dndStartThreshold) {
            this.context.uuiDnD.startDrag(
                node,
                this.props.srcData,
                () => this.props.render({
                    isDragGhost: true,
                    isDraggedOver: false,
                    isDraggable: false,
                    isDraggedOut: false,
                    isDropAccepted: false,
                    isDndInProgress: true,
                    eventHandlers: {},
                    classNames: [uuiDndState.dragGhost],
                }),
            );

            this.setState(s => ({
                ...s,
                isDragging: true,
                isDropAccepted: false, /* TBD: fix state when DnD is just started, and drop is accepted by underlying element */
            }));
        }
    }

    getDropParams(e: React.MouseEvent<HTMLElement>): AcceptDropParams<TSrcData, TDstData> {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();

        return {
            srcData: this.context.uuiDnD.dragData,
            dstData: this.props.dstData,
            offsetLeft: e.clientX - rect.left,
            offsetTop: e.clientY - rect.top,
            targetWidth: rect.width,
            targetHeight: rect.height,
        };
    }

    static sectorPositionPriorities: Record<string, DropPosition[]> = {
        '0': ['top', 'right', 'inside'],
        '1': ['right', 'top', 'inside'],
        '2': ['right', 'bottom', 'inside'],
        '3': ['bottom', 'right', 'inside'],
        '4': ['bottom', 'left', 'inside'],
        '5': ['left', 'bottom', 'inside'],
        '6': ['left', 'top', 'inside'],
        '7': ['top', 'left', 'inside'],
    };

    getPosition(params: AcceptDropParams<TSrcData, TDstData>, options: DropPositionOptions): DropPosition {
        if (options == null) {
            return null;
        }

        // Compute x/y offsets relative to the center, normalized by element dimensions:
        // -------------------------------
        // |(-1, -1)   (0,-1)     (1, -1)|
        // |                             |
        // |(-1,  0)   (0, 0)     (1,  0)|
        // |                             |
        // |(-1,  1)   (0, 1)     (1,  1)|
        // -------------------------------
        const x = (params.offsetLeft / params.targetWidth - 0.5) * 2;
        const y = (params.offsetTop / params.targetHeight - 0.5) * 2;

        const centerOffset = Math.sqrt(x * x + y * y); // normalized distance to the center

        if (options.inside && centerOffset < (2 / 3)) { // if 'inside' drop is allowed, the center is always drops to inside
            return 'inside';
        }

        // Compute the sector#. Basically it's clock-wise angle of mouse pointer normalized to [0,7) range
        //    7 | 0
        // 6    |    1
        // -----|------
        // 5    |    2
        //    4 | 3
        const sector = getSector(x, y);

        // Get possible positions, ordered by priority, from the lookup table
        const optionsByPriority = DndActor.sectorPositionPriorities[sector + ''].filter(o => options[o]);

        if (optionsByPriority.length > 0) {
            return optionsByPriority[0];
        } else {
            return null;
        }
    }

    render() {
        const params: DndActorRenderParams = {
            isDraggable: !!this.props.srcData,
            isDraggedOut: this.state.isDragging,
            isDraggedOver: this.context.uuiDnD?.isDragging && this.state.isMouseOver,
            isDropAccepted: this.state.isMouseOver && !!this.state.position,
            isDragGhost: false,
            isDndInProgress: this.state.dndContextState.isDragging,
            dragData: this.state.isMouseOver ? this.context.uuiDnD.dragData : null,
            eventHandlers: {},
            position: this.state.isMouseOver ? this.state.position : null,
            classNames: null,
        };

        params.classNames = [
            params.isDropAccepted && uuiDndState.dropAccepted,
            params.isDraggedOut && uuiDndState.draggedOut,
            params.isDraggable && uuiMarkers.draggable,
        ].filter(Boolean);

        if (!!this.props.srcData) {
            params.eventHandlers.onMouseDown = (e: React.MouseEvent<any>) => {
                if (isChildHasClass(e.target, e.currentTarget, [uuiMarkers.draggable])) {
                    return;
                }
                e.persist();
                if (e.button == 0) {
                    this.setState(s => ({
                        ...initialState,
                        isMouseDown: true,
                        mouseDownX: mouseCoords.mousePageX,
                        mouseDownY: mouseCoords.mousePageY,
                        pendingMouseDownTarget: e.target as any,
                    }));

                    if (!isChildHasClass(e.target, e.currentTarget, [uuiElement.input])) {
                        // This prevents text selection start
                        // dnd don't work without it in ff
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            };

            // params.eventHandlers.onClick = e => {
            //     e.preventDefault();
            //     e.stopPropagation();
            // }
        }

        if (this.props.canAcceptDrop) {
            const mouseLeaveHandler = (e: React.MouseEvent<any>) => {
                if (this.context.uuiDnD.isDragging) {
                    this.setState(s => ({ ...s, isMouseOver: false, position: null }));
                }
            };

            const mouseMoveHandler = (e: React.MouseEvent<any>) => {
                if (this.context.uuiDnD.isDragging) {
                    if (isChildHasClass(e.target, e.currentTarget, [uuiMarkers.draggable])) {
                        return mouseLeaveHandler(e);
                    }

                    const dropParams = this.getDropParams(e);
                    const positionOptions = this.props.canAcceptDrop(dropParams);
                    const position = this.getPosition(dropParams, positionOptions);
                    this.setState(s => ({ ...s, isMouseOver: true, position }));
                }
            };

            params.eventHandlers.onMouseEnter = mouseMoveHandler;
            params.eventHandlers.onMouseMove = mouseMoveHandler;
            params.eventHandlers.onMouseLeave = mouseLeaveHandler;
        }

        params.eventHandlers.onMouseUp = e => {
            if (this.context.uuiDnD.isDragging) {
                if (isChildHasClass(e.target, e.currentTarget, [uuiMarkers.draggable])) {
                    return;
                }
                e.preventDefault();
                if (!!this.state.position) {
                    this.props.onDrop && this.props.onDrop({ ...this.getDropParams(e), position: this.state.position });
                }
                this.context.uuiDnD.endDrag();
                this.setState(s => initialState);
            } else {
                // TBD: investigate. Should blur inputs, but doesn't work so far.
                // if (this.state.pendingMouseDownTarget) {
                //     $(this.state.pendingMouseDownTarget).trigger("mousedown");
                //     $(this.state.pendingMouseDownTarget).trigger("mouseup");
                //     $(this.state.pendingMouseDownTarget).trigger("click");
                //     this.setState(s => ({ ...s, pendingMouseDownTarget: null }));
                // }
            }
        };

        return this.props.render(params);
    }
}