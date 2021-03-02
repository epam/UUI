import * as React from 'react';
import { mouseCoords } from '../../helpers/mouseCoords';
import { uuiContextTypes, UuiContexts, DndContextState } from '../../types/contexts';
import { LayoutLayer } from '../../types/objects';

export interface DragGhostProps {
}

interface DragGhostState extends DndContextState {
    mouseX?: number;
    mouseY?: number;
}

export class DragGhost extends React.Component<DragGhostProps, DragGhostState> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;
    private layer: LayoutLayer = null;
    state: DragGhostState = {
        isDragging: false,
    };

    contextUpdateHandler = (state: DndContextState) => {
        if (state.isDragging && !this.layer) {
            this.layer = this.context.uuiLayout && this.context.uuiLayout.getLayer();
        } else if (!state.isDragging && this.layer) {
            this.context.uuiLayout.releaseLayer(this.layer);
            this.layer = null;
        }

        this.setState({ ...state, mouseX: mouseCoords.mousePageX, mouseY: mouseCoords.mousePageY });
    }

    constructor(props: DragGhostProps, context: any) {
        super(props, context);
        this.context.uuiDnD.subscribe(this.contextUpdateHandler);
    }

    onMouseMove = (e: MouseEvent) => {
        if (this.state.isDragging) {
            this.setState({ ...this.state, mouseX: e.clientX, mouseY: e.clientY });
        }
    }

    componentDidMount() {
        window.addEventListener('mousemove', this.onMouseMove);
    }

    componentWillUnmount() {
        this.layer && this.context.uuiLayout.releaseLayer(this.layer);
        window.removeEventListener('mousemove', this.onMouseMove);
    }

    getGhostCoords(mouseX: number, mouseY: number) {
        return {
            left: mouseX + this.state.ghostOffsetX,
            top: mouseY + this.state.ghostOffsetY,
        };
    }

    render() {
        if (!this.state.isDragging || !this.state.renderGhost) {
            return null;
        }

        return <div style={ {
            position: 'fixed',
            width: this.state.ghostWidth,
            left: this.state.mouseX + this.state.ghostOffsetX,
            top: this.state.mouseY + this.state.ghostOffsetY,
            pointerEvents: 'none',
            zIndex: this.layer.zIndex,
        } }
            >
            { this.state.renderGhost() }
        </div>;
    }
}