import { useContext } from 'react';
import { TimelineContext } from './TimelineContext';

export function useSharedTimelineGrid() {
    const { timelineGrid } = useContext(TimelineContext);

    return timelineGrid;
}
