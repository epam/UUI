import * as React from 'react';
import cx from 'classnames';
import { DndActorRenderParams, IHasCX } from '@epam/uui-core';
import css from './DropMarker.module.scss';

export interface DropMarkerProps extends DndActorRenderParams, IHasCX {
    enableBlocker?: boolean;
}

export class DropMarker extends React.Component<DropMarkerProps> {
    render() {
        return this.props.isDndInProgress ? (
            <>
                {this.props.enableBlocker && <div className={ css.blocker } />}
                <div className={ cx([
                    css.marker, css[this.props.position], this.props?.cx,
                ]) }
                />
            </>
        ) : null;
    }
}
