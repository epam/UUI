import * as React from 'react';
import cx from 'classnames';
import { DndActorRenderParams, IHasCX, uuiElement } from '@epam/uui-core';
import css from './DropMarker.module.scss';

interface DropMarkerProps extends DndActorRenderParams, IHasCX {
    /**
     * Pass 'true' to enable Blocker.
     */
    enableBlocker?: boolean;
}

export function DropMarker(props: DropMarkerProps) {
    return props.isDndInProgress
        ? (
            <>
                { props.enableBlocker && <div className={ css.blocker } /> }
                <div className={ cx([
                    uuiElement.dropMarker,
                    css.root,
                    css.marker,
                    css[props.position],
                    props?.cx,
                ]) }
                />
            </>
        )
        : null;
}
