import React from 'react';
import css from './comparisonGrid.module.scss';

export type TCompRow = { actual: React.ReactNode, expected: React.ReactNode };

export function ComparisonGrid2x2(props: { compArr: TCompRow[] }) {
    const renderRow = (row: TCompRow, key: string) => {
        return (
            <React.Fragment key={ key }>
                <div>{row.actual}</div>
                <div>{row.expected}</div>
            </React.Fragment>
        );
    };

    return (
        <div className={ css.gridWrapper }>
            <div className={ css.grid }>
                {
                    props.compArr.map((compItem, i) => {
                        return renderRow(compItem, String(i));
                    })
                }
            </div>
        </div>
    );
}
