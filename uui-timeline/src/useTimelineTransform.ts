import { useEffect, useMemo, useState } from 'react';
import { TimelineController } from './TimelineController';
import { TimelineTransform } from './TimelineTransform';

export interface UseTimelineTransformProps {
    timelineController: TimelineController;
}

export function useTimelineTransform({ timelineController }: UseTimelineTransformProps) {
    const defaultTimelineTransform = useMemo(
        () => timelineController.getTransform(),
        [timelineController],
    );

    const [timelineTransform, setTimelineTransform] = useState<TimelineTransform>(defaultTimelineTransform);

    useEffect(() => {
        timelineController.subscribe(setTimelineTransform);

        return () => timelineController.unsubscribe(setTimelineTransform);
    }, [timelineController]);

    return timelineTransform;
}
