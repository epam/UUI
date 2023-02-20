import React, { useEffect, useState } from 'react';
import { IndicatorBar, Panel } from '@epam/promo';
import css from './BasicExample.scss';

export default function CustomLabelProgressBarExample() {
    const [progress, setProgress] = useState(0);

    const timer = () =>
        setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return parseInt(String(Math.min(prevProgress + diff, 100)), 10);
            });
        }, 500);

    useEffect(() => {
        timer();
        return () => {
            clearInterval(timer());
        };
    }, []);
    return (
        <Panel style={{ flexBasis: '100%' }} cx={css.root}>
            <IndicatorBar progress={progress} />
            <IndicatorBar />
        </Panel>
    );
}
