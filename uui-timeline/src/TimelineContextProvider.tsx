import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
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
    const timelineGrid = useRef<ReactNode>(null);
    
    const updateGrid = useCallback(() => {
        timelineGrid.current = (
            <TimelineGrid
                timelineController={ props.timelineController }
                canvasHeight={ props.canvasHeight }
                className={ props.className }
            />
        );
    }, [props.timelineController]);

    useEffect(() => {
        props.timelineController.subscribe(updateGrid);
        return () => {
            props.timelineController.unsubscribe(updateGrid);
        };
    }, [props.timelineController, updateGrid]);

    return (
        <TimelineContext.Provider value={ { timelineController: props.timelineController, timelineGrid: timelineGrid.current } }>
            {props.children}
        </TimelineContext.Provider>
    );
}
