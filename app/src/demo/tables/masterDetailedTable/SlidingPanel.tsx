import React, {
    CSSProperties, ReactElement, useEffect, useMemo, useState,
} from 'react';
import cx from 'classnames';
import { Panel } from '@epam/uui';
import css from './SlidingPanel.module.scss';

interface ISlidingPanelProps {
    isVisible: boolean;
    position: 'left' | 'right';
    width: number;
    children: ReactElement<any>;
}

interface CustomCssProperties extends CSSProperties {
    '--sliding-panel-margin': string;
}

const SlidingPanelImpl: React.FC<ISlidingPanelProps> = ({
    isVisible, position, width, children,
}) => {
    const [isFirstMount, setIsFirstMount] = useState(true);

    useEffect(() => {
        if (isVisible && isFirstMount) {
            setIsFirstMount(false);
        }
    }, [isVisible]);

    const style: CustomCssProperties = useMemo(
        () => ({
            width: width + 1 + 'px',
            '--sliding-panel-margin': -width + 'px',
        }),
        [
            width, position, isVisible,
        ],
    );

    const upperPosition = position[0].toUpperCase() + position.slice(1);
    const className = cx(
        css.container,
        css['container' + upperPosition],
        { [css['container' + upperPosition + 'Show']]: isVisible && !isFirstMount },
        { [css['container' + upperPosition + 'Hide']]: !isVisible && !isFirstMount },
    );

    return (
        <Panel background="surface-main" cx={ className } style={ style }>
            {children}
        </Panel>
    );
};

export const SlidingPanel = React.memo(SlidingPanelImpl);
