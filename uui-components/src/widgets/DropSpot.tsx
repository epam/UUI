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
    /** Event handlers to put on your rendered component */
    eventHandlers: EventHandlers;
}

interface DropSpotState {
    isDraggingOver: boolean;
    isDragStart: boolean;
}

export class DropSpot extends React.Component<DropSpotProps, DropSpotState> {
    entriesCount = 0;
    componentDidMount() {
        window.addEventListener('dragenter', this.onDragStart);
        window.addEventListener('dragleave', this.onDragEnd);
        window.addEventListener('drop', this.onDropHandler);
        window.addEventListener('dragover', this.onDragOverHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('dragenter', this.onDragStart);
        window.removeEventListener('dragleave', this.onDragEnd);
        window.removeEventListener('drop', this.onDropHandler);
        window.removeEventListener('dragover', this.onDragOverHandler);
    }

    onDragOverHandler = (e: DragEvent) => {
        e.preventDefault();
    };

    onDropHandler = () => {
        this.entriesCount = 0;
        this.setState({ isDragStart: false, isDraggingOver: false });
    };

    onDragStart = (e: DragEvent) => {
        e.preventDefault();
        this.entriesCount++;
        this.entriesCount === 1 && e.dataTransfer?.types.includes('Files') && this.setState({ isDragStart: true });
    };

    onDragEnd = (e: DragEvent) => {
        e.preventDefault();
        this.entriesCount--;
        this.entriesCount === 0 && e.dataTransfer?.types.includes('Files') && this.setState({ isDragStart: false });
    };

    onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        this.entriesCount--;
        this.setState({ isDragStart: false, isDraggingOver: false });
        this.props.onFilesDropped(Array.prototype.slice.call(e.dataTransfer.files, 0));
    };

    onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: true });
    };

    onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: true });
    };

    onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        this.setState({ isDraggingOver: false });
    };

    render() {
        const eventHandlers: EventHandlers = {
            onDragEnter: this.onDragEnter,
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
