import React from 'react';
import * as css from './DropMarker.scss';
import { DndActorRenderParams, cx } from '@epam/uui';

export interface DropMarkerProps extends DndActorRenderParams {
    enableBlocker?: boolean;
}

export class DropMarker extends React.Component<DropMarkerProps> {
    render() {
        return this.props.isDndInProgress ? <>
            { this.props.enableBlocker && <div
                className={ css.blocker }
            /> }
            <div
                className={ cx({
                    [css.marker]: true,
                    [css[this.props.position]]: true,
                }) }
            />
        </> : null;
    }
}