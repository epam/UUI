import * as React from 'react';
import css from './TimelineDemo.scss';

import { Timeline } from './Timeline';

export class TimelineDemo extends React.Component<void> {
    public render() {
        return (
            <div id="root" className={ css.root }>
                <Timeline />
            </div>
        );
    }
}
