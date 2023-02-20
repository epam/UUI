import React from 'react';
import css from './DropMarker.scss';
import cx from 'classnames';
import { DndActorRenderParams } from '@epam/uui-core';

export interface DropMarkerProps extends DndActorRenderParams {
    enableBlocker?: boolean;
}

export class DropMarker extends React.Component<DropMarkerProps> {
    render() {
        return this.props.isDndInProgress ? (
            <>
                {this.props.enableBlocker && <div className={css.blocker} />}
                <div
                    className={cx({
                        [css.marker]: true,
                        [css[this.props.position]]: true,
                    })}
                />
            </>
        ) : null;
    }
}
