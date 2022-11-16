import React, { useRef } from 'react';
import {
    withPlateEventProvider,
    PortalBody,
    UsePopperPositionOptions,
    ToolbarBase,
    getBalloonToolbarStyles,
    BalloonToolbarProps,
} from '@udecode/plate';

import { useBalloonToolbarPopper } from './useBalloonToolbarPopper';

export const CustomBalloonToolbar = withPlateEventProvider(
    (props: BalloonToolbarProps) => {
        const {
            children,
            theme = 'dark',
            arrow = false,
            portalElement,
            popperOptions: popperOptionsProps = {},
        } = props;

        const popperRef = useRef<HTMLDivElement>(null);

        const popperOptions: UsePopperPositionOptions = {
            popperElement: popperRef.current,
            placement: 'top' as any,
            offset: [0, 8],
            ...popperOptionsProps,
        };

        const { styles: popperStyles, attributes } = useBalloonToolbarPopper(
            popperOptions,
        );

        const styles = getBalloonToolbarStyles({
            popperOptions,
            theme,
            arrow,
            ...props,
        });

        return (
            <PortalBody element={ portalElement }>
                <ToolbarBase
                    ref={ popperRef }
                    //css={ {root: styles.root.css } }
                    className={ styles.root.className }
                    style={ popperStyles.popper }
                    { ...attributes.popper }
                >
                    { children }
                </ToolbarBase>
            </PortalBody>
        );
    },
);