import React, { useEffect, useMemo, useState } from 'react';
import { ProgressBar, Panel } from '@epam/promo';
import css from './BasicExample.scss';

export default function BasicProgressBarExample() {
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
            <ProgressBar cx={css.bar} progress={progress} hideLabel />
            <ProgressBar cx={css.bar} progress={progress} size="18" />
            <ProgressBar cx={css.bar} progress={progress} size="24" striped />
            <ProgressBar progress={progress} label={`${parseInt(`${progress / 10}`, 10)} / 10`} />
        </Panel>
    );
}
