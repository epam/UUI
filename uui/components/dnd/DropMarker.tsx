import * as React from 'react';
import cx from 'classnames';
import { DndActorRenderParams, IHasCX } from '@epam/uui-core';
import css from './DropMarker.module.scss';

export interface DropMarkerProps extends DndActorRenderParams, IHasCX {
    enableBlocker?: boolean;
}

export function DropMarker(props: DropMarkerProps) {
    return props.isDndInProgress
        ? (
            <>
                { props.enableBlocker && <div className={ css.blocker } /> }
                <div className={ cx([
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
