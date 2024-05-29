import * as React from 'react';
import { UuiContexts } from '../../types/contexts';
import { DndContextState } from './DndContext';
import { LayoutLayer } from '../LayoutContext';
import { UuiContext } from '../UuiContext';

export interface DragGhostProps {}

interface DragGhostState extends DndContextState {
    pointerX?: number;
    pointerY?: number;
}

export class DragGhost extends React.Component<DragGhostProps, DragGhostState> {
    static contextType = UuiContext;
    context: UuiContexts;
    private layer: LayoutLayer = null;
    state: DragGhostState = {
        isDragging: false,
    };

    onPointerMove = (e: PointerEvent) => {
        if (this.state.isDragging) {
            this.setState((state) => ({ ...state, pointerX: e.clientX, pointerY: e.clientY }));
        }
    };

    contextUpdateHandler = (state: DndContextState) => {
        if (state.isDragging && !this.layer) {
            this.layer = this.context.uuiLayout?.getLayer();
        } else if (!state.isDragging && this.layer) {
            this.context.uuiLayout.releaseLayer(this.layer);
            this.layer = null;
        }
        const mouseCoords = this.context.uuiDnD.getMouseCoords();
        this.setState({ ...state, pointerX: mouseCoords.mousePageX, pointerY: mouseCoords.mousePageY });
    };

    componentDidMount() {
        if (!this.context) return;
        this.context.uuiDnD.subscribe(this.contextUpdateHandler);
        window.addEventListener('pointermove', this.onPointerMove);
    }

    componentWillUnmount() {
        this.layer && this.context.uuiLayout.releaseLayer(this.layer);
        window.removeEventListener('pointermove', this.onPointerMove);
        this.context.uuiDnD.unsubscribe(this.contextUpdateHandler);
    }

    getGhostCoords(pointerX: number, pointerY: number) {
        return {
            left: pointerX + this.state.ghostOffsetX,
            top: pointerY + this.state.ghostOffsetY,
        };
    }

    render() {
        if (!this.state.isDragging || !this.state.renderGhost) {
            return null;
        }

        return (
            <div
                style={ {
                    position: 'fixed',
                    width: this.state.ghostWidth,
                    left: 0, // this.state.pointerX + this.state.ghostOffsetX,
                    top: this.state.pointerY + this.state.ghostOffsetY,
                    pointerEvents: 'none',
                    zIndex: this.layer.zIndex,
                } }
            >
                {this.state.renderGhost(this.state.position)}
            </div>
        );
    }
}
