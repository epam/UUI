import { ReactNode, createContext } from 'react';
import { TimelineController } from './TimelineController';

export interface TimelineContextValue {
    timelineController: TimelineController | null;
    timelineGrid: ReactNode | null;
}

export const TimelineContext = createContext<TimelineContextValue>({ timelineController: null, timelineGrid: null });
