import * as React from 'react';

import { Timeline } from './Timeline';

export class TimelineDemo extends React.Component<void> {
    public render() {
        return (
            <div id="root" style={ { height: 'calc(100vh - 120px)', background: 'white' } }>
                <Timeline />
            </div>
        );
    }
}