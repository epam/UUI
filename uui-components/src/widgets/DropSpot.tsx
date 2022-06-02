import * as React from 'react';

interface EventHandlers {
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
}

interface DropSpotProps {
    render(params: DropSpotRenderParams): React.ReactNode;
    onFilesDropped(files: File[]): any;
}

export interface DropSpotRenderParams extends DropSpotState {
    eventHandlers: EventHandlers;
}

interface DropSpotState {
    isDraggingOver: boolean;
    isDragStart: boolean;
}

export class DropSpot extends React.Component<DropSpotProps, DropSpotState> {

    entriesCount = 0;

    componentDidMount() {
        window.addEventListener('dragenter', this.onDragStart as any);
        window.addEventListener('dragleave', this.onDragLeave as any);
        window.addEventListener('drop', this.onDrop as any);
        window.addEventListener('dragover', this.onDragOver as any);

    }

    componentWillUnmount() {
        window.removeEventListener('dragenter', this.onDragStart as any);
        window.removeEventListener('dragleave', this.onDragLeave as any);
        window.removeEventListener('drop', this.onDrop as any);
        window.removeEventListener('dragover', this.onDragOver  as any);
    }

    onDragStart = (e: React.DragEvent) => {
        e.preventDefault();
        this.entriesCount !== 1 && this.entriesCount++;
        this.entriesCount === 1 && e.dataTransfer?.types.includes('Files') && this.setState({ isDragStart: true });
    }

    onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        this.entriesCount--;
        this.setState({ isDragStart: false, isDraggingOver: false });
        this.state.isDraggingOver && this.props.onFilesDropped(Array.prototype.slice.call(e.dataTransfer.files, 0));
    }

    onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: true });
    }

    onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: false });
    }

    render() {
        const eventHandlers: EventHandlers = {
            onDragStart: this.onDragStart,
            onDragLeave: this.onDragLeave,
            onDragOver: this.onDragOver,
            onDrop: this.onDrop,
        };

        return this.props.render({
            ...this.state,
            eventHandlers,
        });
    }
}