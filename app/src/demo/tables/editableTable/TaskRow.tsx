import React, { useRef } from 'react';
import { TimelineGrid, TimelineCanvasProps } from '@epam/uui-timeline';
import { Task } from './types';
import { TaskBar } from './TaskBar';

import css from './TaskRow.module.scss';

export interface TaskRowProps extends TimelineCanvasProps {
    task: Task;
}

export function TaskRow({ task, timelineController }: TaskRowProps) {
    const taskRowRef = useRef<HTMLDivElement>(null);
    const canvasHeight = 36;
    return (
        <div ref={ taskRowRef } className={ css.taskRow }>
          
            <div
                className={ css.layer }
            >
                <TimelineGrid
                    timelineController={ timelineController }
                    canvasHeight={ canvasHeight }
                />
            </div>
            <div
                className={ css.layer }
                onMouseDown={ (e) => timelineController.startDrag(e) }
            >
                <TaskBar task={ task } timelineController={ timelineController } />
            </div>
        </div>
    );
}
