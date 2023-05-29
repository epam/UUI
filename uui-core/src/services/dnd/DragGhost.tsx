import * as React from 'react';
import { mouseCoords } from '../../helpers/mouseCoords';
import { UuiContexts, DndContextState } from '../../types/contexts';
import { LayoutLayer } from '../../types/objects';
import { UuiContext } from '../UuiContext';

export interface DragGhostProps {}

interface DragGhostState extends DndContextState {
    pointerX?: number;
    pointerY?: number;
}

export class DragGhost extends React.Component<DragGhostProps, DragGhostState> {
    static contextType = UuiContext;
    context: UuiContexts;
    private layer?: LayoutLayer;
    state: DragGhostState = {
        isDragging: false,
    };

    onPointerMove = (e: PointerEvent) => {
        if (this.state.isDragging) {
            this.setState((prevState) => {
                return { ...prevState, pointerX: e.clientX, pointerY: e.clientY };
            });
        }
    };

    contextUpdateHandler = (state: DndContextState) => {
        if (state.isDragging && !this.layer) {
            this.layer = this.context.uuiLayout?.getLayer();
        } else if (!state.isDragging && this.layer) {
            this.context.uuiLayout.releaseLayer(this.layer);
            this.layer = undefined;
        }

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
    }

    getGhostCoords(pointerX: number, pointerY: number) {
        const { ghostOffsetX = 0, ghostOffsetY = 0 } = this.state;
        return {
            left: pointerX + ghostOffsetX,
            top: pointerY + ghostOffsetY,
        };
    }

    render() {
        const { ghostOffsetX = 0, ghostOffsetY = 0, pointerX = 0, pointerY = 0, isDragging, renderGhost } = this.state;
        if (!isDragging || !renderGhost) {
            return null;
        }

        return (
            <div
                style={ {
                    position: 'fixed',
                    width: this.state.ghostWidth,
                    left: pointerX + ghostOffsetX,
                    top: pointerY + ghostOffsetY,
                    pointerEvents: 'none',
                    zIndex: this.layer?.zIndex,
                } }
            >
                {renderGhost()}
            </div>
        );
    }
}
