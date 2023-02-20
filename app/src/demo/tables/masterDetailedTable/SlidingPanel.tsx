import React, { CSSProperties, ReactElement, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Panel } from '@epam/uui';
import css from './SlidingPanel.scss';

interface ISlidingPanelProps {
    isVisible: boolean;
    position: 'left' | 'right';
    width: number;
    children: ReactElement;
}

interface CustomCssProperties extends CSSProperties {
    '--sliding-panel-margin': string;
}

const SlidingPanelImpl: React.FC<ISlidingPanelProps> = ({ isVisible, position, width, children }) => {
    const [isFirstMount, setIsFirstMount] = useState(true);

    useEffect(() => {
        if (isVisible && isFirstMount) {
            setIsFirstMount(false);
        }
    }, [isVisible]);

    const style: CustomCssProperties = useMemo(
        () => ({
            width: width + 'px',
            '--sliding-panel-margin': -width + 'px',
        }),
        [width, position, isVisible]
    );

    const upperPosition = position[0].toUpperCase() + position.slice(1);
    const className = cx(
        css.container,
        css['container' + upperPosition],
        { [css['container' + upperPosition + 'Show']]: isVisible && !isFirstMount },
        { [css['container' + upperPosition + 'Hide']]: !isVisible && !isFirstMount }
    );

    return (
        <Panel background cx={className} style={style}>
            {children}
        </Panel>
    );
};

export const SlidingPanel = React.memo(SlidingPanelImpl);
