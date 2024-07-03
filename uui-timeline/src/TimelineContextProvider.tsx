import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TimelineContext } from './TimelineContext';
import { TimelineController } from './TimelineController';
import { TimelineGrid } from './TimelineGrid';

export interface TimelineContextProviderProps {
    timelineController: TimelineController;
    canvasHeight: number | null;
    className?: string;
    children: ReactNode[] | ReactNode;
}

export function TimelineContextProvider(props: TimelineContextProviderProps) {
    const [timelineGrid, setTimelineGrid] = useState<ReactNode>(null);
    
    const updateGrid = useCallback(() => {
        setTimelineGrid(
            <TimelineGrid
                timelineController={ props.timelineController }
                canvasHeight={ props.canvasHeight }
                className={ props.className }
            />,
        );
    }, [props.timelineController, setTimelineGrid]);

    useEffect(() => {
        updateGrid();
        return () => {
            setTimelineGrid(null);
        };
    }, []);

    useEffect(() => {
        props.timelineController.subscribe(updateGrid);
        return () => {
            props.timelineController.unsubscribe(updateGrid);
        };
    }, [props.timelineController, updateGrid]);
    
    const value = useMemo(() => ({
        timelineGrid, timelineController: props.timelineController,
    }), [timelineGrid, props.timelineController]);

    return (
        <TimelineContext.Provider value={ value }>
            {props.children}
        </TimelineContext.Provider>
    );
}
