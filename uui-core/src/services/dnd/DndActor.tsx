import * as React from 'react';
import {
    IDndActor, DropPosition, AcceptDropParams, DndActorRenderParams, DropPositionOptions,
    DefaultDropPositionInfo,
} from '../../types/dnd';

import { DndContextState, UuiContexts } from '../../types/contexts';

import {
    isEventTargetInsideDraggable,
    isEventTargetInsideInput,
    releasePointerCaptureOnEventTarget,
} from '../../helpers/events';
import { getSector } from './helpers';
import { uuiDndState, uuiMarkers } from '../../constants';
import { UuiContext } from '../UuiContext';

export interface DndActorProps<TSrcData, TDstData, TPositionInfo = DefaultDropPositionInfo> extends IDndActor<TSrcData, TDstData, TPositionInfo> {
    /** Render callback for DragActor content */
    render(props: DndActorRenderParams<TPositionInfo>): React.ReactNode;
}

const DND_START_THRESHOLD = 5;

interface DndActorState<TPosition> {
    pointerX: number;
    pointerY: number;
    isMouseDown: boolean;

    // Currently dragging this Actor, as drag source
    isDragging: boolean;

    dndState?: DndContextState;

    isMouseOver: boolean;

    // Active insert position into this Actor, which acts as drop target
    positionInfo?: TPosition;

    // Currently dragging any Actor (this or some other)
    isDndInProgress: boolean;
}

const initialState: DndActorState<any> = {
    pointerX: 0,
    pointerY: 0,
    isMouseDown: false,
    isDragging: false,
    isMouseOver: false,
    positionInfo: null,
    isDndInProgress: false,
};

/**
 * This workaround is needed to make it tree-shakable, but it does not look good.
 * It's better to rewrite it to functional component instead.
 * The key point here is to get rid of any static props (like sectorPositionPriorities, contextType).
 */

