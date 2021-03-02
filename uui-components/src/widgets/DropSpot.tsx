import * as React from 'react';

interface EventHandlers {
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
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

    constructor (props: DropSpotProps) {
        super(props);

        window.addEventListener('dragenter', this.onDragStart);
        window.addEventListener('dragleave', this.onDragEnd);

    }

    entriesCount = 0;

    componentWillUnmount() {
        window.removeEventListener('dragenter', this.onDragStart);
        window.removeEventListener('dragleave', this.onDragEnd);
    }

    onDragStart = (e: DragEvent) => {
        e.preventDefault();
        this.entriesCount++;
        this.entriesCount === 1 && e.dataTransfer?.types.includes('Files') && this.setState({ isDragStart: true });
    }

    onDragEnd = (e: DragEvent) => {
        e.preventDefault();
        this.entriesCount--;
        this.entriesCount === 0 && e.dataTransfer?.types.includes('Files') && this.setState({ isDragStart: false });
    }

    onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        this.entriesCount--;
        this.setState({ isDragStart: false, isDraggingOver: false });
        this.props.onFilesDropped(Array.prototype.slice.call(e.dataTransfer.files, 0));
    }

    onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: true });
    }

    onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: false });
    }

    render() {
        const eventHandlers: EventHandlers = {
            onDragEnter: this.onDragEnter,
            onDragLeave: this.onDragLeave,
            onDragOver: this.onDragOver,
            onDrop: this.onDrop,
        };

        return this.props.render({
            ...this.state,
            eventHandlers: eventHandlers,
        });
    }
}