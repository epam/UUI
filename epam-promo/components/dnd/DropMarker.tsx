import * as React from 'react';
import cx from 'classnames';
import { DndActorRenderParams } from '@epam/uui';
import * as css from './DropMarker.scss';

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