export const DndActor = TREE_SHAKEABLE_INIT();
function TREE_SHAKEABLE_INIT() {
    return class DndActorComponent<TSrcData = any, TDstData = any, TPositionInfo = DefaultDropPositionInfo>
        extends React.Component<DndActorProps<TSrcData, TDstData, TPositionInfo>, DndActorState<TPositionInfo>> {
        state = initialState;
        static contextType = UuiContext;
        public context: UuiContexts;
        dndRef = React.createRef<HTMLElement>();

        componentDidMount() {
            this.context?.uuiDnD?.subscribe?.(this.contextUpdateHandler);
            window.addEventListener('pointerup', this.windowPointerUpHandler);
            window.addEventListener('pointermove', this.windowPointerMoveHandler);
        }

        componentWillUnmount() {
            window.removeEventListener('pointerup', this.windowPointerUpHandler);
            window.removeEventListener('pointermove', this.windowPointerMoveHandler);
            this.context.uuiDnD.unsubscribe(this.contextUpdateHandler);
        }

        contextUpdateHandler = (dndState: DndContextState) => {
            if (this.state.isDndInProgress !== dndState.isDragging) {
                this.setState({
                    isDndInProgress: dndState.isDragging,
                    dndState,
                });
            }
        };

        windowPointerUpHandler = () => {
            if (this.state.isDragging || this.state.isMouseDown) {
                this.setState(() => initialState);
                this.context.uuiDnD.endDrag();
            }
        };

        windowPointerMoveHandler = (e: MouseEvent) => {
            if (
                !this.state.isMouseDown
                    || e.buttons === 0 // can happen if native drag-n-drop occurs
                    || this.state.isDragging
            ) return;

            if (isEventTargetInsideInput(e, this.dndRef.current)) {
                return;
            }

            const mouseCoords = this.context.uuiDnD.getMouseCoords();
            const dist = Math.sqrt(Math.pow(this.state.pointerX - mouseCoords.mousePageX, 2) + Math.pow(this.state.pointerY - mouseCoords.mousePageY, 2));

            if (dist > DND_START_THRESHOLD) {
                this.context.uuiDnD.startDrag(this.dndRef.current, this.props.srcData, (position: any) => {
                    return this.props.render({
                        isDragGhost: true,
                        isDraggedOver: false,
                        isDraggable: false,
                        isDraggedOut: false,
                        isDropAccepted: false,
                        isDndInProgress: true,
                        eventHandlers: {},
                        classNames: [uuiDndState.dragGhost],
                        ...position,
                    } as DndActorRenderParams<TPositionInfo>);
                });

                this.setState((s) => ({
                    ...s,
                    isDragging: true,
                    isDropAccepted: false /* TBD: fix state when DnD is just started, and drop is accepted by underlying element */,
                }));
            }
        };

        getDropParams(e: React.MouseEvent<HTMLElement>): AcceptDropParams<TSrcData, TDstData> {
            const {
                left, top, width, height,
            } = e.currentTarget.getBoundingClientRect();

            const mouseCoords = this.context.uuiDnD.getMouseCoords();

            return {
                srcData: this.state.dndState.srcData,
                dstData: this.props.dstData,
                offsetLeft: e.clientX - left,
                offsetTop: e.clientY - top,
                srcOffsetLeft: this.state.dndState.srcOffsetLeft,
                srcOffsetTop: this.state.dndState.srcOffsetTop,
                srcWidth: this.state.dndState.srcWidth,
                srcHeight: this.state.dndState.srcHeight,
                targetWidth: width,
                targetHeight: height,
                mouseDx: mouseCoords.mousePageX - mouseCoords.mouseDownPageX,
                mouseDy: mouseCoords.mousePageX - mouseCoords.mouseDownPageX,
            };
        }

        static sectorPositionPriorities: Record<string, DropPosition[]> = {
            0: [
                'top', 'right', 'inside',
            ],
            1: [
                'right', 'top', 'inside',
            ],
            2: [
                'right', 'bottom', 'inside',
            ],
            3: [
                'bottom', 'right', 'inside',
            ],
            4: [
                'bottom', 'left', 'inside',
            ],
            5: [
                'left', 'bottom', 'inside',
            ],
            6: [
                'left', 'top', 'inside',
            ],
            7: [
                'top', 'left', 'inside',
            ],
        };

        getPosition(params: AcceptDropParams<TSrcData, TDstData>, options: DropPositionOptions): DropPosition {
            if (options == null) return null;

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

            if (options.inside) {
                const insideBoxLeft = options.left ? -0.5 : -1;
                const insideBoxRight = options.right ? 0.5 : 1;
                const insideBoxTop = options.top ? -0.5 : -1;
                const insideBoxBottom = options.bottom ? 0.5 : 1;

                if (insideBoxLeft < x && x < insideBoxRight && insideBoxTop < y && y < insideBoxBottom) {
                    return 'inside';
                }
            }

            // Compute the sector#. Basically it's clock-wise angle of mouse pointer normalized to [0,7) range
            //    7 | 0
            // 6    |    1
            // -----|------
            // 5    |    2
            //    4 | 3
            const sector = getSector(x, y);

            // Get possible positions, ordered by priority, from the lookup table
            const optionsByPriority = DndActor.sectorPositionPriorities[sector + ''].filter((o) => options[o]);

            if (optionsByPriority.length > 0) {
                return optionsByPriority[0];
            } else {
                return null;
            }
        }

        render() {
            const params: DndActorRenderParams<TPositionInfo> = {
                isDraggable: !!this.props.srcData,
                isDraggedOut: this.state.isDragging,
                isDraggedOver: this.context.uuiDnD?.isDragging() && this.state.isMouseOver,
                isDropAccepted: this.state.isMouseOver && !!this.state.positionInfo,
                isDragGhost: false,
                isDndInProgress: this.state.isDndInProgress,
                dragData: this.state.isMouseOver ? this.context.uuiDnD.dragData : null,
                eventHandlers: {},
                classNames: null,
                ref: this.dndRef,
                ...(this.state.isMouseOver ? this.state.positionInfo : {}),
            };

            params.classNames = [
                params.isDropAccepted && uuiDndState.dropAccepted, params.isDraggedOut && uuiDndState.draggedOut, params.isDraggable && uuiMarkers.draggable,
            ].filter(Boolean);

            if (!!this.props.srcData) {
                params.eventHandlers.onPointerDown = (e: React.PointerEvent<any>) => {
                    if (isEventTargetInsideDraggable(e, e.currentTarget)) {
                        return;
                    }
                    e.persist();
                    if (e.button === 0) {
                        this.setState(() => {
                            const mouseCoords = this.context.uuiDnD.getMouseCoords();
                            return {
                                ...initialState,
                                isMouseDown: true,
                                pointerX: mouseCoords.mousePageX,
                                pointerY: mouseCoords.mousePageY,
                            };
                        });

                        if (!isEventTargetInsideInput(e, e.currentTarget)) {
                            // This prevents text selection start
                            // dnd don't work without it in ff
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                };
            }

            if (this.props.canAcceptDrop || this.props.getDropPosition) {
                const pointerLeaveHandler = () => {
                    if (this.context.uuiDnD.isDragging()) {
                        this.setState((s) => ({ ...s, isMouseOver: false, positionInfo: null }));
                    }
                };

                const pointerMoveHandler = (e: React.PointerEvent<any>) => {
                    if (this.context.uuiDnD.isDragging()) {
                        if (isEventTargetInsideDraggable(e, e.currentTarget)) {
                            return pointerLeaveHandler();
                        }

                        releasePointerCaptureOnEventTarget(e); // allows you to trigger pointer events on other nodes

                        const dropParams = this.getDropParams(e);

                        let positionInfo: TPositionInfo;
                        if (this.props.getDropPosition) {
                            positionInfo = this.props.getDropPosition(dropParams);
                        } else {
                            const positionOptions = this.props.canAcceptDrop(dropParams);
                            const position = this.getPosition(dropParams, positionOptions) as TPositionInfo;
                            positionInfo = { position } as any;
                        }

                        this.context.uuiDnD.setPosition(positionInfo);
                        this.setState((s) => ({ ...s, isMouseOver: true, positionInfo: positionInfo }));
                    }
                };

                params.eventHandlers.onTouchStart = (e) => e.preventDefault(); // prevent defaults on ios

                params.eventHandlers.onPointerEnter = pointerMoveHandler;
                params.eventHandlers.onPointerMove = pointerMoveHandler;
                params.eventHandlers.onPointerLeave = pointerLeaveHandler;
            }

            params.eventHandlers.onPointerUp = (e) => {
                if (this.context.uuiDnD.isDragging()) {
                    if (isEventTargetInsideDraggable(e, e.currentTarget)) {
                        return;
                    }
                    e.preventDefault();
                    if (!!this.state.positionInfo) {
                        this.props.onDrop && this.props.onDrop({
                            ...this.getDropParams(e),
                            ...this.state.positionInfo,
                        });
                    }
                    this.context.uuiDnD.endDrag();
                    this.setState(() => initialState);
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
    };
}
