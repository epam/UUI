import * as React from 'react';
import css from './TimelineDemo.module.scss';

import { Timeline } from './Timeline';

export function TimelineDemo() {
    return (
        <div id="root" className={ css.root }>
            <Timeline />
        </div>
    );
}
